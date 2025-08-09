import React, { useEffect, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { course_demand } from "../Api/internal";
import Loader from "../components/Custom/Loader";

const Course_demand = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    setLoading(true);
    const response = await course_demand();
    if (response.status === 200) {
      setData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Course Demand
        </h2>
        <p className="text-gray-600">
          Course Id and preferred_course Course demand predictions.
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
                Preferred Course
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Course
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
               Actual Course Demand
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
               Predicted Course Demand
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((student, index) => (
                <motion.tr
                  key={student.course_id + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-3 px-4 text-gray-800">
                    {student.preferred_course}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {student.course_id}
                  </td>
                 
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        student.actual_course_demand === "High"
                          ? "bg-red-100 text-red-700"
                          : student.actual_course_demand === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {student.actual_course_demand}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        student.predicted_course_demand === "High"
                          ? "bg-red-100 text-red-700"
                          : student.predicted_course_demand === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {student.predicted_course_demand}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
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
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Course_demand;
