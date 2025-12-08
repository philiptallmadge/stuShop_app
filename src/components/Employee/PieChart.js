import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SalesPieChart({ data }) {
  if (!data || data.length === 0) return <p>No sales data found.</p>;

  // Optional: define colors for slices
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#AA336A", "#3366AA", "#33AA66"
  ];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalSales"
            nameKey="organization_name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              Number(value).toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })
            }
          />

          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}