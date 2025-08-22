import React from 'react'
import Navbar from '../components/Navbar'
import Herosection from '../components/Herosection'
import Aboutsection from '../components/Aboutsection'
import StarBackground from '../components/StarBackground'
import FeatureSection from '../components/FeatureSection'
import Works from '../components/Works';
import Course from '../components/Course'

const categories = [
  {
    title: 'Art & Design',
    courseCount: 10,
  },
  {
    title: 'Development',
    courseCount: 15,
  },
  {
    title: 'Lifestyle',
    courseCount: 12,
  },
  {
    title: 'Personal Development',
    courseCount: 8,
  },
  {
    title: 'Business',
    courseCount: 9,
  },
  {
    title: 'Finance',
    courseCount: 10,
  },
  {
    title: 'Marketing',
    courseCount: 21,
  },
  {
    title: 'Photography',
    courseCount: 10,
  },
  {
    title: 'Data Science',
    courseCount: 16,
  },
  {
    title: 'Health & Fitness',
    courseCount: 10,
  },
  {
    title: 'Web Design',
    courseCount: 12,
  },
  {
    title: 'Mobile Application',
    courseCount: 10,
  },
]

function Home1() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Herosection/>
      <Aboutsection />
      <StarBackground />
      <FeatureSection />
      <Works />
       <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-[#9078e2]/10 z-0">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
      </div>
      {/* Content */}
      <div className="relative z-10 py-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#9078e2] animate-fadeIn">
            Explore Our Course Categories
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="h-24 animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <Course
                  title={category.title}
                  courseCount={category.courseCount}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home1