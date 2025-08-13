import React, { useState } from 'react'
import {
  ChevronDownIcon,
  SearchIcon,
  BarChart2Icon,
  XIcon,
  DownloadIcon,
  TrashIcon,
} from 'lucide-react'
 function Dataset() {
  const [showPredictionPopup, setShowPredictionPopup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sizeFilter, setSizeFilter] = useState('All Sizes')
  // Mock prediction result
  const predictionResult = {
    Model: 'Gradient Boosting',
    'Mean Dropout Risk': 0.87,
    'Std Deviation': 0.56,
    'Min Dropout Risk': -0.08,
    'Max Dropout Risk': 1.99,
    'Confidence Score': 53.34,
  }
  // Mock datasets for the table
  const datasets = [
    {
      id: 1,
      name: 'Student Performance 2023',
      size: '1.2 MB',
      date: '2023-10-15',
      status: 'Processed',
    },
    {
      id: 2,
      name: 'Enrollment Data Q3',
      size: '3.5 MB',
      date: '2023-09-22',
      status: 'Processing',
    },
    {
      id: 3,
      name: 'Faculty Survey Results',
      size: '0.8 MB',
      date: '2023-08-30',
      status: 'Processed',
    },
    {
      id: 4,
      name: 'Course Completion Stats',
      size: '2.1 MB',
      date: '2023-07-12',
      status: 'Failed',
    },
  ]
  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (sizeFilter === 'All Sizes' || dataset.size.includes(sizeFilter)),
  )
  return (
    <div className="w-full min-h-screen bg-[#ffffff] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Upload New Dataset Section */}
        <div className="bg-[#f5f5ff] rounded-xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Upload New Dataset
          </h2>
          <p className="text-gray-600 mb-6">
            Add new data sources and run predictions using your selected model.
          </p>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Dataset File (CSV)
              </label>
              <div className="relative">
                <button className="bg-[#f8f8e0] border border-gray-300 rounded-md py-2 px-4 w-full text-left">
                  Choose File{' '}
                  <span className="text-gray-500 ml-2">No file chosen</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Choose Model</label>
              <div className="relative">
                <select className="bg-[#f8f8e0] border border-gray-300 rounded-md py-2 px-4 w-full appearance-none">
                  <option>XGBoost</option>
                  <option>Gradient Boosting</option>
                  <option>Random Forest</option>
                  <option>Neural Network</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
            <div>
              <button
                className="bg-[#c8c8ff] hover:bg-[#b8b8ff] text-gray-700 py-2 px-6 rounded-md flex items-center"
                onClick={() => setShowPredictionPopup(true)}
              >
                <BarChart2Icon size={18} className="mr-2" />
                Predict
              </button>
            </div>
          </div>
        </div>
        {/* Manage Datasets Section */}
        <div className="bg-[#f5f5ff] rounded-xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Manage Datasets
          </h2>
          <p className="text-gray-600 mb-6">
            View, download, or delete existing datasets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search datasets..."
                className="bg-[#f8f8e0] border border-gray-300 rounded-md py-2 pl-10 pr-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[150px]">
              <select
                className="bg-[#f8f8e0] border border-gray-300 rounded-md py-2 px-4 w-full appearance-none"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <option>All Sizes</option>
                <option>Small (&lt;1MB)</option>
                <option>Medium (1-3MB)</option>
                <option>Large (&gt;3MB)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
          {/* Datasets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Dataset Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Size
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Date Added
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <tr key={dataset.id}>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {dataset.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {dataset.size}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {dataset.date}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${dataset.status === 'Processed' ? 'bg-green-100 text-green-800' : dataset.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {dataset.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <DownloadIcon size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No datasets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Prediction Results Popup */}
      {showPredictionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">
                Prediction Results
              </h3>
              <button
                onClick={() => setShowPredictionPopup(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full">
                <tbody>
                  {Object.entries(predictionResult).map(
                    ([key, value], index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-gray-50' : ''}
                      >
                        <td className="py-2 px-3 text-sm font-medium text-gray-700">
                          {key}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPredictionPopup(false)}
                  className="bg-[#c8c8ff] hover:bg-[#b8b8ff] text-gray-700 py-2 px-6 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dataset