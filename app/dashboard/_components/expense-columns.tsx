"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { months } from "@/lib/constants";
import { Category } from "@/types/budget";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseColumnsProps<TData> {
  onCellClick: (data: TData, month: string) => void;
}

export const expenseColumns = ({
  onCellClick,
}: ExpenseColumnsProps<Category>): ColumnDef<Category, unknown>[] => [
  {
    accessorKey: "name",
    header: "Category",
    size: 200,
  },
  ...months.map((month) => ({
    id: `totals.${month}`,
    accessorKey: `totals.${month}`,
    header: month.charAt(0).toUpperCase() + month.slice(1),
    cell: ({ row }: CellContext<Category, unknown>) => {
      const amount = row.original.totals[month] ?? 0;
      return (
        <div
          className={cn(
            "text-left cursor-pointer hover:underline",
            amount === 0 && "cursor-default hover:no-underline"
          )}
          onClick={() => {
            if (amount === 0) return;
            onCellClick(row.original, month);
          }}
        >
          ₱{amount.toLocaleString()}
        </div>
      );
    },
    size: 100,
  })),
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
