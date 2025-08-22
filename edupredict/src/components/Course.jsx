import React from 'react'

function Course({ title, courseCount }) {
  return (
    <div className="bg-white hover:bg-purple-50 shadow-sm hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center h-full border border-transparent hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <h3 className="font-semibold text-xl mb-1 text-gray-800">{title}</h3>
      <p className="text-purple-600 font-medium">{courseCount} Courses</p>
    </div>
  )
}

export default Course