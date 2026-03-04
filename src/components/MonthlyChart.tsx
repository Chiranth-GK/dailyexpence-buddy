import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { Expense } from "@/lib/expense-data";

interface MonthlyChartProps {
  expenses: Expense[];
}

const MonthlyChart = ({ expenses }: MonthlyChartProps) => {
  const monthlyData: Record<string, number> = {};
  expenses.forEach((e) => {
    const month = e.date.slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + e.amount;
  });

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      total: +total.toFixed(2),
    }));

  return (
    <div className="glass-card p-5 h-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Monthly Spending</h3>
      <div className="h-56">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
            />
            <Bar dataKey="total" fill="hsl(172, 66%, 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;
