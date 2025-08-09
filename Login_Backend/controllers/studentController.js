const Studentanalysis = require("../model/Studentanalysis");
const { studentValidationSchema } = require("../validations/studentValidation");




exports.studentanalysis = async (req, res, next) => {
    const { error } = studentValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    const {student_id, name, predicted_performance,gpa,hours_studied_per_week,previous_failures,attendance_percentage,quizzes_completed,assignments_completed,lms_engagement_score,dropout_risk } = req.body;
  
    try {
      const exist = await Studentanalysis.findOne({ student_id, name  });
      if (exist) return res.status(400).json({ message: "Student already exists" });
  
      // ✅ Create new user directly using the model
      const newStudent = await Studentanalysis.insertMany({
        student_id,
        name,
        predicted_performance,
        gpa,
        hours_studied_per_week,
        previous_failures,
        attendance_percentage,
        quizzes_completed,
        assignments_completed,
        lms_engagement_score,
        dropout_risk
      });
  
      res.status(201).json({ message: "Registered", data: newStudent });
    } catch (err) {
      next(err);
    }
  };