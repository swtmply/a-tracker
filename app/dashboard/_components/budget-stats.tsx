import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BudgetStats() {
  const monthlyIncome = 50000;
  const monthlyExpenses = 42000;
  const budgetLeft = monthlyIncome - monthlyExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-blue-600">
            Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ₱{monthlyIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">+20% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-blue-600">
            Monthly Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ₱{monthlyExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">-5% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-blue-600">Budget Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Within Budget</p>
          <p className="text-sm text-gray-500">
            You have ₱{budgetLeft.toLocaleString()} left to spend
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
