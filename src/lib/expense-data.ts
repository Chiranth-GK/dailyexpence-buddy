export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Education",
  "Travel",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "hsl(var(--chart-1))",
  Transport: "hsl(var(--chart-5))",
  Shopping: "hsl(var(--chart-2))",
  Entertainment: "hsl(var(--chart-3))",
  "Bills & Utilities": "hsl(var(--chart-4))",
  Health: "hsl(var(--success))",
  Education: "hsl(210, 70%, 55%)",
  Travel: "hsl(30, 80%, 55%)",
  Other: "hsl(var(--muted-foreground))",
};

export const SAMPLE_EXPENSES: Expense[] = [
  { id: "1", amount: 45.5, category: "Food & Dining", description: "Grocery shopping", date: "2026-03-01" },
  { id: "2", amount: 12.0, category: "Transport", description: "Uber ride", date: "2026-03-01" },
  { id: "3", amount: 89.99, category: "Shopping", description: "New headphones", date: "2026-02-28" },
  { id: "4", amount: 15.0, category: "Entertainment", description: "Movie tickets", date: "2026-02-27" },
  { id: "5", amount: 120.0, category: "Bills & Utilities", description: "Electricity bill", date: "2026-02-25" },
  { id: "6", amount: 35.0, category: "Food & Dining", description: "Restaurant dinner", date: "2026-02-24" },
  { id: "7", amount: 60.0, category: "Health", description: "Pharmacy", date: "2026-02-23" },
  { id: "8", amount: 200.0, category: "Travel", description: "Train tickets", date: "2026-02-20" },
  { id: "9", amount: 25.0, category: "Entertainment", description: "Streaming subscription", date: "2026-02-18" },
  { id: "10", amount: 150.0, category: "Shopping", description: "Clothing", date: "2026-02-15" },
  { id: "11", amount: 42.0, category: "Food & Dining", description: "Takeout order", date: "2026-02-14" },
  { id: "12", amount: 8.5, category: "Transport", description: "Bus pass", date: "2026-02-12" },
];
