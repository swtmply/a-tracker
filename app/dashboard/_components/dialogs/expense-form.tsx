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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createExpense } from "../../_actions/budget";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const expenseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type ExpenseFormProps = {
  onClose: () => void;
};

export function ExpenseForm({ onClose }: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: ExpenseFormValues) {
    try {
      createExpense(data.name);

      toast({
        title: "Expense created",
        description: `The expense "${data.name}" has been created.`,
      });

      router.refresh();

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Failed to create expense",
          description: error.message,
          variant: "destructive",
        });

      console.error("Failed to create expense:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter expense name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Add Expense
        </Button>
      </form>
    </Form>
  );
}
