import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { academic_performance, teacher_analysis } from '../Api/internal';
import Loader from '../components/Custom/Loader';
import TeacherTop from '../components/Tabs/TeacherTop';
import PieCharts from '../components/Custom/PieChart';

const TeacherDashboard = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    role: ''
  });

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }
  

  useEffect(() => {
    const adminToken = localStorage.getItem('admin');
    const teacherToken = localStorage.getItem('teacher');
    const studentToken = localStorage.getItem('student');
  
    const token = adminToken || teacherToken || studentToken;
  
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || '',
          email: decoded.email || '',
          username: decoded.username || '',
          role: decoded.role || ''
        });
      }
    }
  }, []);




  // Load recent analyses from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('studentHistory') || '[]');
    setRecentAnalyses(history.slice(0, 3));
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div className="p-4" variants={containerVariants} initial="hidden" animate="visible">

<motion.div
  variants={itemVariants}
  className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-white shadow-sm border border-gray-100"
>
  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
    Welcome,{" "}
    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
      {userData.name}
    </span>{" "}
    👋
  </h1>

  <p className="text-gray-600 text-lg leading-relaxed">
    👩‍🏫 Manage <span className="font-semibold text-purple-600">students</span>,  
    track <span className="font-semibold text-pink-600">courses</span>,  
    and gain insights to boost academic success 🚀
  </p>
</motion.div>



      

      <TeacherTop data={courseData.summary_metrics} />

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        {/* Recent Analyses Table */}
        <motion.div className="bg-white p-5 rounded-lg shadow-md" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4">Recent Analyses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">{analysis.student_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(analysis.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            analysis.prediction.predicted_performance === 'Excellent'
                              ? 'bg-green-100 text-green-800'
                              : analysis.prediction.predicted_performance === 'Good'
                              ? 'bg-green-100 text-green-800'
                              : analysis.prediction.predicted_performance === 'Average'
                              ? 'bg-yellow-100 text-yellow-800'
                              : analysis.prediction.predicted_performance === 'Below Average'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {analysis.prediction.predicted_performance}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            analysis.prediction.dropout_risk === 'Low'
                              ? 'bg-green-100 text-green-800'
                              : analysis.prediction.dropout_risk === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {analysis.prediction.dropout_risk}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-sm text-gray-500">
                      No recent analyses. Start by analyzing a student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Risk Distribution Chart */}
        {/* <motion.div className="bg-white p-5 rounded-lg shadow-md" variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">High Risk</span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                <span className="text-sm font-medium text-gray-700">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Low Risk</span>
                <span className="text-sm font-medium text-gray-700">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </motion.div> */}
<PieCharts  />
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;