import React, { useState, useEffect } from "react";
import { DownloadIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loader from "../components/Custom/Loader";

function Dropout_risk() {
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerCategory = 20; // 20 Low + 20 Medium + 20 High = 60 per page

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentRes = await axios.get(
          "http://localhost:3001/dropout_risk_percentage"
        );
        setStudentData(studentRes.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);
  if (loading || !studentData) return <Loader />;
  // Categorize students by risk
  const lowRiskStudents = studentData.filter(
    (student) => student.risk_level === "Low"
  );

  const mediumRiskStudents = studentData.filter(
    (student) => student.risk_level === "Medium"
  );

  const highRiskStudents = studentData.filter(
    (student) => student.risk_level === "High"
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerCategory;
  const endIndex = currentPage * itemsPerCategory;

  const pageLow = lowRiskStudents.slice(startIndex, endIndex);
  const pageMedium = mediumRiskStudents.slice(startIndex, endIndex);
  const pageHigh = highRiskStudents.slice(startIndex, endIndex);

  // Merge and shuffle to mix risk levels randomly
  const paginatedData = [...pageLow, ...pageMedium, ...pageHigh].sort(
    () => Math.random() - 0.5
  );

  const totalPages = Math.ceil(
    Math.max(
      lowRiskStudents.length,
      mediumRiskStudents.length,
      highRiskStudents.length
    ) / itemsPerCategory
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Dropout Risk Student
        </h2>
        <p className="text-gray-600">
          Individual student dropout risk predictions.
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <div></div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-gray-700">
          <DownloadIcon size={16} />
          <span>Download</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Student Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Course
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Attendance
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Gpa
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
              Assignments
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
              Quiz
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((student, index) => {
               const riskLevel = student.risk_level?.charAt(0).toUpperCase() + student.risk_level?.slice(1).toLowerCase();

                const riskColor = {
                  Low: "bg-green-200 text-green-800",
                  Medium: "bg-orange-200 text-orange-800",
                  High: "bg-red-200 text-red-800",
                };
                // const riskIcon = {
                //   Low: "🟢",
                //   Medium: "🟠",
                //   High: "🔴",
                // };

                return (
                  <motion.tr
                    key={student.student_id + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-3 px-4 text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.Course}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.attendance}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{student.gpa}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.assignments_completed}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.quizzes_completed}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.lms_engagement_score}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.previous_failures}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${riskColor[riskLevel]}`}
                      >
                      {riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800 whitespace-pre-line">
                      {student.risk_reason}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

export default Dropout_risk;
