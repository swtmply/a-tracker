import { Metadata } from "next";
import { ActivityHeader } from "./_components/activity-header";
import { CalendarGrid } from "./_components/calendar-grid";
import { auth } from "@/lib/auth";
import { getActivities } from "./_actions/activity";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Activity Tracker",
  description:
    "Track your activities throughout the year with a visual calendar",
};

export default async function ActivityTrackerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return redirect("/login");
  }

  const activities = await getActivities(session.user.id);

  return (
    <div className="container p-6">
      <ActivityHeader activities={activities} />

      <div className="space-y-6">
        {activities.map((activity) => (
          <CalendarGrid key={activity.id} year={2025} activity={activity} />
        ))}
      </div>
    </div>
  );
}
