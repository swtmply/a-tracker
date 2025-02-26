import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_AUTH_TOKEN!,
});

export default drizzle(client, { schema });
