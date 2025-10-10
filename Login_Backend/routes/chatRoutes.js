const express = require("express");
const { chatWithGemini } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const chatRoutes = express.Router();

// Update the protect middleware to include admin
chatRoutes.post("/", protect(["student", "teacher", "admin"]), chatWithGemini);

module.exports = chatRoutes;
