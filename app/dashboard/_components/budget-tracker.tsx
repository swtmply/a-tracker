"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Expense } from "@/types/budget";
import { AlertCircle, DollarSign, TrendingDown } from "lucide-react";
import React from "react";
import { AddExpenseDialog } from "./add-expense-dialog";
import { ExpenseDataTable } from "./expense-data-table";
import { MonthlyExpenseDetails } from "./monthly-expense-details";

// Mock data - replace with real data in a production app
const budgetData = {
  monthlyIncome: 50000,
  monthlyExpenses: 42000,
  overBudget: false,
};

const expenses: Expense[] = [
  {
    name: "Entertainment",
    categories: [
      {
        id: "1",
        name: "Movies",
        totals: {
          jan: 50,
          feb: 60,
          mar: 70,
        },
        transactions: {
          jan: [{ name: "Movie Ticket", amount: 50 }],
          feb: [{ name: "Movie Ticket", amount: 60 }],
          mar: [{ name: "Movie Ticket", amount: 70 }],
        },
      },
      {
        id: "2",
        name: "Concerts",
        totals: {
          jan: 800,
          feb: 0,
          mar: 120,
        },
        transactions: {
          jan: [
            { name: "Concert Ticket", amount: 100 },
            { name: "Concert Merch", amount: 700 },
          ],
          feb: [],
          mar: [{ name: "Concert Ticket", amount: 120 }],
        },
      },
    ],
  },
  {
    name: "Savings",
    categories: [
      {
        id: "3",
        name: "Emergency Fund",
        totals: {
          jan: 200,
          feb: 200,
          mar: 200,
        },
        transactions: {
          jan: [{ name: "Transfer to Savings", amount: 200 }],
          feb: [{ name: "Transfer to Savings", amount: 200 }],
          mar: [{ name: "Transfer to Savings", amount: 200 }],
        },
      },
      {
        id: "4",
        name: "Investment Account",
        totals: {
          jan: 300,
          feb: 300,
          mar: 300,
        },
        transactions: {
          jan: [{ name: "Investment Purchase", amount: 300 }],
          feb: [{ name: "Investment Purchase", amount: 300 }],
          mar: [{ name: "Investment Purchase", amount: 300 }],
        },
      },
    ],
  },
];

interface SelectedCell extends Category {
  month: string;
}

export function BudgetTracker() {
  const [selectedCell, setSelectedCell] = React.useState<SelectedCell | null>(
    null
  );

  return (
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
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
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

      {expenses.map((expense) => (
        <div key={expense.name} className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {expense.name} Expenses
          </h2>
          <ExpenseDataTable
            onCellClick={(category, month) => {
              setSelectedCell({ ...category, month });
            }}
            data={expense.categories}
          />
        </div>
      ))}

      {selectedCell && (
        <MonthlyExpenseDetails
          transactions={selectedCell.transactions[selectedCell.month]}
          onOpenChange={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}
