import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import StudentTop from "../components/Tabs/StudentTop";
import { Link, useNavigate } from "react-router-dom";
import {
  attendance_course_performance,
  dropout_risk_percentage,
  teacher_analysis,
} from "../Api/internal";
import Loader from "../components/Custom/Loader";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [record, recordData] = useState([]);

  const attendanceData = async () => {
    setLoading(true);
    try {
      const response = await attendance_course_performance(); // fetch data
      if (response.status === 200) {
        const metrics = response.data.metrics || [];

        // Keep only the latest record per course
        const uniqueCoursesMap = {};
        metrics.forEach((item) => {
          // If course is not added yet or the month is later, update it
          if (
            !uniqueCoursesMap[item.course] ||
            new Date(item.month) > new Date(uniqueCoursesMap[item.course].month)
          ) {
            uniqueCoursesMap[item.course] = item;
          }
        });

        // Convert map to array and take only first 5 courses
        const uniqueCourses = Object.values(uniqueCoursesMap).slice(0, 5);

        // Prepare data for chart
        const chartData = uniqueCourses.map((item) => ({
          course: item.course,
          avg_attendance: item.avg_attendance,
        }));

        recordData(chartData);
      }
    } catch (error) {
      console.error("Error fetching attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    attendanceData();
  }, []);

  const dropData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/dropout_risk_percentage"
      );
      if (res.status === 200) {
        // Remove duplicates
        const unique = res.data.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.Course === item.Course && t.teacher_name === item.teacher_name
            )
        );

        const formatted = unique.map((item) => ({
          course: item.Course,
          teacher: item.teacher_name,
          risk: item.risk_level,
        }));

        setData(formatted.slice(0, 7)); // Only first 5 unique records
      }
    } catch (error) {
      console.log("Error fetching dropout risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dropData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacher_analysis();
      if (res.status == 200) {
        setCourseData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading || courseData == null) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const assignments = ["C101", "C102", "C103"];

  return (
    <>
      <motion.div
        className="p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Student Dashboard
          </h1>
          <p className="mb-6 text-gray-600">
            Welcome to your student dashboard!
          </p>
        </motion.div>

        <StudentTop data={courseData.summary_metrics} />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              Attendance Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={record} // use transformed data
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="course" width={150} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar
                  dataKey="avg_attendance" // show only avg attendance
                  fill="#3b82f6"
                  radius={[0, 6, 6, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>

            <motion.div
              className="mt-4 pt-4 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link to="/studentattendance" className="w-full block">
                  View All
                </Link>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              Dropout Risk
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Teacher
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Dropout Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-2 text-gray-800  border-b border-gray-200">
                        {item.course}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                        {item.teacher}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-b border-gray-200">
                        {item.risk}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <motion.div
    className="mt-4 pt-4 border-t"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <motion.button
      className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      View All Courses
    </motion.button>
  </motion.div> */}
          </motion.div>

          {/* <motion.div
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Quizzes
          </h2>
          <ul className="divide-y space-y-1">
            {assignments.map((assignment, i) => (
              <motion.li
                key={i}
                className="py-3 flex justify-center items-center"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: i * 0.1,
                }}
                whileHover={{
                  x: 5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === 0
                        ? "bg-red-500"
                        : i === 1
                        ? "bg-amber-500"
                        : "bg-green-500"
                    } mr-2`}
                  ></div>
                  <span className="font-medium">{assignment}</span>
                </div>
                <div className="flex items-center"></div>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-4 pt-4 border-t"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            <motion.button
              className="w-full px-4 py-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors duration-200 text-sm font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/studentquiz")} // update route as needed
            >
              View All Assignments
            </motion.button>
          </motion.div>
        </motion.div> */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-2"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Your Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                className="p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-emerald-800 font-semibold mb-1">
                  Overall Grade
                </div>
                <div className="text-3xl font-bold text-emerald-600">A-</div>
                <div className="text-xs text-emerald-700 mt-1">
                  Top 15% of class
                </div>
              </motion.div>
              <motion.div
                className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-blue-800 font-semibold mb-1">
                  Attendance
                </div>
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-xs text-blue-700 mt-1">Last 30 days</div>
              </motion.div>
              <motion.div
                className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <div className="text-purple-800 font-semibold mb-1">
                  Completed
                </div>
                <div className="text-3xl font-bold text-purple-600">24/30</div>
                <div className="text-xs text-purple-700 mt-1">
                  Assignments this term
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};
export default StudentDashboard;
