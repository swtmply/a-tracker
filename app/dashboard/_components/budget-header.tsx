import { Button } from "@/components/ui/button";
import { getExpenses } from "../_actions/budget";
import { BaseDialog } from "./dialogs/base-dialog";
import { Plus } from "lucide-react";

export async function BudgetHeader() {
  const expenses = await getExpenses();

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
