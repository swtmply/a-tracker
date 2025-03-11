export type Activity = {
  id: number;
  name: string;
  userId: string | null;
  color: string;
  metrics:
    | {
        name: string;
        score: number;
      }[]
    | null;
};

export type Entry = {
  date: string;
  id: number;
  activityId: number;
  score: number;
};

export interface ActivityWithEntries extends Activity {
  entries: Entry[];
}
