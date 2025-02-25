"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { createTransaction } from "../../_actions/budget";
import { toast } from "@/hooks/use-toast";
import { ExpenseWithCategories } from "@/types/budget";
import { useRouter } from "next/navigation";

export const transactionSchema = z.object({
  expenseId: z.string().min(1, "Expense is required"),
  categoryId: z.string().min(1, "Category is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Amount must be a number")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
  month: z.string().min(1, "Month is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 2000,
      "Year must be 2000 or later"
    ),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

type TransactionFormProps = {
  onClose: () => void;
  expenses: ExpenseWithCategories[];
};

export function TransactionForm({ onClose, expenses }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      expenseId: "",
      month: "",
      year: new Date().getFullYear().toString(),
    },
  });
  const router = useRouter();

  const expenseId = useWatch({ control: form.control, name: "expenseId" });
  const categories =
    expenses
      .find((e) => e.id.toString() === expenseId)
      ?.categories.filter((c) => c.id !== 0) || [];

  async function onSubmit(data: TransactionFormValues) {
    try {
      createTransaction({
        categoryId: Number(data.categoryId),
        name: data.name,
        amount: Number(data.amount),
        month: data.month.slice(0, 3).toLowerCase(),
        year: Number(data.year),
      });

      toast({
        title: "Transaction created",
        description: `The transaction "${data.name}" has been created.`,
      });

      router.refresh();

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Failed to create transaction",
          description: error.message,
        });

      console.error("Failed to create transaction:", error);
    }
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="expenseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an expense" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenses.map((expense) => (
                    <SelectItem key={expense.id} value={expense.id.toString()}>
                      {expense.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter transaction name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toLowerCase()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}
