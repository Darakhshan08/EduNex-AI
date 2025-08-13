import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { DownloadIcon } from "lucide-react";
import { attendance_course_performance } from "../../Api/internal";
import Loader from "../Custom/Loader";
const COLORS = ["#4F75FF", "#0096FF", "#00D7FF", "#EF4444"];
export const Courses = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");

  useEffect(() => {
    setLoading(true);
    attendance_course_performance()
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data.metrics); // ابتدائی طور پر پورا ڈیٹا سیٹ کر دیں
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch assignment data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedBatch || selectedBatch === "Select Batch") {
      setFilteredData(data?.metrics || []);
    } else {
      const filtered = data?.metrics.filter((item) => item.batch === selectedBatch) || [];
      setFilteredData(filtered);
    }
  }, [selectedBatch, data]);

  const formattedData = filteredData.map((item) => ({
    month: item.month,
    course: item.course,
    present: item.presence_rate,
    late: item.late_rate,
    absent: item.absence_rate,
  }));

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Course Performance</h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pl-4 pr-10 text-gray-700"
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

            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700 w-full sm:w-auto">
            <DownloadIcon size={16} />
            <span>Download</span>
          </button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={600} height={300} data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
             <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, "dataMax"]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />
           <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
            Course: <span className="text-blue-600 dark:text-blue-400">{payload[0]?.payload.course}</span>
          </p>

          <div className="space-y-1">
            <p className="text-sm text-[#9078e2] dark:text-green-400 font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#9078e2] inline-block"></span> Present: {payload.find(p => p.dataKey === 'present')?.value}%
            </p>
            <p className="text-sm text-[#ff7e67] dark:text-yellow-400 font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff7e67] inline-block"></span> Late: {payload.find(p => p.dataKey === 'late')?.value}%
            </p>
            <p className="text-sm text-[#c4bef0] dark:text-red-400 font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#c4bef0] inline-block"></span> Absent: {payload.find(p => p.dataKey === 'absent')?.value}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  }}
/>


              <Legend />
              <Bar dataKey="present" fill="#9078e2" />
              <Bar dataKey="late" fill="#ff7e67" />
              <Bar dataKey="absent" fill="#c4bef0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
