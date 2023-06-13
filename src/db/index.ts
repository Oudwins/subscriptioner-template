// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";
import * as schema from "./schema";

const connection = connect({
  url: env.DB_URL,
});

export const db = drizzle(connection);

export const dbHighLevel = drizzle(connection, { schema });
// mySQL
// const connection = await mysql.createConnection({
//   uri: env.DB_URL,
// });

// export const db = drizzle(connection);
