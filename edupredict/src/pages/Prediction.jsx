import React, { useState, useEffect } from "react";
import { LineChartIcon, DownloadIcon, ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Prediction() {
  const [predictionData, setPredictionData] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
  });
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, studentRes] = await Promise.all([
          axios.get("http://localhost:3001/dropout_risk_by_course"),
          axios.get("http://localhost:3001/dropout_risk_percentage"),
        ]);

        const grouped = { Low: 0, Medium: 0, High: 0 };
        riskRes.data.forEach((item) => {
          const risk = item.predicted_dropout_risk;
          if (risk === "Low") grouped.Low += item.student_count;
          else if (risk === "Medium") grouped.Medium += item.student_count;
          else if (risk === "High") grouped.High += item.student_count;
        });

        setPredictionData(grouped);
        setStudentData(studentRes.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);

  const total =
    predictionData.Low + predictionData.Medium + predictionData.High;
  const getBarWidth = (count) => {
    if (total === 0) return "0%";
    return `${(count / total) * 100}%`;
  };

  return (
    <div className="rounded-lg p-4 min-h-screen w-full md:p-8 ">
      <div className="max-w-7xl mx-auto space-y-6 ">
        {/* ✅ Prediction Overview with Dynamic Custom Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChartIcon className="text-blue-500" size={20} />
            <h2 className="text-2xl font-bold text-gray-800">
              Prediction Overview
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Summary of dropout risk predictions across students.
          </p>
          <div className="space-y-4">
            {["Low", "Medium", "High"].map((level) => (
              <div className="flex items-center" key={level}>
                <div className="w-24 text-gray-600 text-right pr-4">
                  {level}
                </div>
                <div className="w-full bg-gray-100 h-12 rounded relative">
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300 ${
                      level === "Low"
                        ? "bg-[#4F75FF]"
                        : level === "Medium"
                        ? "bg-[#0096FF]"
                        : "bg-[#00D7FF]"
                    }`}
                    style={{ width: getBarWidth(predictionData[level]) }}
                  ></div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700">
                    {predictionData[level]} Students
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">Student Count</div>
        </motion.div>

        {/* 🔽 Detailed Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Detailed Predictions
            </h2>
            <p className="text-gray-600">
              Individual student dropout risk predictions.
            </p>
          </div>

          <div className="flex justify-between mb-6 relative">
            <div className="flex-grow" />
            <div className="flex gap-4">
              <button className="bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-gray-700">
                <DownloadIcon size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Table Section */}
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
                    Dropout Risk
                  </th>
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Dropout Risk</th> */}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {studentData
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((student, index) => {
                      const riskColor = {
                        Low: "bg-green-200 text-green-800",
                        Medium: "bg-orange-200 text-orange-800",
                        High: "bg-red-200 text-red-800",
                      };

                      return (
                        <motion.tr
                          key={student.student_id + index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="py-3 px-4 text-gray-800">
                            {student.name}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {student.Course}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                riskColor[student.risk_level]
                              }`}
                            >
                              {student.risk_level}
                            </span>
                          </td>
                          {/* <td className="py-3 px-4 text-gray-800">{percentage}</td> */}
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
                setCurrentPage((prev) =>
                  prev < Math.ceil(studentData.length / itemsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage === Math.ceil(studentData.length / itemsPerPage)
              }
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Prediction;
