import { useState } from "react";
import { Wallet } from "lucide-react";
import { SAMPLE_EXPENSES, type Expense } from "@/lib/expense-data";
import SummaryCards from "@/components/SummaryCards";
import AddExpenseForm from "@/components/AddExpenseForm";
import CategoryChart from "@/components/CategoryChart";
import MonthlyChart from "@/components/MonthlyChart";
import TransactionList from "@/components/TransactionList";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);

  const handleAdd = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expense Analyzer</h1>
            <p className="text-sm text-muted-foreground">Track and visualize your spending</p>
          </div>
        </div>

        <SummaryCards expenses={expenses} />
        <AddExpenseForm onAdd={handleAdd} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <MonthlyChart expenses={expenses} />
        </div>

        <TransactionList expenses={expenses} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Index;
