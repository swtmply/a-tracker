"use server";

import db from "@/db";
import { transactions, transactionTotalView } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getAllExpenses() {
  try {
    const expensesWithCategories = await db.query.expenses.findMany({
      with: {
        categories: true,
      },
    });

    const categoriesTotals = await db.select().from(transactionTotalView);

    const expenses = expensesWithCategories.map((expense) => {
      return {
        ...expense,
        categories: expense.categories.map((category) => {
          const totals = categoriesTotals
            .filter((t) => t.category_id === category.id)
            .map((t) => ({
              [t.month]: t.totalAmount,
            }));

          const totalsObject = totals.reduce((acc, total) => {
            return { ...acc, ...total };
          }, {});

          return {
            ...category,
            totals: totalsObject,
          };
        }),
      };
    });

    return expenses;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return [];
  }
}

export async function getCategoryTransactions({
  cId,
  month,
}: {
  cId: number;
  month: string;
}) {
  try {
    const categoryTransactions = await db.query.transactions.findMany({
      where: and(
        eq(transactions.categoryId, cId),
        eq(transactions.month, month)
      ),
    });

    return categoryTransactions;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return [];
  }
}
