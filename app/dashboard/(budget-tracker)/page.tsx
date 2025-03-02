import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getExpenses } from "./_actions/budget";
import { BudgetHeader } from "./_components/budget-header";
import { ExpenseTable } from "./_components/expense-table";

export default async function BudgetPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return redirect("/login");
  }

  const expenses = await getExpenses(session.user.id);

  return (
    <div className="container p-6">
      <BudgetHeader expenses={expenses} />
      <ExpenseTable expenses={expenses} />
    </div>
  );
}
