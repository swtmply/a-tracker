import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { months } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ActivityWithEntries } from "@/types/activity";
import {
  eachDayOfInterval,
  format,
  lastDayOfYear,
  nextSaturday,
  previousSunday,
  startOfYear,
} from "date-fns";

const createCalendar = (year: number) => {
  const weeks: { [key: string]: Date[] } = {};
  const startDateOfYear = startOfYear(new Date(year, 0, 1));

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

  return weeks;
};

export const CalendarGrid = ({
  year,
  activity,
}: {
  year: number;
  activity: ActivityWithEntries;
}) => {
  const weeks = createCalendar(year);
  const entries = activity.entries.reduce(
    (acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = entry;
      }
      return acc;
    },
    {} as {
      [key: string]: {
        id: number;
        date: string;
        activityId: number;
        score: number;
      };
    }
  );

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold">{activity.name}</h4>
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
                <td className="text-xs w-8 text-muted-foreground">
                  {dayOfWeek}
                </td>
                {days.map((date) => {
                  const entry = entries?.[format(date, "yyyy-MM-dd")];

                  return (
                    <TooltipProvider key={date.toLocaleDateString()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <td
                            key={date.toLocaleDateString()}
                            className={cn(
                              "rounded bg-slate-100 aspect-square flex-1",
                              entry && `bg-${activity.color}-500`
                            )}
                          ></td>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {format(date, "PPP")} - Score: {entry?.score ?? 0}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CalendarGridSkeleton = () => {
  const weeks = createCalendar(2025);

  return (
    <div className="space-y-4">
      <Skeleton className="w-1/4 h-7" />
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
                <td className="text-xs w-8 text-muted-foreground">
                  {dayOfWeek}
                </td>
                {days.map((date) => {
                  return (
                    <td
                      key={date.toLocaleDateString()}
                      className={cn(
                        "rounded animate-pulse bg-primary/10 aspect-square flex-1"
                      )}
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
