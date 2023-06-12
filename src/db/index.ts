import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../env.mjs";
import { InferModel } from "drizzle-orm";
import { subscriptionSchema } from "./schema.js";

const connection = await mysql.createConnection({
  uri: env.DB_URL,
});

export const db = drizzle(connection);

// export type SubscriptionSchema = InferModel<
//   typeof subscriptionSchema,
//   "insert"
// >;

// model User {
//   id                       String                    @id @default(cuid())
//   name                     String?
//   email                    String?                   @unique
//   emailVerified            DateTime?
//   image                    String?
//   accounts                 Account[]
//   sessions                 Session[]
//   stripeCustomerId         String?
//   stripeSubscriptionId     String?
//   stripeSubscriptionStatus StripeSubscriptionStatus?
// }

// enum StripeSubscriptionStatus {
//   incomplete
//   incomplete_expired
//   trialing
//   active
//   past_due
//   canceled
//   unpaid
//   paused
// }

// model StripeEvent {
//   id               String   @id @unique
//   api_version      String?
//   data             Json
//   request          Json?
//   type             String
//   object           String
//   account          String?
//   created          DateTime
//   livemode         Boolean
//   pending_webhooks Int
// }
