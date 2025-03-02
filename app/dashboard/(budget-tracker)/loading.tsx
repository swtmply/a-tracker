import { BudgetHeaderFallback } from "./_components/budget-header";
import { ExpenseTableSkeleton } from "./_components/expense-table";

export default function BudgetLoading() {
  return (
    <div className="container p-6">
      <BudgetHeaderFallback />
      <ExpenseTableSkeleton />
    </div>
  );
}
