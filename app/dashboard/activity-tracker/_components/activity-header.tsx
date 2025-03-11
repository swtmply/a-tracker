import { ActivityWithEntries } from "@/types/activity";
import { BaseDialog } from "./dialogs/base-dialog";

interface ActivityHeaderProps {
  activities: ActivityWithEntries[];
}

export function ActivityHeader({ activities }: ActivityHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Activity Tracker</h1>

      <BaseDialog activities={activities} />
    </div>
  );
}
