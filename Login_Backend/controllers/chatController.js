
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const StudentAnalysis = require("../model/Studentanalysis"); // Your existing model
const dotenv = require("dotenv");
const fs = require("fs");
const csv = require("csv-parser");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware to verify student role
const verifyStudentRole = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    return decoded.role === 'student' ? decoded : null;
  } catch (error) {
    return null;
  }
};

// Get student data from database using student_id
const getStudentData = async (student_id) => {
  try {
    // Find student by student_id field from StudentAnalysis collection
    const student = await StudentAnalysis.findOne({ student_id: student_id });
    return student;
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
};

// Create personalized prompt for Gemini
// const createPersonalizedPrompt = (studentData, userMessage) => {
//   const courses = ["App Development", "Digital Marketing", "Generative AI", 
//                    "Cyber Security", "Graphic Designing", "Web Development", 
//                    "Data Science", "ML/DL", "MERN Stack", "DevOps", "Business Analytics"];
  
//   // Performance level based on GPA
//   const getPerformanceLevel = (gpa) => {
//     if (gpa >= 3.5) return "Excellent";
//     if (gpa >= 3.0) return "Good";
//     if (gpa >= 2.5) return "Average";
//     return "Needs Improvement";
//   };

//   // Engagement level based on LMS score
//   const getEngagementLevel = (score) => {
//     if (score >= 80) return "Highly Engaged";
//     if (score >= 60) return "Moderately Engaged";
//     if (score >= 40) return "Low Engagement";
//     return "Very Low Engagement";
//   };

//   return `You are an educational AI assistant for EduNex learning platform. You are helping a specific student.
  
//   Student Profile:
//   - Name: ${studentData.name}
//   - GPA: ${studentData.gpa}/4.0 (${getPerformanceLevel(studentData.gpa)} performance)
//   - Study Hours per Week: ${studentData.hours_studied_per_week} hours
//   - Attendance: ${studentData.attendance_percentage}%
//   - Previous Failures: ${studentData.previous_failures}
//   - Quizzes Completed: ${studentData.quizzes_completed}
//   - Assignments Completed: ${studentData.assignments_completed}
//   - LMS Engagement: ${studentData.lms_engagement_score}/100 (${getEngagementLevel(studentData.lms_engagement_score)})
//   - Dropout Risk: ${studentData.dropout_risk}
//   - Predicted Performance: ${studentData.predicted_performance}
  
//   Available Courses on Platform: ${courses.join(', ')}
  
//   Your responsibilities:
//   1. Provide personalized career counseling based on the student's current performance
//   2. ${studentData.dropout_risk !== 'Low' ? 'IMPORTANT: This student has ' + studentData.dropout_risk + ' dropout risk. Provide supportive guidance and concrete strategies to help them stay on track.' : ''}
//   3. Recommend suitable courses from the available list based on their interests and performance
//   4. ${studentData.attendance_percentage < 75 ? 'Address the low attendance issue and suggest ways to improve it.' : ''}
//   5. ${studentData.lms_engagement_score < 60 ? 'Encourage more engagement with the learning platform.' : ''}
//   6. Help with study techniques to improve their weak areas
//   7. Motivate and encourage the student
//   8. Answer course-related queries
//   9. ${studentData.previous_failures > 0 ? 'Be extra supportive as the student has faced failures before.' : ''}
  
//   Important guidelines:
//   - Be supportive and encouraging, especially if performance is low
//   - Never share this student's personal data or mention other students
//   - Focus on practical advice and actionable steps
//   - Tailor your response based on their current performance metrics
//   - If the student asks about courses, recommend based on their strengths and interests
//   - For high dropout risk students, prioritize retention strategies
  
//   Student's Question: ${userMessage}
  
//   Provide a helpful, personalized, and encouraging response. Use the student's name occasionally to make it more personal.`;
// };





const createPersonalizedPrompt = (studentData, userMessage) => {
  const courses = ["App Development", "Digital Marketing", "Generative AI", 
                   "Cyber Security", "Graphic Designing", "Web Development", 
                   "Data Science", "ML/DL", "MERN Stack", "DevOps", "Business Analytics"];
  
  // Performance level based on GPA
  const getPerformanceLevel = (gpa) => {
    if (gpa >= 3.5) return "Excellent";
    if (gpa >= 3.0) return "Good";
    if (gpa >= 2.5) return "Average";
    return "Needs Improvement";
  };

  // Engagement level based on LMS score
  const getEngagementLevel = (score) => {
    if (score >= 80) return "Highly Engaged";
    if (score >= 60) return "Moderately Engaged";
    if (score >= 40) return "Low Engagement";
    return "Very Low Engagement";
  };

  return `You are an educational AI assistant for EduNex AI, an educational analytics platform. You ONLY provide educational guidance, career counseling, and platform navigation help.

STUDENT PROFILE:
- Name: ${studentData.name}
- GPA: ${studentData.gpa}/4.0 (${getPerformanceLevel(studentData.gpa)} performance)
- Study Hours: ${studentData.hours_studied_per_week} hours/week
- Attendance: ${studentData.attendance_percentage}%
- Previous Failures: ${studentData.previous_failures}
- Quizzes Completed: ${studentData.quizzes_completed}
- Assignments Completed: ${studentData.assignments_completed}
- LMS Engagement: ${studentData.lms_engagement_score}/100 (${getEngagementLevel(studentData.lms_engagement_score)})
- Dropout Risk: ${studentData.dropout_risk}
- Predicted Performance: ${studentData.predicted_performance}

AVAILABLE COURSES: ${courses.join(', ')}

PLATFORM NAVIGATION GUIDE:
- Dashboard: View performance and institute progress charts after login
- Analysis Page: http://localhost:5173/analysis (for new students to get predictions)
- Settings: http://localhost:5173/settings (to change password)
- Send Feedback: Available in sidebar to contact admin/teachers
- Notifications: Check sidebar for admin announcements
- Login/Register: http://localhost:5173/login or http://localhost:5173/register

PLATFORM WORKFLOW:
1. Create Account → Set up profile
2. Input Data → Add academic records
3. Get Predictions → AI analyzes performance and dropout risk
4. Take Action → Use recommendations to improve

RESPONSE GUIDELINES:
1. LENGTH: Keep responses concise for simple queries (2-3 sentences). Provide detailed explanations only when necessary (max 1-2 paragraphs).

2. PERSONALIZATION: Use the student's name sparingly - only in important moments, not in every response.

3. SCOPE: You ONLY discuss:
   - Educational guidance and career counseling
   - Course recommendations and study tips
   - Platform navigation and features
   - Academic performance analysis
   - Learning strategies and resources

4. RESTRICTIONS: If asked about non-educational topics (sports, politics, cooking, entertainment, etc.), politely respond:
   "I'm specifically designed for educational guidance and career counseling. I can help you with course selection, study strategies, performance improvement, and navigating the EduNex AI platform. What educational topic can I assist you with?"

5. PRIORITY RESPONSES:
   ${studentData.dropout_risk !== 'Low' ? `- URGENT: Address ${studentData.dropout_risk} dropout risk with specific action steps` : ''}
   ${studentData.attendance_percentage < 75 ? '- Address low attendance with practical solutions' : ''}
   ${studentData.lms_engagement_score < 60 ? '- Suggest ways to increase platform engagement' : ''}
   ${studentData.previous_failures > 0 ? '- Provide extra emotional support and recovery strategies' : ''}

6. TEACHING CAPABILITY: When students ask to learn specific subjects, provide:
   - Brief, clear explanations
   - Key concepts and fundamentals
   - Practice problems or examples
   - Recommended resources from available courses

7. CONVERSATION STYLE:
   - Be warm but professional
   - Avoid repetitive greetings
   - Focus on actionable advice
   - Use encouraging tone without being overly cheerful

Student's Question: ${userMessage}

Respond appropriately based on the guidelines above. Keep the response focused, helpful, and within your educational scope.`;
};





// ===================== TEACHER FUNCTIONS =====================

// Get teacher's students data from CSV
const getTeacherStudentsData = (teacherName, batchId, course) => {
  return new Promise((resolve, reject) => {
    const students = [];
    const monthsSet = new Set();
    
    fs.createReadStream("data/all_batches.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (
          row.teacher_name === teacherName &&
          row.batch_id === batchId &&
          row.course === course
        ) {
          if (row.month) monthsSet.add(row.month);
          students.push({
            student_id: row.student_id,
            name: row.Name,
            gpa: parseFloat(row.gpa) || 0,
            attendance: parseFloat(row.attendance_percentage) || 0,
            attendance_rate: parseFloat(row.attendance_rate) || 0,
            assignments: parseInt(row.assignments_completed) || 0,
            quizzes: parseInt(row.quizzes_completed) || 0,
            lms_score: parseFloat(row.lms_engagement_score) || 0,
            dropout_risk: row.dropout_risk || "Unknown",
            performance: row.predicted_performance || "Unknown",
            previous_failures: parseInt(row.previous_failures) || 0,
            hours_studied: parseFloat(row.hours_studied_per_week) || 0,
            month: row.month
          });
        }
      })
      .on("end", () => {
        resolve({
          students,
          months: Array.from(monthsSet),
          totalStudents: students.length
        });
      })
      .on("error", reject);
  });
};

