import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SalesLineChart({ data }) {
  if (!data || data.length === 0) return <p>No monthly sales found.</p>;

  // Format "2024-01" into "Jan 2024"
  const formattedData = data.map(item => {
    const [year, month] = item.month.split("-");
    const dateObj = new Date(year, month - 1);
    const monthName = dateObj.toLocaleString("default", { month: "short" });

    return {
      ...item,
      label: `${monthName} ${year}`
    };
  });

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            interval={0}               // Show all labels
            angle={-45}                // Tilt labels for readability
            textAnchor="end"
            height={70}
          />

          <YAxis />

          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />

          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#0088FE"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}