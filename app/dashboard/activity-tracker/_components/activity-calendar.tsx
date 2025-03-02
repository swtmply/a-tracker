import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  eachDayOfInterval,
  endOfWeek,
  endOfYear,
  format,
  isSameYear,
  startOfWeek,
  startOfYear,
} from "date-fns";

// Sample data generator function for a full year
const generateSampleCommitData = (year = new Date().getFullYear()) => {
  const data = [];

  // Generate data for each day of the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      // Random commit count (weighted to have more zeros)
      const random = Math.random();
      let count = 0;

      if (random > 0.7) {
        count = Math.floor(Math.random() * 12);
      }

      data.push({
        date: format(date, "yyyy-MM-dd"),
        count,
      });
    }
  }

  return data;
};

const getColorClass = (count: number) => {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  if (count <= 3) return "bg-emerald-200 dark:bg-emerald-900";
  if (count <= 6) return "bg-emerald-300 dark:bg-emerald-700";
  if (count <= 9) return "bg-emerald-400 dark:bg-emerald-600";
  return "bg-emerald-500 dark:bg-emerald-500";
};

interface ActivityCalendarProps {
  year: number;
}

export const ActivityCalendar = ({ year }: ActivityCalendarProps) => {
  const commitData = generateSampleCommitData(year);

  // Create date range for the entire year
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 0, 1));

  // Get the first Sunday that includes or comes before January 1
  const calendarStart = startOfWeek(yearStart);

  // Get the last Saturday that includes or comes after December 31
  const calendarEnd = endOfWeek(yearEnd);

  // Create an array of all days in the extended calendar range
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Create a map of date strings to commit counts for quick lookup
  const commitMap = commitData.reduce((acc, { date, count }) => {
    acc[date] = count;
    return acc;
  }, {} as Record<string, number>);

  // Organize days into a 7×n grid (Sunday to Saturday)
  const calendarGrid: (Date | null)[][] = [];

  // Initialize the grid with 7 rows (one for each day of the week)
  for (let i = 0; i < 7; i++) {
    calendarGrid.push([]);
  }

  // Fill the grid with days
  allDays.forEach((day) => {
    const dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    calendarGrid[dayOfWeek].push(day);
  });

  // Calculate the maximum number of columns needed
  const maxCols = Math.max(...calendarGrid.map((row) => row.length));

  // Ensure all rows have the same number of columns by adding null fillers
  calendarGrid.forEach((row) => {
    while (row.length < maxCols) {
      row.push(null);
    }
  });

  // Get month labels for the top of the calendar
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Calculate positions for month labels (only for the selected year)
  const monthPositions = monthLabels.map((_, index) => {
    // Find the column index for the first day of each month
    const firstDayOfMonth = new Date(year, index, 1);
    const dayOfWeek = firstDayOfMonth.getDay();

    // Find which column this date appears in
    let columnIndex = 0;
    for (let col = 0; col < maxCols; col++) {
      if (
        calendarGrid[dayOfWeek][col] &&
        calendarGrid[dayOfWeek][col]?.getTime() === firstDayOfMonth.getTime()
      ) {
        columnIndex = col;
        break;
      }
    }

    return columnIndex;
  });

  // Day of week labels
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("flex flex-col space-y-2")}>
      <div className="flex max-w-[850px] overflow-x-auto text-xs text-gray-500 pl-8">
        {monthLabels.map((month, i) => {
          const width =
            i < monthLabels.length - 1
              ? monthPositions[i + 1] - monthPositions[i]
              : maxCols - monthPositions[i];

          return (
            <div
              key={month}
              className="flex-grow justify-end flex"
              style={{
                marginLeft: i === 0 ? 0 : undefined,
                width: `${width * 15}px`,
                minWidth: "30px",
                textAlign: "left",
              }}
            >
              {month}
            </div>
          );
        })}
      </div>

      <div className="flex">
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 py-1 h-full">
          {dayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 grid-flow-col gap-1">
          {Array.from({ length: maxCols }).map((_, colIndex) => (
            <div key={colIndex} className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }).map((_, rowIndex) => {
                const day = calendarGrid[rowIndex][colIndex];

                if (day === null) {
                  // Empty cell for padding
                  return (
                    <div
                      key={`empty-${rowIndex}-${colIndex}`}
                      className="w-3 h-3"
                    />
                  );
                }

                const isCurrentYear = isSameYear(day, yearStart);
                const dateStr = format(day, "yyyy-MM-dd");
                const count = isCurrentYear ? commitMap[dateStr] || 0 : 0;

                return (
                  <TooltipProvider key={dateStr}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-3 h-3 rounded-sm",
                            isCurrentYear
                              ? getColorClass(count)
                              : "bg-gray-50 dark:bg-gray-900", // Lighter color for dates outside current year
                            "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {isCurrentYear ? (
                          <p>
                            {count} commit{count !== 1 ? "s" : ""} on{" "}
                            {format(day, "MMM d, yyyy")}
                          </p>
                        ) : (
                          <p>{format(day, "MMM d, yyyy")}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
