import React from "react";
import { ExpenseDataTable } from "./expense-data-table";
import { getAllExpenses } from "../_actions/budget";
import { expenseColumns } from "./expense-columns";

export default async function ExpenseList() {
  const expenses = await getAllExpenses();

  return expenses.map((expense) => (
    <div key={expense.name} className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        {expense.name} Expenses
      </h2>
      <ExpenseDataTable data={expense.categories} columns={expenseColumns} />
    </div>
  ));
}
