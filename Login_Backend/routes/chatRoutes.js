const express = require("express");
const { chatWithGemini } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const chatRoutes = express.Router();

chatRoutes.post("/",protect(["student"]), chatWithGemini);

module.exports = chatRoutes;
