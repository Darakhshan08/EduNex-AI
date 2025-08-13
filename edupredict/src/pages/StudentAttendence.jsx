import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon, ChevronDownIcon } from "lucide-react";
import { attendance_course_performance } from "../Api/internal";
import Loader from "../components/Custom/Loader";

function StudentAttendance() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("Select Month");

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await attendance_course_performance(selectedBatch); // pass batch
    if (response.status === 200) {
      setData(response.data.metrics || []);
    }
  } catch (error) {
    console.error("Error fetching attendance data", error);
  } finally {
    setLoading(false);
  }
};


  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data by month
  useEffect(() => {
    if (!selectedBatch || selectedBatch === "Select Batch") {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) => item.batch === selectedBatch);
      setFilteredData(filtered);
    }
  }, [selectedBatch, data]);

  // Prepare chart data from filteredData
  const chartData = filteredData.map((item) => ({
    month: item.month,
    name: item.course,
    present: item.present_count,
    absent: item.absent_count,
  }));

  // Prepare table data from filteredData
  const attendanceData = filteredData.map((item) => {
    const present = item.present_count;
    const absent = item.absent_count;
    const percentage =
      present + absent > 0
        ? ((present / (present + absent)) * 100).toFixed(1) + "%"
        : "0%";

    return {
      month: item.month,
      name: item.course,
      present,
      absent,
      percentage,
    };
  });

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        {/* Performance Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Attendance Performance
              </h2>
              <p className="text-gray-600">
                Overview of total attendance by course
              </p>
            </div>
            <div className="flex gap-2 relative">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pl-4 pr-10 text-gray-700"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="Select Batch">Select Batch</option>
                  <option value="B001">B001</option>
                  <option value="B002">B002</option>
                  <option value="B003">B003</option>
                  <option value="B004">B004</option>
                  <option value="B005">B005</option>
                  <option value="B006">B006</option>
                  <option value="B007">B007</option>
                  <option value="B008">B008</option>
                  <option value="B009">B009</option>
                  <option value="B010">B010</option>
                  <option value="B011">B011</option>

                  {/* <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option> */}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-[#f7f9e6] text-gray-700 rounded-md border border-gray-200">
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          {filteredData.length > 0 ? (
            <div className="h-[200px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, "dataMax"]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border shadow p-2 rounded text-sm text-gray-700">
                            <p>Month: {payload[0].payload.month}</p>
                            <p className="font-semibold">
                              Course: {payload[0].payload.name}
                            </p>
                            <p>Present: {payload[0].payload.present}</p>
                            <p>Absent: {payload[0].payload.absent}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar dataKey="present" fill="#4F75FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#00D7FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Please select a month to view data
            </p>
          )}
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            Attendance Breakdown
          </h2>
          <p className="text-gray-600 mb-6">
            Detailed attendance for each course
          </p>
          {attendanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Month
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Course
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Present
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Absent
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.month}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.present}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.absent}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border border-gray-300">
                        {item.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No attendance data available for this month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;
