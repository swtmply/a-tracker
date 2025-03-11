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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ActivityForm } from "./activity-form";
import { EntryForm } from "./entry-form";
import { ActivityWithEntries } from "@/types/activity";

type FormType = "activity" | "entry";

type BaseDialogProps = {
  activities: ActivityWithEntries[];
};

export function BaseDialog({ activities }: BaseDialogProps) {
  const [formType, setFormType] = React.useState<FormType>("activity");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const onClose = () => {
    setIsOpen(false);
    router.refresh();
  };

  const formComponent = {
    activity: <ActivityForm onClose={onClose} />,
    entry: <EntryForm onClose={onClose} activities={activities} />,
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
          <DialogTitle>Create from activity tracker</DialogTitle>
          <DialogDescription>
            Select an option below to create a new item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-x-2">
          <Badge
            className={cn(
              "cursor-pointer hover:border-blue-500 hover:text-blue-700",
              formType === "activity" && "border-blue-500 text-blue-700"
            )}
            onClick={() => setFormType("activity")}
            variant={"outline"}
          >
            Activity
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer hover:border-blue-500 hover:text-blue-700",
              formType === "entry" && "border-blue-500 text-blue-700"
            )}
            onClick={() => setFormType("entry")}
            variant={"outline"}
          >
            Entry
          </Badge>
        </div>

        {formComponent[formType]}
      </DialogContent>
    </Dialog>
  );
}
