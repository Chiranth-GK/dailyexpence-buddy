import { useEffect, useState } from "react";
import { Wallet, LogOut } from "lucide-react";
import { type Expense } from "@/lib/expense-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SummaryCards from "@/components/SummaryCards";
import AddExpenseForm from "@/components/AddExpenseForm";
import CategoryChart from "@/components/CategoryChart";
import MonthlyChart from "@/components/MonthlyChart";
import TransactionList from "@/components/TransactionList";
import ExpenseChat from "@/components/ExpenseChat";

const Index = () => {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, amount, category, description, date")
        .order("date", { ascending: false });
      if (error) toast.error(error.message);
      else setExpenses((data ?? []).map((d) => ({ ...d, amount: Number(d.amount) })));
      setLoading(false);
    })();
  }, [user]);

  const handleAdd = async (expense: Expense) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      })
      .select("id, amount, category, description, date")
      .single();
    if (error) { toast.error(error.message); return; }
    setExpenses((prev) => [{ ...data, amount: Number(data.amount) }, ...prev]);
    toast.success("Expense added");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Expense Analyzer</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        <SummaryCards expenses={expenses} />
        <AddExpenseForm onAdd={handleAdd} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <MonthlyChart expenses={expenses} />
        </div>

        <TransactionList expenses={expenses} onDelete={handleDelete} />

        {loading && <p className="text-center text-muted-foreground text-sm">Loading...</p>}
      </div>
      <ExpenseChat expenses={expenses} />
    </div>
  );
};

export default Index;
