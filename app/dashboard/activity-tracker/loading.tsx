import { Metadata } from "next";
import { ActivityHeader } from "./_components/activity-header";
import { CalendarGridSkeleton } from "./_components/calendar-grid";

export const metadata: Metadata = {
  title: "Activity Tracker",
  description:
    "Track your activities throughout the year with a visual calendar",
};

export default function ActivityTrackerLoading() {
  return (
    <div className="container p-6">
      <ActivityHeader />

      <div className="space-y-6">
        <CalendarGridSkeleton />
        <CalendarGridSkeleton />
      </div>
    </div>
  );
}
