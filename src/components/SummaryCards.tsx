import { DollarSign, TrendingUp, Tag, Receipt } from "lucide-react";
import type { Expense } from "@/lib/expense-data";

interface SummaryCardsProps {
  expenses: Expense[];
}

const SummaryCards = ({ expenses }: SummaryCardsProps) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avg = expenses.length ? total / expenses.length : 0;
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    { label: "Total Spent", value: `$${total.toFixed(2)}`, icon: DollarSign, highlight: true },
    { label: "Transactions", value: expenses.length.toString(), icon: Receipt, highlight: false },
    { label: "Average", value: `$${avg.toFixed(2)}`, icon: TrendingUp, highlight: false },
    { label: "Top Category", value: topCategory?.[0] || "—", icon: Tag, highlight: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass-card p-5 transition-all hover:scale-[1.02] ${card.highlight ? "glow-primary border-primary/30" : ""}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
            <card.icon className={`w-4 h-4 ${card.highlight ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <p className={`text-2xl font-bold ${card.highlight ? "gradient-text" : ""}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
