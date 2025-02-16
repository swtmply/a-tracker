"use client";

import {
  ColumnDef,
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  makeStateUpdater,
  OnChangeFn,
  RowData,
  TableFeature,
  Table as TanstackTable,
  Updater,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/budget";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export interface SelectedCellState extends Category {
  month: string;
}

export interface SelectedCellTableState {
  selectedCell: SelectedCellState;
}

export interface SelectedCellOptions {
  enableSelectedCell?: boolean;
  onSelectedCellChange?: OnChangeFn<SelectedCellState>;
}

export interface SelectedCellInstance {
  setSelectedCell: (updater: Updater<SelectedCellState>) => void;
}

declare module "@tanstack/react-table" {
  interface TableState extends SelectedCellTableState {
    x?: string; // filler type for typescript eslint
  }
  interface TableOptionsResolved<TData extends RowData>
    extends SelectedCellOptions {
    x?: TData; // filler type for typescript eslint
  }
  interface Table<TData extends RowData> extends SelectedCellInstance {
    x?: TData; // filler type for typescript eslint
  }
}

const INITIAL_SELECTED_CELL_STATE = {
  id: 0,
  expenseId: 0,
  name: "",
  totals: {},
  month: "",
};

export const SelectedCellFeature: TableFeature<SelectedCellState> = {
  getInitialState: (state): SelectedCellTableState => {
    return {
      selectedCell: INITIAL_SELECTED_CELL_STATE,
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: TanstackTable<TData>
  ): SelectedCellOptions => {
    return {
      enableSelectedCell: true,
      onSelectedCellChange: makeStateUpdater("selectedCell", table),
    } as SelectedCellOptions;
  },

  createTable: <TData extends RowData>(table: TanstackTable<TData>): void => {
    table.setSelectedCell = (updater) => {
      const safeUpdater: Updater<SelectedCellState> = (old) => {
        return functionalUpdate(updater, old);
      };
      return table.options.onSelectedCellChange?.(safeUpdater);
    };
  },
};

interface ExpenseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export function ExpenseDataTable<TData, TValue>({
  columns,
  data,
}: ExpenseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (params: { [key: string]: string | null }) => {
    const newParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    }
    return newParams.toString();
  };

  const table = useReactTable({
    _features: [SelectedCellFeature],
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSelectedCellChange: (data) => {
      // @ts-expect-error state update only works on setState
      const selectedCell: SelectedCellState = data();

      router.push(
        "?" +
          createQueryString({
            cId: selectedCell.id.toString(),
            m: selectedCell.month,
          })
      );
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      minWidth: cell.column.columnDef.size,
                      maxWidth: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center col-span-full">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => {
                return (
                  <TableCell
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                    className="font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  );
}
