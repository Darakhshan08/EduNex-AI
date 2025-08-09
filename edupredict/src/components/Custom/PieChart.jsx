import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
// Custom Pie Chart Component
const PieCharts = ({ data }) => {
  return (
    <div className="flex justify-center items-center relative w-100 h-80 mx-auto">
      <ResponsiveContainer height={"100%"} width={"100%"}>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="action_type"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieCharts;
