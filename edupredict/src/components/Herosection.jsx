import React from 'react'

function Herosection() {
  return (
    <div className="w-full bg-[#1a1a35] py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute top-8 left-24 w-6 h-6 border border-[#9078e2] rotate-45 opacity-20"></div>
      <div className="absolute bottom-16 right-24 w-6 h-6 border border-orange-400 rotate-45 opacity-20"></div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 z-10">
          <p className="text-[#9078e2] uppercase tracking-wider text-sm font-medium mb-2">
            EDUCATION SOLUTION
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Cloud-based LMS
            <br />
            Trusted by 1000+
          </h1>
          <p className="text-gray-300 mb-8 max-w-lg">
            Lorem ipsum is simply dummy text of the printing typesetting
            industry. Lorem ipsum has been
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#9078e2] hover:bg-[#7b66c8] text-white font-medium py-2.5 px-6 rounded">
              View Courses
            </button>
            <button className="text-white font-medium py-2.5 px-6 flex items-center border border-[#9078e2] hover:bg-[#9078e2]/10">
              Find out more →
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
          <div className="relative z-10">
            <div className="absolute -top-20 -right-10 w-64 h-64 bg-[#9078e2] rounded-full filter blur-xl opacity-50"></div>
            <div className="absolute top-20 -right-20 w-80 h-80 bg-pink-500 rounded-full filter blur-xl opacity-30"></div>
            <div className="absolute -bottom-10 left-20 w-40 h-40 bg-yellow-500 rounded-full filter blur-xl opacity-30"></div>
            <img
              src="https://foxpixel.vercel.app/edurock/edurock/img/about/about_1.png"
              alt="Student studying with laptop"
              className="relative z-10 max-w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Herosection