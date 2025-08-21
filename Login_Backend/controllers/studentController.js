const axios = require("axios");
const Studentanalysis = require("../model/Studentanalysis");


exports.studentanalysis = async (req, res) => {
  try {
    const studentInput = req.body;

    // 1) Call Python API for prediction
    const predictionResponse = await axios.post("http://localhost:3001/predict_user", studentInput);
    const prediction = predictionResponse.data;

    // 2) Merge input + prediction
    const studentData = {
      student_id: studentInput.student_id,
      name: studentInput.student_name,   // mapping frontend ka "student_name" → model ka "name"
      gpa: studentInput.gpa,
      hours_studied_per_week: studentInput.hours_studied_per_week,
      previous_failures: studentInput.previous_failures,
      attendance_percentage: studentInput.attendance_percentage,
      quizzes_completed: studentInput.quizzes_completed,
      assignments_completed: studentInput.assignments_completed,
      lms_engagement_score: studentInput.lms_engagement_score,
      dropout_risk: prediction.dropout_risk,
      predicted_performance: prediction.predicted_performance
    };

    // 3) Duplicate check by student_id
    const existing = await Studentanalysis.findOne({ student_id: studentInput.student_id });
    if (existing) {
      return res.status(400).json({ 
        message: "Student with this ID already exists", 
        existingStudent: existing 
      });
    }

    // 4) Create new document
    const newStudent = await Studentanalysis.create(studentData);

    // 5) Send response
    res.status(201).json({ 
      message: "Student created successfully", 
      data: newStudent 
    });

  } catch (err) {
    console.error("Error in studentanalysis:", err.message);
    res.status(500).json({ error: "Failed to create student", detail: err.message });
  }
};
