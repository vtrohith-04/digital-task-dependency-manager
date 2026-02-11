import { PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "#A7F3D0", // pastel green (Completed)
  "#FDE68A", // pastel yellow (Pending)
  "#FECACA"  // pastel red (Blocked)
];

function DonutChart({ completed, pending, blocked }) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "Blocked", value: blocked }
  ];

  return (
    <PieChart width={180} height={180}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={55}
        outerRadius={80}
        paddingAngle={4}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
  );
}

export default DonutChart;
