import { Button } from "@/components/ui/button";
import { getExpenses } from "../_actions/budget";
import { BaseDialog } from "./dialogs/base-dialog";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function BudgetHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return redirect("/login");
  }

  const expenses = await getExpenses(session.user.id);

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
