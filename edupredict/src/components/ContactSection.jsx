import React, { useEffect, useState } from 'react'
const ContactSection = () => {
  const [animationPosition, setAnimationPosition] = useState({
    x: 50,
    y: 50,
  })
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPosition({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#121631]">
      {/* Animated element */}
      <div
        className="absolute opacity-30 blur-[100px] transition-all duration-[3000ms] ease-in-out"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: '#9078e2',
          left: `${animationPosition.x}%`,
          top: `${animationPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-[#9078e2]">Our Platform</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
         We create amazing experiences with innovative solutions for your business needs.
        </p>
      </div>
    </div>
  )
}
export default ContactSection
