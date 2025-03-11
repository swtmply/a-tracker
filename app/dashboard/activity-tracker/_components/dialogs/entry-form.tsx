"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { createEntry } from "../../_actions/activity";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ActivityWithEntries } from "@/types/activity";

const entrySchema = z.object({
  activityId: z.coerce.number(),
  score: z.coerce.number(),
  date: z.date(),
});

export type Entry = z.infer<typeof entrySchema>;

interface EntryFormProps {
  onClose: () => void;
  activities: ActivityWithEntries[];
}

export function EntryForm({ onClose, activities }: EntryFormProps) {
  const form = useForm<Entry>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(),
    },
  });
  const activityId = useWatch({ control: form.control, name: "activityId" });
  const metrics = activities.find((activity) => {
    return Number(activity.id) === Number(activityId);
  })?.metrics;

  const session = useSession();
  const router = useRouter();

  async function onSubmit(data: Entry) {
    try {
      if (!session.data?.user.id) {
        toast({
          title: "User not found",
          description: "Please login first to create an entry.",
        });
        return;
      }

      await createEntry(data);

      toast({
        title: "Entry created",
        description: `The entry has been created.`,
      });

      router.refresh();

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Failed to create entry",
          description: error.message,
          variant: "destructive",
        });

      console.error("Failed to create entry:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="activityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem
                      key={activity.id}
                      value={activity.id.toString()}
                    >
                      {activity.name}
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
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a score" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activityId
                    ? metrics?.map((metric) => (
                        <SelectItem
                          key={metric.name}
                          value={metric.score.toString()}
                        >
                          {metric.name}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of entry</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  side="bottom"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date that the entry was created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
