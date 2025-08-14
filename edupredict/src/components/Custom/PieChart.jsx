import React, { useState, useEffect } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { academic_performance } from "../../Api/internal";

const COLORS = ["#9078e2", "#ff7e67", "#a48fe6", "#c4bef0"];

const PieCharts = () => {
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);

  const academicData = async () => {
    setLoading(true);
    try {
      const res = await academic_performance();
      if (res.status === 200) {
        setCourseData(res.data); // res.data should have performance_distribution
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    academicData();
  }, []);

  // Extract performance_distribution
  const performanceData = courseData?.performance_distribution;

  // If no data, show message
  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Performance Distribution</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-4">Performance Distribution</h2>

      {loading && <p>Loading...</p>}

      {!loading && (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e6e3f4",
                borderRadius: "4px",
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieCharts;
