const express = require("express");
const { chatWithGemini } = require("../controllers/chatController");

const chatRoutes = express.Router();

chatRoutes.post("/", chatWithGemini);

module.exports = chatRoutes;
