const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const jwt = require("jsonwebtoken");

const teacherRoutes = express.Router();

// ===== Middleware for protecting routes =====
const protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret"); // Use same secret as login
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ===== Teacher Data API =====
teacherRoutes.get("/data", protect(["teacher"]), (req, res) => {
  const teacherName = req.user.name;
  const batchId = req.user.batch_id;
  const course = req.user.courses;
  const monthFilter = req.query.month;

  const results = [];
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

        if (!monthFilter || row.month === monthFilter) {
          results.push(row);
        }
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        return res.json({ message: "No records found" });
      }

      let totalAttendance = 0,
        totalAssignments = 0,
        totalQuizzes = 0;

      results.forEach((r) => {
        totalAttendance += parseFloat(r.attendance_rate);
        totalAssignments += parseFloat(r.assignments_completed);
        totalQuizzes += parseFloat(r.quizzes_completed);
      });

      res.json({
        batch_id: batchId,
        course: course,
        months: Array.from(monthsSet), // For frontend dropdown
        selectedMonth: monthFilter || Array.from(monthsSet)[0], // default first month
        totalRecords: results.length,
        AverageAttendance: ((totalAttendance / results.length) * 100).toFixed(2) + "%",
        AverageAssignments: (totalAssignments / results.length).toFixed(),
        AverageQuizzes: (totalQuizzes / results.length).toFixed(),
        stddata: results,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = teacherRoutes;