"use server";

import db from "@/db";
import { activities as activitiesTable, entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { CreateActivity } from "../_components/dialogs/activity-form";
import { Entry } from "../_components/dialogs/entry-form";
import { format } from "date-fns";

const CACHE_TAGS = {
  activities: "activities",
} as const;

const CACHE_PATHS = {
  all: "/",
  dashboard: "/dashboard/activity-tracker",
} as const;

export const getActivities = unstable_cache(
  async (userId: string) => {
    try {
      const activities = await db.query.activities.findMany({
        where: eq(activitiesTable.userId, userId),
        with: {
          entries: true,
        },
      });

      if (!activities) {
        throw new Error("Failed to fetch activities");
      }

      return activities;
    } catch (error) {
      console.error(error);

      return [];
    }
  },
  [CACHE_TAGS.activities],
  {
    tags: [CACHE_TAGS.activities],
  }
);

export async function createActivity(userId: string, data: CreateActivity) {
  try {
    await db.insert(activitiesTable).values({
      metrics: data.metrics.values,
      color: data.metrics.color,
      name: data.name,
      userId,
    });

    revalidatePath(CACHE_PATHS.dashboard);
    revalidateTag(CACHE_TAGS.activities);
  } catch (error) {
    console.error(error);
  }
}

export async function createEntry(data: Entry) {
  try {
    await db.insert(entries).values({
      activityId: data.activityId,
      date: format(data.date, "yyyy-MM-dd"),
      score: data.score,
    });

    revalidatePath(CACHE_PATHS.dashboard);
    revalidateTag(CACHE_TAGS.activities);
  } catch (error) {
    console.error(error);
  }
}
