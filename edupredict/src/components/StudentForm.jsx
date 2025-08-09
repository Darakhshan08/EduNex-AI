import React, { useState } from 'react'

import { BookOpenIcon } from 'lucide-react'
import { predictStudentPerformance } from '../Api/internal'
export const StudentForm = ({ setPrediction, setLoading, setError }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    attendance_rate: 0,
    gpa: 0,
    hours_studied_per_week: 0,
    previous_failures: 0,
    attendance_percentage: 0,
    quizzes_completed: 0,
    assignments_completed: 0,
    lms_engagement_score: 0,
  })
  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    })
  }

const saveToHistory = (studentData, prediction) => {
    // Get existing history or initialize empty array
    const existingHistory = JSON.parse(localStorage.getItem('studentHistory') || '[]')
    // Create history entry with timestamp
    const historyEntry = {
      student_id: studentData.student_id,
      student_name: studentData.student_name,
      gpa: studentData.gpa,
      date: new Date().toISOString(),
      prediction: prediction
    }
    // Add to history and save back to localStorage
    const updatedHistory = [historyEntry, ...existingHistory]
    localStorage.setItem('studentHistory', JSON.stringify(updatedHistory))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await predictStudentPerformance(formData)
      setPrediction(result)
        // Save to localStorage
      saveToHistory(formData, result)
    } catch (err) {
      setError('Failed to get prediction. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <div className="flex items-center mb-6">
        <BookOpenIcon className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Student Information</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Rate
            </label>
            <input
              type="number"
              name="attendance_rate"
              value={formData.attendance_rate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GPA
            </label>
            <input
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              min="0"
              max="4"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours Studied Per Week
            </label>
            <input
              type="number"
              name="hours_studied_per_week"
              value={formData.hours_studied_per_week}
              onChange={handleChange}
              min="0"
              step="0.5"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Previous Failures
            </label>
            <input
              type="number"
              name="previous_failures"
              value={formData.previous_failures}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Percentage
            </label>
            <input
              type="number"
              name="attendance_percentage"
              value={formData.attendance_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quizzes Completed
            </label>
            <input
              type="number"
              name="quizzes_completed"
              value={formData.quizzes_completed}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignments Completed
            </label>
            <input
              type="number"
              name="assignments_completed"
              value={formData.assignments_completed}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LMS Engagement Score
            </label>
            <input
              type="number"
              name="lms_engagement_score"
              value={formData.lms_engagement_score}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Predict Performance
          </button>
        </div>
      </form>
    </div>
  )
}