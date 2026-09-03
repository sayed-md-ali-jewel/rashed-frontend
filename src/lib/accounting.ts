export type LedgerEntry = {
  id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  date: string;
  category: string;
};

export function profitAndLoss(entries: LedgerEntry[]) {
  const income = entries
    .filter((entry) => entry.type === "income")
    .reduce((total, entry) => total + entry.amount, 0);
  const expenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((total, entry) => total + entry.amount, 0);

  return {
    income,
    expenses,
    profit: income - expenses,
    margin: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0
  };
}

export function groupByPeriod(entries: LedgerEntry[], period: "daily" | "weekly" | "monthly" | "yearly") {
  return entries.reduce<Record<string, LedgerEntry[]>>((groups, entry) => {
    const date = new Date(entry.date);
    const key =
      period === "yearly"
        ? `${date.getFullYear()}`
        : period === "monthly"
          ? `${date.getFullYear()}-${date.getMonth() + 1}`
          : period === "weekly"
            ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
            : date.toISOString().slice(0, 10);

    groups[key] = [...(groups[key] ?? []), entry];
    return groups;
  }, {});
}