// Create teacher prompt
const createTeacherPrompt = (teacherData, studentsData, userMessage) => {
  const { students, totalStudents } = studentsData;
  
  if (totalStudents === 0) {
    return `You are an AI teaching assistant. No students found for your batch ${teacherData.batch_id} in ${teacherData.courses} course.`;
  }

  // Calculate statistics
  const avgGpa = (students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents).toFixed(2);
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1);
  const avgAssignments = (students.reduce((sum, s) => sum + s.assignments, 0) / totalStudents).toFixed(1);
  const avgQuizzes = (students.reduce((sum, s) => sum + s.quizzes, 0) / totalStudents).toFixed(1);
  
  const highRiskStudents = students.filter(s => s.dropout_risk === "High");
  const mediumRiskStudents = students.filter(s => s.dropout_risk === "Medium");
  const lowRiskStudents = students.filter(s => s.dropout_risk === "Low");
  
  const excellentStudents = students.filter(s => s.performance === "Excellent");
  const goodStudents = students.filter(s => s.performance === "Good");
  const averageStudents = students.filter(s => s.performance === "Average");
  const poorStudents = students.filter(s => s.performance === "Poor");
  
  // Top and struggling students
  const topStudents = students
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 5)
    .map(s => `${s.name} (GPA: ${s.gpa.toFixed(2)}, Attendance: ${s.attendance}%, Performance: ${s.performance})`);
    
  const strugglingStudents = students
    .filter(s => s.dropout_risk === "High" || s.gpa < 2.0)
    .slice(0, 10)
    .map(s => `${s.name} (GPA: ${s.gpa.toFixed(2)}, Risk: ${s.dropout_risk}, Attendance: ${s.attendance}%, Failures: ${s.previous_failures})`);

  // Check if asking about specific student
  let specificStudentInfo = "";
  const studentNamePatterns = [
    /tell me about ([\w\s]+)/i,
    /information about ([\w\s]+)/i,
    /details of ([\w\s]+)/i,
    /performance of ([\w\s]+)/i,
    /how is ([\w\s]+) doing/i,
    /student ([\w\s]+)/i,
    /([\w\s]+) performance/i,
    /([\w\s]+) details/i,
    /check ([\w\s]+)/i,
    /show me ([\w\s]+)/i
  ];

  for (const pattern of studentNamePatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      const searchName = match[1].trim().toLowerCase();
      const student = students.find(s => 
        s.name.toLowerCase().includes(searchName) ||
        searchName.includes(s.name.toLowerCase())
      );
      
      if (student) {
        specificStudentInfo = `
================== SPECIFIC STUDENT DETAILS ==================
Name: ${student.name}
Student ID: ${student.student_id}
Month: ${student.month}

ACADEMIC PERFORMANCE:
- GPA: ${student.gpa.toFixed(2)}/4.0
- Predicted Performance: ${student.performance}
- Dropout Risk Level: ${student.dropout_risk}

ATTENDANCE & ENGAGEMENT:
- Attendance Rate: ${student.attendance}%
- LMS Engagement Score: ${student.lms_score}/100
- Study Hours per Week: ${student.hours_studied}

COURSEWORK COMPLETION:
- Assignments Completed: ${student.assignments}
- Quizzes Completed: ${student.quizzes}
- Previous Failures: ${student.previous_failures}

RECOMMENDATIONS FOR THIS STUDENT:
${student.dropout_risk === "High" ? "⚠️ URGENT: This student needs immediate intervention. Schedule a one-on-one meeting." : ""}
${student.attendance < 60 ? "- Focus on improving attendance through regular check-ins" : ""}
${student.gpa < 2.5 ? "- Provide additional tutoring and study resources" : ""}
${student.assignments < 5 ? "- Follow up on assignment submissions" : ""}
${student.lms_score < 50 ? "- Encourage more platform engagement" : ""}
===============================================================

Please provide detailed analysis and personalized intervention strategies for this student.`;
        break;
      }
    }
  }

  return `You are an AI teaching assistant for EduNex AI platform. You help teachers analyze student performance, identify at-risk students, and provide teaching strategies.

TEACHER INFORMATION:
==================
- Name: Professor ${teacherData.name}
- Batch: ${teacherData.batch_id}
- Course: ${teacherData.courses}
- Total Students: ${totalStudents}

CLASS STATISTICS:
=================
ACADEMIC METRICS:
- Average GPA: ${avgGpa}/4.0
- Average Attendance: ${avgAttendance}%
- Average Assignments Completed: ${avgAssignments}
- Average Quizzes Completed: ${avgQuizzes}

RISK DISTRIBUTION:
- High Risk Students: ${highRiskStudents.length} (${((highRiskStudents.length/totalStudents)*100).toFixed(1)}%)
- Medium Risk Students: ${mediumRiskStudents.length} (${((mediumRiskStudents.length/totalStudents)*100).toFixed(1)}%)
- Low Risk Students: ${lowRiskStudents.length} (${((lowRiskStudents.length/totalStudents)*100).toFixed(1)}%)

PERFORMANCE DISTRIBUTION:
- Excellent: ${excellentStudents.length} students
- Good: ${goodStudents.length} students
- Average: ${averageStudents.length} students
- Poor: ${poorStudents.length} students

TOP 5 PERFORMING STUDENTS:
==========================
${topStudents.length > 0 ? topStudents.join('\n') : 'No top performers identified'}

STUDENTS NEEDING IMMEDIATE ATTENTION:
=====================================
${strugglingStudents.length > 0 ? strugglingStudents.join('\n') : 'No struggling students identified'}

${specificStudentInfo}

CAPABILITIES AS YOUR AI ASSISTANT:
==================================
1. STUDENT ANALYSIS: Ask me about any student by name for detailed performance metrics
2. RISK ASSESSMENT: I can identify and explain dropout risks for individuals or groups
3. INTERVENTION STRATEGIES: Get personalized teaching strategies for struggling students
4. PERFORMANCE TRENDS: Analyze class-wide patterns and trends
5. COMPARATIVE ANALYSIS: Compare student performances and identify outliers
6. TEACHING RECOMMENDATIONS: Receive evidence-based teaching methods for your class

QUICK QUERIES YOU CAN ASK:
- "Tell me about [student name]"
- "Show me all high-risk students"
- "Who are the top performers?"
- "Give me strategies for improving class attendance"
- "How can I help struggling students?"
- "Analyze the class performance"

ALL STUDENTS IN YOUR CLASS (${totalStudents} total):
=====================================================
${students.slice(0, 20).map(s => `- ${s.name} (ID: ${s.student_id}, GPA: ${s.gpa.toFixed(2)}, Risk: ${s.dropout_risk})`).join('\n')}
${totalStudents > 20 ? `... and ${totalStudents - 20} more students` : ''}

Teacher's Question: ${userMessage}

RESPONSE GUIDELINES:
- Provide data-driven insights with specific numbers
- Suggest practical, actionable interventions
- If asked about a specific student, give comprehensive details
- Recommend evidence-based teaching strategies
- Focus on improving student outcomes and reducing dropout risk
- Be professional but supportive in tone`;
};






