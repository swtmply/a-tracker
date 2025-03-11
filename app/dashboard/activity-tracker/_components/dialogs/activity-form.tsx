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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { createActivity } from "../../_actions/activity";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const tailwindColors = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
};

const activitySchema = z.object({
  name: z.string().min(2, {
    message: "Activity name must be at least 2 characters.",
  }),
  metrics: z.object({
    color: z.string(),
    values: z.array(
      z.object({
        name: z.string(),
        score: z.coerce.number(),
      })
    ),
  }),
});

export type CreateActivity = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  onClose: () => void;
}

export function ActivityForm({ onClose }: ActivityFormProps) {
  const form = useForm<CreateActivity>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      metrics: {
        color: "",
        values: [{ name: "", score: 0 }],
      },
    },
  });

  const values = useWatch({ control: form.control, name: "metrics.values" });

  const router = useRouter();
  const session = useSession();

  async function onSubmit(data: CreateActivity) {
    try {
      if (!session.data?.user.id) {
        toast({
          title: "User not found",
          description: "Please login first to create an activity.",
        });
        return;
      }

      await createActivity(session.data.user.id, data);

      toast({
        title: "Activity created",
        description: `The activity "${data.name}" has been created.`,
      });

      router.refresh();

      onClose();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Failed to create activity",
          description: error.message,
          variant: "destructive",
        });

      console.error("Failed to create activity:", error);
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
              <FormLabel>Activity Name</FormLabel>
              <FormControl>
                <Input placeholder="Activity name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metrics.color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(tailwindColors).map(([color, className]) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full ${className}`}
                        ></div>
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormLabel>Metrics</FormLabel>
          {values.map((value, index) => (
            <div key={index} className="flex items-start space-x-2">
              <FormField
                control={form.control}
                name={`metrics.values.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Name</FormLabel>}
                    <FormControl>
                      <Input
                        placeholder="Value Name"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.values.${index}.score`}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Score</FormLabel>}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Score"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  className="bg-red-100/50 hover:bg-red-100 text-red-500 shadow-none"
                  type="button"
                  size="icon"
                  onClick={() =>
                    form.setValue(
                      "metrics.values",
                      values.filter((_, i) => i !== index)
                    )
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {values.length <= 4 && (
            <Button
              className="w-full"
              type="button"
              variant={"outline"}
              onClick={() =>
                form.setValue("metrics.values", [
                  ...values,
                  { name: "", score: 0 },
                ])
              }
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Value
            </Button>
          )}
        </div>

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
