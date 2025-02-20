"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";
import { ExpenseForm } from "./expense-form";
import { CategoryForm } from "./category-form";
import { TransactionForm } from "./transaction-form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ExpenseWithCategories } from "@/types/budget";

type FormType = "expense" | "category" | "transaction";

type BaseDialogProps = {
  expenses: ExpenseWithCategories[];
};

export function BaseDialog({ expenses }: BaseDialogProps) {
  const [formType, setFormType] = React.useState<FormType>("expense");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const onClose = () => {
    setIsOpen(false);
    router.refresh();
  };

  const formComponent = {
    expense: <ExpenseForm onClose={onClose} />,
    category: <CategoryForm onClose={onClose} expenses={expenses} />,
    transaction: <TransactionForm onClose={onClose} expenses={expenses} />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Select an option below to create a new item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-x-2">
          <Badge
            className={cn(
              "cursor-pointer hover:border-blue-500 hover:text-blue-700",
              formType === "expense" && "border-blue-500 text-blue-700"
            )}
            onClick={() => setFormType("expense")}
            variant={"outline"}
          >
            Expense
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer hover:border-blue-500 hover:text-blue-700",
              formType === "category" && "border-blue-500 text-blue-700"
            )}
            onClick={() => setFormType("category")}
            variant={"outline"}
          >
            Category
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer hover:border-blue-500 hover:text-blue-700",
              formType === "transaction" && "border-blue-500 text-blue-700"
            )}
            onClick={() => setFormType("transaction")}
            variant={"outline"}
          >
            Transaction
          </Badge>
        </div>

        {formComponent[formType]}
      </DialogContent>
    </Dialog>
  );
}
