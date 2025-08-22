import React from 'react'
import { motion } from 'framer-motion'
function Works() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Class',
      description:
        'Set up your virtual classroom and invite students to join with a simple code.',
    },
    {
      number: 2,
      title: 'Input Data',
      description:
        'Add assignments, quizzes, and track attendance through our intuitive interface.',
    },
    {
      number: 3,
      title: 'Get Predictions',
      description:
        'Our AI analyzes student data to predict performance and identify students needing support.',
    },
    {
      number: 4,
      title: 'Take Action',
      description:
        'Use AI-recommended materials and strategies to improve learning outcomes.',
    },
  ]
  // Generate random floating shapes for background animation
  const shapes = Array.from(
    {
      length: 15,
    },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.07 + 0.03,
    }),
  )  
 return (
    <div className="w-full py-16 px-4 bg-[#f1eff9] md:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full bg-[#9078e2]"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              opacity: shape.opacity,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 0.9, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {/* Gradient overlay to make text more readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/80" />
      <div className="relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            How <span className="text-[#9078e2]">EduPredict</span> Works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy to implement predictive analytics in your
            educational environment
          </p>
        </motion.div>
        <div className="relative mt-20">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200" />
          <div className="flex flex-col md:flex-row justify-between relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
                className="flex flex-col items-center mb-10 md:mb-0 w-full md:w-1/4"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="w-20 h-20 rounded-full border-2 border-[#9078e2] flex items-center justify-center bg-white mb-6 relative"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0px 0px 0px 0px rgba(144, 120, 226, 0.2)',
                        '0px 0px 0px 10px rgba(144, 120, 226, 0)',
                        '0px 0px 0px 0px rgba(144, 120, 226, 0)',
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: index * 0.5,
                    }}
                    className="w-20 h-20 rounded-full absolute"
                  />
                  <span className="text-[#9078e2] text-3xl font-bold">
                    {step.number}
                  </span>
                </motion.div>
                <motion.h3
                  className="text-xl font-semibold mb-2 text-center"
                  whileHover={{
                    color: '#9078e2',
                  }}
                >
                  {step.title}
                </motion.h3>
                <p className="text-gray-600 text-center px-2">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Works