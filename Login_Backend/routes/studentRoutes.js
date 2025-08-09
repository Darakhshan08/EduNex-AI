const express = require("express");
const { studentanalysis } = require("../controllers/studentController");
const studentroute = express.Router();


studentroute.post("/studentanalysis", studentanalysis);

module.exports = studentroute;