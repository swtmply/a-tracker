import { getExpenses } from "../_actions/budget";
import { ExpenseTable } from "../_components/expense-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function ExpenseTables() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return redirect("/login");
  }

  const expenses = await getExpenses(session.user.id);

  return <ExpenseTable expenses={expenses} />;
}
