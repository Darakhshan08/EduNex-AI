
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const StudentAnalysis = require("../model/Studentanalysis"); // Your existing model
const dotenv = require("dotenv");
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

  return `You are an educational AI assistant for EduNex learning platform. You are helping a specific student.
  
  Student Profile:
  - Name: ${studentData.name}
  - GPA: ${studentData.gpa}/4.0 (${getPerformanceLevel(studentData.gpa)} performance)
  - Study Hours per Week: ${studentData.hours_studied_per_week} hours
  - Attendance: ${studentData.attendance_percentage}%
  - Previous Failures: ${studentData.previous_failures}
  - Quizzes Completed: ${studentData.quizzes_completed}
  - Assignments Completed: ${studentData.assignments_completed}
  - LMS Engagement: ${studentData.lms_engagement_score}/100 (${getEngagementLevel(studentData.lms_engagement_score)})
  - Dropout Risk: ${studentData.dropout_risk}
  - Predicted Performance: ${studentData.predicted_performance}
  
  Available Courses on Platform: ${courses.join(', ')}
  
  Your responsibilities:
  1. Provide personalized career counseling based on the student's current performance
  2. ${studentData.dropout_risk !== 'Low' ? 'IMPORTANT: This student has ' + studentData.dropout_risk + ' dropout risk. Provide supportive guidance and concrete strategies to help them stay on track.' : ''}
  3. Recommend suitable courses from the available list based on their interests and performance
  4. ${studentData.attendance_percentage < 75 ? 'Address the low attendance issue and suggest ways to improve it.' : ''}
  5. ${studentData.lms_engagement_score < 60 ? 'Encourage more engagement with the learning platform.' : ''}
  6. Help with study techniques to improve their weak areas
  7. Motivate and encourage the student
  8. Answer course-related queries
  9. ${studentData.previous_failures > 0 ? 'Be extra supportive as the student has faced failures before.' : ''}
  
  Important guidelines:
  - Be supportive and encouraging, especially if performance is low
  - Never share this student's personal data or mention other students
  - Focus on practical advice and actionable steps
  - Tailor your response based on their current performance metrics
  - If the student asks about courses, recommend based on their strengths and interests
  - For high dropout risk students, prioritize retention strategies
  
  Student's Question: ${userMessage}
  
  Provide a helpful, personalized, and encouraging response. Use the student's name occasionally to make it more personal.`;
};

// controllers/chatController.js
exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Student data middleware se aya (req.user)
    const student_id = req.user.student_id;
    if (!student_id) {
      return res.status(400).json({ error: "Student ID not found in token" });
    }

    // Get student data
    const studentData = await getStudentData(student_id);
    if (!studentData) {
      return res.status(404).json({ error: "Student data not found" });
    }

    console.log("Student Data Found:", {
      name: studentData.name,
      student_id: studentData.student_id,
      dropout_risk: studentData.dropout_risk,
    });

    // Personalized prompt
    const personalizedPrompt = createPersonalizedPrompt(studentData, message);

    // Gemini response
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(personalizedPrompt);
    const reply = result.response.text();

    res.json({
      reply,
      studentName: studentData.name,
      role: req.user.role,
      studentStats: {
        dropoutRisk: studentData.dropout_risk,
        performance: studentData.predicted_performance,
        attendance: studentData.attendance_percentage,
      },
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
};


// Optional: Save chat history for future analysis
const saveChatHistory = async (student_id, message, response) => {
  // Implement if you want to save chat history
  // const ChatHistory = require("../models/ChatHistory");
  // await ChatHistory.create({
  //   student_id,
  //   message,
  //   response,
  //   timestamp: new Date()
  // });
};














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
