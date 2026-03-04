import { Trash2 } from "lucide-react";
import type { Expense } from "@/lib/expense-data";
import { CATEGORY_COLORS } from "@/lib/expense-data";

interface TransactionListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const TransactionList = ({ expenses, onDelete }: TransactionListProps) => {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recent Transactions</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sorted.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[expense.category] }} />
              <div>
                <p className="font-medium text-sm">{expense.description}</p>
                <p className="text-xs text-muted-foreground">{expense.category} · {new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">${expense.amount.toFixed(2)}</span>
              <button onClick={() => onDelete(expense.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No expenses yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
