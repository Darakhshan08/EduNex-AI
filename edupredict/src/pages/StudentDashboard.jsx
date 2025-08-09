import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StudentTop from "../components/Tabs/StudentTop";
import { useNavigate } from "react-router-dom";
import { teacher_analysis } from "../Api/internal";
import Loader from "../components/Custom/Loader";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const courses = ["Mathematics", "Science", "English"];
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
        <p className="mb-6 text-gray-600">Welcome to your student dashboard!</p>
      </motion.div>

      <StudentTop data={courseData.summary_metrics}  />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Your Courses
          </h2>
          <ul className="divide-y space-y-1">
            {courses.map((course, i) => (
              <motion.li
                key={i}
                className="py-3 flex justify-between items-center"
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
                <span className="font-medium">{course}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-3">
                    <motion.div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.floor(Math.random() * 100)}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.2,
                        ease: "easeOut",
                      }}
                    ></motion.div>
                  </div>
                  <motion.button
                    className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors duration-200"
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    View
                  </motion.button>
                </div>
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
              className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.99,
              }}
            >
              View All Courses
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div
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
        </motion.div>
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
              <div className="text-blue-800 font-semibold mb-1">Attendance</div>
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
