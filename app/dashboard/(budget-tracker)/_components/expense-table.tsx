"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Category, ExpenseWithCategories, Transactions } from "@/types/budget";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import React from "react";
import TransactionDetailsDialog from "./dialogs/transaction-details-dialog";

interface ExpenseTableProps {
  expenses: ExpenseWithCategories[];
}

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [transactions, setTransactions] = React.useState<Transactions[]>([]);

  const createColumns = (): ColumnDef<Category>[] => [
    {
      accessorKey: "name",
      header: "Category",
      size: 120,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    ...months.map((month) => ({
      // TODO - Fix the accessorKey and id to have a dynamic year
      id: `totals.${month}_2025`,
      accessorKey: `totals.${month}_2025`,
      header: month,
      size: 70,
      cell: ({ row }: CellContext<Category, unknown>) => {
        const value = row.original.totals[`${month.toLowerCase()}_2025`] || 0;

        const monthTransactions = row.original.transactions.filter(
          (transaction) => transaction.month === month
        );

        return (
          <div
            className="font-medium cursor-pointer hover:underline"
            onClick={() => setTransactions(monthTransactions)}
          >
            {value > 0 ? `₱${value.toLocaleString()}` : "-"}
          </div>
        );
      },
    })),
  ];

  const onClose = (open: boolean) => {
    if (!open) {
      setTransactions([]);
    }
  };

  return (
    <div className="space-y-6">
      {expenses.map((expense) => {
        return (
          <div className="space-y-2" key={expense.id}>
            <div className="flex items-end justify-between">
              <h4 className="font-bold text-2xl text-blue-700">
                {expense.name}
              </h4>
            </div>
            <DataTable columns={createColumns()} data={expense.categories} />
          </div>
        );
      })}
      <TransactionDetailsDialog transactions={transactions} onClose={onClose} />
    </div>
  );
}

export function ExpenseTableSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((index) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((cell) => (
                <Skeleton key={cell} className="h-8 w-[100px]" />
              ))}
            </div>
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex justify-between">
                {[1, 2, 3, 4, 5].map((cell) => (
                  <Skeleton key={cell} className="h-8 w-[100px]" />
                ))}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
