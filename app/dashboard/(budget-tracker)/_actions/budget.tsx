"use server";

import db from "@/db";
import { categories, expenses, transactions } from "@/db/schema";
import { ExpenseWithCategories } from "@/types/budget";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

const CACHE_TAGS = {
  expenses: "expenses",
} as const;

const CACHE_PATHS = {
  all: "/",
  dashboard: "/dashboard",
} as const;

export const getExpenses = unstable_cache(
  async (userId: string): Promise<ExpenseWithCategories[]> => {
    try {
      const expensesWithCategories = await db.query.expenses.findMany({
        where: eq(expenses.userId, userId),
        with: {
          categories: {
            with: {
              transactions: true,
            },
          },
        },
      });

      if (!expensesWithCategories) {
        throw new Error("Failed to fetch expenses");
      }

      const transformedExpenses: ExpenseWithCategories[] =
        expensesWithCategories.map((expense) => {
          const categoriesWithTotals = expense.categories.map((category) => {
            // Calculate totals from transactions
            const categoryTotals = category.transactions.reduce(
              (acc, transaction) => {
                const key = `${transaction.month}_${transaction.year}`;
                return {
                  ...acc,
                  [key]: (acc[key] || 0) + transaction.amount,
                };
              },
              {} as Record<string, number>
            );

            return {
              id: category.id,
              name: category.name,
              expenseId: category.expenseId,
              transactions: category.transactions,
              totals: categoryTotals,
            };
          });

          return {
            id: expense.id,
            name: expense.name,
            categories: [
              ...categoriesWithTotals,
              {
                id: 0,
                name: "Total",
                expenseId: 0,
                transactions: [],
                totals: categoriesWithTotals.reduce((acc, category) => {
                  Object.entries(category.totals).forEach(([key, value]) => {
                    acc[key] = (acc[key] || 0) + value;
                  });

                  return acc;
                }, {} as Record<string, number>),
              },
            ],
          };
        });

      return transformedExpenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  },
  [CACHE_TAGS.expenses],
  { tags: [CACHE_TAGS.expenses] }
);

export async function createExpense(name: string, userId: string) {
  try {
    const existingExpense = await db.query.expenses.findFirst({
      where: and(eq(expenses.name, name), eq(expenses.userId, userId)),
    });

    if (existingExpense) {
      return {
        error: "An expense with this name already exists",
      };
    }

    const expense = await db
      .insert(expenses)
      .values({ name, userId })
      .execute();

    if (!expense) {
      throw new Error("Failed to create expense");
    }

    revalidatePath(CACHE_PATHS.dashboard);
    revalidateTag(CACHE_TAGS.expenses);
    return { message: "Expense created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return null;
  }
}

export async function createCategory({
  expenseId,
  name,
}: {
  expenseId: number;
  name: string;
}) {
  try {
    const existingCategory = await db.query.categories.findFirst({
      where: and(
        eq(categories.name, name),
        eq(categories.expenseId, expenseId)
      ),
    });

    if (existingCategory) {
      return {
        error: "A category with this name already exists under this expense",
      };
    }

    const category = await db
      .insert(categories)
      .values({ expenseId, name })
      .execute();

    if (!category) {
      throw new Error("Failed to create category");
    }

    revalidatePath(CACHE_PATHS.dashboard);
    revalidateTag(CACHE_TAGS.expenses);
    return { message: "Category created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return null;
  }
}

export async function createTransaction({
  categoryId,
  amount,
  month,
  year,
  name,
}: {
  categoryId: number;
  amount: number;
  month: string;
  year: number;
  name: string;
}) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) {
      return {
        error: "Invalid category or expense combination",
      };
    }

    const transaction = await db
      .insert(transactions)
      .values({ categoryId, amount, month, year, name })
      .execute();

    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    revalidatePath(CACHE_PATHS.dashboard);
    revalidateTag(CACHE_TAGS.expenses);
    return { message: "Transaction created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return null;
  }
}
