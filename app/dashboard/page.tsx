import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, TrendingDown } from "lucide-react";
import { AddExpenseDialog } from "./_components/add-expense-dialog";
import ExpenseList from "./_components/expenses-list";
import { getCategoryTransactions } from "./_actions/budget";
import { MonthlyExpenseDetails } from "./_components/monthly-expense-details";

const budgetData = {
  monthlyIncome: 50000,
  monthlyExpenses: 42000,
  overBudget: false,
};

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: SearchParams) {
  const cId = (await searchParams).cId;
  const m = (await searchParams).m;
  const transactions =
    cId && m
      ? await getCategoryTransactions({ cId: Number(cId), month: m.toString() })
      : null;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Budget Tracker</h1>

          <AddExpenseDialog />
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{budgetData.monthlyIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{budgetData.monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Budget Status
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {budgetData.overBudget ? "Over Budget" : "Within Budget"}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetData.overBudget
                  ? "You're ₱2,000 over budget"
                  : "You have ₱8,000 left to spend"}
              </p>
            </CardContent>
          </Card>
        </div>
        <ExpenseList />
      </div>

      {transactions && <MonthlyExpenseDetails transactions={transactions} />}
    </main>
  );
}
