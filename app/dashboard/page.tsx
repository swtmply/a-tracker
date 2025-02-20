import { Suspense } from "react";
import { getExpenses } from "./_actions/budget";
import {
  BudgetHeader,
  BudgetHeaderFallback,
} from "./_components/budget-header";
import {
  ExpenseTable,
  ExpenseTableSkeleton,
} from "./_components/expense-table";

export default async function BudgetPage() {
  return (
    <div className="container p-6">
      <Suspense fallback={<BudgetHeaderFallback />}>
        <BudgetHeader />
      </Suspense>
      <Suspense fallback={<ExpenseTableSkeleton />}>
        <ExpenseTables />
      </Suspense>
    </div>
  );
}

async function ExpenseTables() {
  const expenses = await getExpenses();

  return <ExpenseTable expenses={expenses} />;
}
