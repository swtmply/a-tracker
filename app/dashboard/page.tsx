import { Suspense } from "react";
import {
  BudgetHeader,
  BudgetHeaderFallback,
} from "./_components/budget-header";
import { ExpenseTableSkeleton } from "./_components/expense-table";
import { ExpenseTables } from "./_components/expense-tables";

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
