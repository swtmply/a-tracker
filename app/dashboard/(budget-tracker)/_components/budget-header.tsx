import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BaseDialog } from "./dialogs/base-dialog";
import { ExpenseWithCategories } from "@/types/budget";

export async function BudgetHeader({
  expenses,
}: {
  expenses: ExpenseWithCategories[];
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Budget Tracker</h1>

      <BaseDialog expenses={expenses} />
    </div>
  );
}

export function BudgetHeaderFallback() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Budget Tracker</h1>

      <Button disabled>
        <Plus />
        Create
      </Button>
    </div>
  );
}
