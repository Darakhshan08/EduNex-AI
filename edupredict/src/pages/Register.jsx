import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, GraduationCapIcon, UserIcon } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../Api/auth';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    student_id: '',
    courses: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'student' && { student_id: formData.student_id }),
      ...(formData.role === 'teacher' && formData.courses.trim() && { courses: formData.courses.trim() }),
    };

    try {
      const res = await register(payload);

      if (res?.status === 201) {
        toast.success('Account created successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          student_id: '',
          courses: '',
        });
      } else {
        toast.error(res?.data?.error || res?.data?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Something went wrong. Please try again later.');
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
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#9078e2] p-12 flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <BookOpenIcon size={40} className="text-white" />
          <span className="text-white text-3xl font-bold ml-2">EduNex AI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Unlock the power of AI in education</h2>
          <p className="text-xl opacity-80">
            Access your analytics dashboard to transform the way you teach and learn.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <GraduationCapIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Personalized learning experiences</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <UserIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Student progress tracking</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <BookOpenIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Data-driven teaching insights</p>
            </div>
          </div>
        </motion.div>

        <div className="text-white/60 text-sm">© 2025 EduNex AI. All rights reserved.</div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
        <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="lg:hidden flex items-center justify-center mb-4">
              <BookOpenIcon size={32} className="text-[#9078e2]" />
              <span className="text-2xl font-bold ml-2 text-[#9078e2]">EduNex AI</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </motion.div>

          {/* Toast Notifications */}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2]"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2]"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2]"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                {['student', 'teacher'].map((roleOption) => (
                  <div
                    key={roleOption}
                    className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
                      formData.role === roleOption
                        ? 'border-[#9078e2] bg-[#f0ecfd]'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setFormData({ ...formData, role: roleOption })}
                  >
                    <div className="text-3xl mb-2">
                      {roleOption === 'student' ? '👨‍🎓' : '👨‍🏫'}
                    </div>
                    <span className="font-medium capitalize">{roleOption}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2]"
                  placeholder="Enter your student ID"
                  required
                />
              </div>
            )}
            {formData.role === 'teacher' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Course</label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2]"
                  placeholder="Course you teach"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-[#9078e2] hover:bg-[#9078e2] text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
