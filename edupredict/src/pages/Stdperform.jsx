import React, { useState, useEffect } from 'react';
import { LineChartIcon, DownloadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Loader from '../components/Custom/Loader';

function Stdperform() {
  const [predictionData, setPredictionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [perfSummaryRes, studentProbRes] = await Promise.all([
          axios.get("http://localhost:3001/performance_summary"),
          axios.get("http://localhost:3001/get_student_probabilities")
        ]);

        const perfData = perfSummaryRes.data || [];

        setPredictionData(perfData);
        setStudentData(studentProbRes.data);
        setLoading(false);
        
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;


  const total = predictionData.reduce((sum, item) => sum + item.student_count, 0);
  const getBarWidth = (count) => {
    if (total === 0) return "0%";
    return `${(count / total) * 100}%`;
  };

  return (
    <div className="rounded-lg p-4 min-h-screen w-full md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Prediction Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChartIcon className="text-blue-500" size={20} />
            <h2 className="text-2xl font-bold text-gray-800">Student Predicted Performance</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Overview of predicted performance across students.
          </p>

          <div className="space-y-4">
            {predictionData.map((item, idx) => (
              <div className="flex items-center" key={idx}>
                <div className="w-32 text-gray-600 text-right pr-4">{item.predicted_performance}</div>
                <div className="w-full bg-gray-100 h-12 rounded relative">
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300`}
                    style={{
                      width: getBarWidth(item.student_count),
                      backgroundColor: ["#4F75FF", "#0096FF","#66D7D1","#00D7FF"][idx % 4]
                    }}
                  ></div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700">
                    {item.percentage}% Students
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 text-gray-600">Total: {total} Students</div>
        </motion.div>

        {/* Detailed Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Detailed Student Predicted Performance</h2>
            <p className="text-gray-600">Individual Student Predicted Performance predictions.</p>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student Id</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Predicted performance</th>
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Percentage</th> */}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {studentData
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((student, index) => (
                      <motion.tr
                        key={student["Student ID"] + index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="py-3 px-4 text-gray-800">{student["Student ID"]}</td>
                        <td className="py-3 px-4 text-gray-800">{student["Name"]}</td>
                        <td className="py-3 px-4 text-gray-800">{student["Predicted_performance"]}</td>
                        {/* <td className="py-3 px-4 text-gray-800">{student["Percentage"]}%</td> */}
                      </motion.tr>
                    ))}
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
                setCurrentPage((prev) =>
                  prev < Math.ceil(studentData.length / itemsPerPage) ? prev + 1 : prev
                )
              }
              disabled={currentPage === Math.ceil(studentData.length / itemsPerPage)}
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

export default Stdperform;
