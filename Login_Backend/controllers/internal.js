const axios = require("axios");
const FormData = require("form-data");

// Python ML backend URL
const PYTHON_BACKEND = "http://localhost:3001";


// --- Student Performance ---
exports.getStudentPerformance = async (student_id) => {
  const res = await axios.post(`${PYTHON_BACKEND}/predict_user`, { student_id });
  return res.data;
};

// --- Student Dropout Risk ---
exports.getStudentDropoutRisk = async (student_id) => {
  const res = await axios.post(`${PYTHON_BACKEND}/predict_dropout`, { student_id });
  return res.data;
};

// --- Career Advice (AI via Gemini) ---
exports.getCareerAdvice = async (username, question) => {
  // Send question + student info to Gemini API (via Node controller)
  return `AI-generated career advice for "${question}" for ${username}`;
};

// --- Quiz Suggestion ---
exports.getQuizSuggestion = async (student_id, subject) => {
  // Placeholder: real quizzes fetched from DB or assignment summary
  return { subject, quiz: `Suggested quiz for ${subject}` };
};

// --- CV Tips ---
exports.getStudentCVTips = async (username, question) => {
  return `Include your latest project on "${question}" in your CV, ${username}`;
};
