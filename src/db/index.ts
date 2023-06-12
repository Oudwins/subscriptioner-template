// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";
import { InferModel } from "drizzle-orm";
import { subscriptionSchema } from "./schema.js";

const connection = connect({
  url: env.DB_URL,
});

export const db = drizzle(connection);
// mySQL
// const connection = await mysql.createConnection({
//   uri: env.DB_URL,
// });

// export const db = drizzle(connection);
