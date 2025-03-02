import { Metadata } from "next";
import { ActivityCalendar } from "./_components/activity-calendar";
import { ActivityHeader } from "./_components/activity-header";

export const metadata: Metadata = {
  title: "Activity Tracker",
  description:
    "Track your activities throughout the year with a visual calendar",
};

export default function ActivityTrackerPage() {
  return (
    <div className="container p-6">
      <ActivityHeader />
      <ActivityCalendar year={2025} />
    </div>
  );
}