// ===================== MAIN CHAT HANDLER =====================

exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // User data from your protect middleware (req.user)
    const userRole = req.user.role;
    const userId = req.user.id;
    
    console.log("Chat Request:", {
      role: userRole,
      userId: userId,
      message: message.substring(0, 50) + "..."
    });

    let personalizedPrompt;
    let responseData = { 
      role: userRole,
      timestamp: new Date()
    };

    // ========== HANDLE STUDENT ROLE ==========
    if (userRole === 'student') {
      const student_id = req.user.student_id;
      
      if (!student_id) {
        return res.status(400).json({ error: "Student ID not found in token" });
      }

      // Get student data from MongoDB
      const studentData = await getStudentData(student_id);
      if (!studentData) {
        return res.status(404).json({ error: "Student data not found in database" });
      }

      console.log("Student Data Found:", {
        name: studentData.name,
        student_id: studentData.student_id,
        dropout_risk: studentData.dropout_risk,
        gpa: studentData.gpa
      });

      // Create student prompt
      personalizedPrompt = createPersonalizedPrompt(studentData, message);

      // Add student info to response
      responseData.studentName = studentData.name;
      responseData.studentStats = {
        dropoutRisk: studentData.dropout_risk,
        performance: studentData.predicted_performance,
        attendance: studentData.attendance_percentage,
        gpa: studentData.gpa
      };
    } 
    // ========== HANDLE TEACHER ROLE ==========
    else if (userRole === 'teacher') {
      const teacherName = req.user.name;
      const batchId = req.user.batch_id;
      const course = req.user.courses;

      if (!teacherName || !batchId || !course) {
        return res.status(400).json({ 
          error: "Teacher information incomplete. Please ensure batch_id and courses are set.",
          providedData: {
            name: teacherName,
            batch_id: batchId,
            courses: course
          }
        });
      }

      console.log("Teacher Request:", {
        name: teacherName,
        batch: batchId,
        course: course
      });

      // Get students data from CSV
      const studentsData = await getTeacherStudentsData(teacherName, batchId, course);
      
      if (studentsData.students.length === 0) {
        return res.json({
          role: userRole,
          reply: `No students found for Batch ${batchId} in ${course} course. Please check if the batch and course information is correct.`,
          teacherName: teacherName,
          classStats: {
            totalStudents: 0,
            avgGpa: "0",
            avgAttendance: "0",
            highRiskCount: 0,
            mediumRiskCount: 0,
            lowRiskCount: 0
          }
        });
      }

      console.log(`Found ${studentsData.totalStudents} students for teacher ${teacherName}`);

      // Create teacher prompt
      personalizedPrompt = createTeacherPrompt(req.user, studentsData, message);

      // Calculate and add class statistics
      const students = studentsData.students;
      responseData.teacherName = teacherName;
      responseData.classStats = {
        totalStudents: studentsData.totalStudents,
        avgGpa: (students.reduce((sum, s) => sum + s.gpa, 0) / studentsData.totalStudents).toFixed(2),
        avgAttendance: (students.reduce((sum, s) => sum + s.attendance, 0) / studentsData.totalStudents).toFixed(1),
        avgAssignments: (students.reduce((sum, s) => sum + s.assignments, 0) / studentsData.totalStudents).toFixed(1),
        avgQuizzes: (students.reduce((sum, s) => sum + s.quizzes, 0) / studentsData.totalStudents).toFixed(1),
        highRiskCount: students.filter(s => s.dropout_risk === "High").length,
        mediumRiskCount: students.filter(s => s.dropout_risk === "Medium").length,
        lowRiskCount: students.filter(s => s.dropout_risk === "Low").length
      };
    } 
    // ========== HANDLE OTHER ROLES ==========
    else {
      return res.status(403).json({ 
        error: "Access denied. Only students and teachers can use the AI chat assistant.",
        role: userRole
      });
    }

    // Generate AI response using Gemini
    console.log("Generating AI response...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(personalizedPrompt);
    const reply = result.response.text();

    // Send successful response
    responseData.reply = reply;
    responseData.success = true;
    
    console.log("Response sent successfully");
    res.json(responseData);

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ 
      error: "Failed to process your request. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Save chat history for analytics
const saveChatHistory = async (user_id, role, message, response) => {
  try {
    // Uncomment and implement if you have a ChatHistory model
    // const ChatHistory = require("../models/ChatHistory");
    // await ChatHistory.create({
    //   user_id,
    //   role,
    //   message,
    //   response,
    //   timestamp: new Date()
    // });
    console.log("Chat history saved");
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};











// // controllers/chatController.js
// exports.chatWithGemini = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     // Student data middleware se aya (req.user)
//     const student_id = req.user.student_id;
//     if (!student_id) {
//       return res.status(400).json({ error: "Student ID not found in token" });
//     }

//     // Get student data
//     const studentData = await getStudentData(student_id);
//     if (!studentData) {
//       return res.status(404).json({ error: "Student data not found" });
//     }

//     console.log("Student Data Found:", {
//       name: studentData.name,
//       student_id: studentData.student_id,
//       dropout_risk: studentData.dropout_risk,
//     });

//     // Personalized prompt
//     const personalizedPrompt = createPersonalizedPrompt(studentData, message);

//     // Gemini response
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const result = await model.generateContent(personalizedPrompt);
//     const reply = result.response.text();

//     res.json({
//       reply,
//       studentName: studentData.name,
//       role: req.user.role,
//       studentStats: {
//         dropoutRisk: studentData.dropout_risk,
//         performance: studentData.predicted_performance,
//         attendance: studentData.attendance_percentage,
//       },
//     });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     res.status(500).json({ error: "Failed to process your request" });
//   }
// };


// // Optional: Save chat history for future analysis
// const saveChatHistory = async (student_id, message, response) => {
//   // Implement if you want to save chat history
//   // const ChatHistory = require("../models/ChatHistory");
//   // await ChatHistory.create({
//   //   student_id,
//   //   message,
//   //   response,
//   //   timestamp: new Date()
//   // });
// };






















// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv =require("dotenv");

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// exports.chatWithGemini = async (req, res) => {
//   const { message } = req.body;

//   if (!message) return res.status(400).json({ error: "Message is required" });

//   try {
//     // Model select karna hoga
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Response generate karo
//     const result = await model.generateContent(message);

//     const reply = result.response.text();
//     res.json({ reply });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     res.status(500).json({ error: "Gemini API failed" });
//   }
// };
