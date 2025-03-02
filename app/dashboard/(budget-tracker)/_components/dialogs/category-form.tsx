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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCategory } from "../../_actions/budget";
import { toast } from "@/hooks/use-toast";
import { ExpenseWithCategories } from "@/types/budget";
import { useRouter } from "next/navigation";

export const categorySchema = z.object({
  expenseId: z.string().min(1, "Expense is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = {
  onClose: () => void;
  expenses: ExpenseWithCategories[];
};

export function CategoryForm({ onClose, expenses }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      expenseId: "",
      name: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: CategoryFormValues) {
    try {
      createCategory({
        expenseId: Number(data.expenseId),
        name: data.name,
      });

      toast({
        title: "Category created",
        description: `The category "${data.name}" has been created.`,
      });

      router.refresh();

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Failed to create category",
          description: error.message,
          variant: "destructive",
        });

      console.error("Failed to create category:", error);
    }
  }

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
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
          Add Category
        </Button>
      </form>
    </Form>
  );
}
