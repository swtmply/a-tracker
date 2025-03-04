import {
  eachDayOfInterval,
  lastDayOfYear,
  nextSaturday,
  previousSunday,
  startOfYear,
} from "date-fns";
import { Metadata } from "next";
import { ActivityHeader } from "./_components/activity-header";
import { months } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Activity Tracker",
  description:
    "Track your activities throughout the year with a visual calendar",
};

const CalendarGrid = ({ year }: { year: number }) => {
  const weeks: { [key: string]: Date[] } = {};
  const startDateOfYear = startOfYear(year);

  const currentDate = previousSunday(startDateOfYear);
  const days = eachDayOfInterval({
    start: currentDate,
    end: nextSaturday(lastDayOfYear(startDateOfYear)),
  });

  days.forEach((date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Manila",
    });

    if (!weeks[dayOfWeek]) {
      weeks[dayOfWeek] = [];
    }

    weeks[dayOfWeek].push(date);
  });

  return (
    <div className="overflow-x-auto pb-3 space-y-4">
      <div className="grid grid-cols-12 w-full pl-9">
        {months.map((month) => (
          <p key={month} className="text-sm font-medium capitalize">
            {month}
          </p>
        ))}
      </div>
      <table className="w-full min-w-max table-auto">
        <tbody className="space-y-1">
          {Object.entries(weeks).map(([dayOfWeek, days]) => (
            <tr key={dayOfWeek} className="flex gap-1 items-center">
              <td className="text-xs w-8 text-muted-foreground">{dayOfWeek}</td>
              {days.map((date) => (
                <td
                  key={date.toLocaleDateString()}
                  className="rounded bg-slate-100 aspect-square flex-1"
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function ActivityTrackerPage() {
  return (
    <div className="container p-6">
      <ActivityHeader />
      {/* <ActivityCalendar year={2025} /> */}

      <CalendarGrid year={2025} />
    </div>
  );
}
