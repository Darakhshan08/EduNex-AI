// // controllers/chatController.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv = require("dotenv");
// dotenv.config();

// const internalAPI = require("./internal");

// // Gemini AI init
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// console.log("GOOGLE_API_KEY loaded:", !!process.env.GOOGLE_API_KEY);

// exports.chatWithGemini = async (req, res) => {
//   try {
//     const { message, userData } = req.body;

//     if (!message) return res.status(400).json({ error: "Message is required" });
//     if (!userData || !userData.name || !userData.role) {
//       return res.status(400).json({ error: "User data missing" });
//     }

//     const { role, name, student_id } = userData;
//     let reply = "";

//     if (role === "student") {
//       // 1️⃣ Career Advice
//       const careerAdvice = await internalAPI.getCareerAdvice(name, message);

//       // 2️⃣ Performance
//       const performance = await internalAPI.getStudentPerformance(student_id);

//       // 3️⃣ Dropout Risk
//       const dropout = await internalAPI.getStudentDropoutRisk(student_id);
//       const riskMsg =
//         dropout?.risk_level === "high"
//           ? `⚠️ Your dropout risk is HIGH in ${dropout.subject || "general"}. Practice more quizzes and study materials are recommended.`
//           : "";

//       // 4️⃣ Quiz Suggestion
//       const quiz = await internalAPI.getQuizSuggestion(
//         student_id,
//         dropout?.subject || "general"
//       );
//       const quizText = quiz?.quiz || "No suggested quiz available";

//       // 5️⃣ CV Tips
//       const cvTips = await internalAPI.getStudentCVTips(name, message);

//       // 6️⃣ Gemini AI Integration
//       try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//         const aiInput = `
// User Question: ${message}
// Career Advice: ${careerAdvice}
// Dropout Risk: ${riskMsg}
// Suggested Quiz: ${quizText}
// CV Tips: ${cvTips}
//         `;
//         const aiResponse = await model.generateContent(aiInput);
//         reply = aiResponse.response?.text() || "Sorry, no response from Gemini AI";
//       } catch (gemErr) {
//         console.error("Gemini AI call failed:", gemErr);
//         reply = "❌ Gemini API failed. Please try again later.";
//       }
//     } else {
//       reply = "Admin / Teacher functionality will be implemented later.";
//     }

//     res.json({ reply });
//   } catch (err) {
//     console.error("ChatController Error:", err);
//     res.status(500).json({ error: "Chatbot failed" });
//   }
// };




const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv =require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    // Model select karna hoga
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Response generate karo
    const result = await model.generateContent(message);

    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
};
