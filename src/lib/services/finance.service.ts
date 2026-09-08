import { connectMongo } from "@/lib/mongodb";
import { ExpenseModel, IncomeModel, PaymentModel } from "@/lib/models";

export class FinanceService {
  /**
   * Get aggregated financial overview metrics.
   */
  static async getFinancialSummary() {
    await connectMongo();

    const [incomes, expenses, payments] = await Promise.all([
      IncomeModel.find().lean(),
      ExpenseModel.find().lean(),
      PaymentModel.find().lean()
    ]);

    const totalIncome = incomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const netProfit = totalIncome - totalExpenses;

    const paidPayments = payments.filter((p) => p.status === "paid");
    const pendingPayments = payments.filter((p) => p.status === "pending");

    const totalPaidPayments = paidPayments.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const totalPendingPayments = pendingPayments.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    // Group income by category
    const incomeByCategory: Record<string, number> = {};
    for (const item of incomes) {
      const cat = item.category || "consultation";
      incomeByCategory[cat] = (incomeByCategory[cat] || 0) + (Number(item.amount) || 0);
    }

    // Group expenses by category
    const expenseByCategory: Record<string, number> = {};
    for (const item of expenses) {
      const cat = item.category || "other";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + (Number(item.amount) || 0);
    }

    // Monthly breakdown for the last 6 months
    const now = new Date();
    const monthlyStats: Array<{ month: string; income: number; expense: number; profit: number }> = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const monthIncome = incomes
        .filter((inc) => {
          const incDate = new Date(inc.incomeDate);
          return incDate >= date && incDate < nextMonth;
        })
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      const monthExpense = expenses
        .filter((exp) => {
          const expDate = new Date(exp.expenseDate);
          return expDate >= date && expDate < nextMonth;
        })
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      monthlyStats.push({
        month: monthLabel,
        income: monthIncome,
        expense: monthExpense,
        profit: monthIncome - monthExpense
      });
    }

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      totalPaidPayments,
      totalPendingPayments,
      incomeByCategory,
      expenseByCategory,
      monthlyStats,
      incomesCount: incomes.length,
      expensesCount: expenses.length,
      paymentsCount: payments.length
    };
  }
}
