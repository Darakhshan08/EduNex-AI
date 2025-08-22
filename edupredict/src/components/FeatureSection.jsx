import React from 'react'

import { BarChartIcon, BookOpenIcon, LightbulbIcon } from 'lucide-react'
import Card from './Card'

function FeatureSection() {
 return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-[#9078e2] text-white font-medium">
            Populer Subject
          </div>
          <h2 className="text-4xl font-bold text-black">
            Provide It & Technol
            <br />
            Subject For You
          </h2>
          <p className="text-gray-600">
            Construction is a general term meaning the art and science to form
            systems organizations, and comes from Latin Construction is
          </p>
          <div className="flex">
            <div className="w-1 bg-[#9078e2] mr-4"></div>
            <p className="text-gray-600">
              Construction is a general term meaning the art and science to form
              systems organizations, and comes from Latin Construction is a
              organizations, and comes from Latin construction and Old
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            icon={<BarChartIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Business Studies"
            description="Construction is a general term the art and science to form"
          />
          <Card
            icon={<LightbulbIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Artist & Design"
            description="Construction is a general term the art and science to form"
          />
          <Card
            icon={<BookOpenIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Machine Learning"
            description="Construction is a general term the art and science to form"
          />
          <Card
            icon={<BarChartIcon className="w-8 h-8 text-[#9078e2]" />}
            title="Artist & Design"
            description="Construction is a general term the art and science to form"
          />
        </div>
      </div>
    </div>
  )
}

export default FeatureSection