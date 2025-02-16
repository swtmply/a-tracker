import { eq, relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core";

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const expensesRelations = relations(expenses, ({ many }) => ({
  categories: many(categories),
}));

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  expenseId: integer("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  transactions: many(transactions),
  expense: one(expenses, {
    fields: [categories.expenseId],
    references: [expenses.id],
  }),
}));

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const transactionTotalView = sqliteView("transaction_total_view").as(
  (qb) =>
    qb
      .select({
        category_id: categories.id,
        totalAmount: sql<number>`sum(${transactions.amount})`.as(
          "total_amount"
        ),
        month: transactions.month,
        year: transactions.year,
      })
      .from(transactions)
      .innerJoin(categories, eq(categories.id, transactions.categoryId))
      .groupBy(categories.name, transactions.month, transactions.year)
);
