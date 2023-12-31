import {
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
  char,
  index,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

import { InferModel, relations } from "drizzle-orm";

// interface subscriptionData {
//   domain?: string;
//   description?: string;
// }

export const subscriptionSchema = mysqlTable(
  "subscriptions",
  {
    id: char("id", { length: 28 }).primaryKey().notNull(),
    stripePriceId: varchar("stripe_product_id", { length: 50 }),
    userId: varchar("user_id", { length: 50 }).notNull(),
    currentPeriodStart: int("current_period_start").notNull(),
    currentPeriodEnd: int("current_period_end").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 520 }),
    price: int("price"),
    status: mysqlEnum("status", [
      "active",
      "canceled",
      "incomplete",
      "incomplete_expired",
      "past_due",
      "paused",
      "trialing",
      "unpaid",
    ]).notNull(),
    currency: varchar("currency", { length: 5 }),
    cancelledAt: int("cancelled_at"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    // data: json("data").$type<subscriptionData>(),
  },
  (table) => {
    return {
      userIndex: index("user_id_idx").on(table.userId),
    };
  }
);

export const subscriptionsRelations = relations(
  subscriptionSchema,
  ({ many }) => ({ invoices: many(invoiceSchema) })
);

export type SubscriptionSchema = InferModel<
  typeof subscriptionSchema,
  "insert"
>;

export const invoiceSchema = mysqlTable(
  "invoices",
  {
    id: char("id", { length: 27 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    subscriptionId: char("subscription_id", { length: 28 }).notNull(), //.references(() => subscriptionSchema.id),
    billingReason: varchar("billing_reason", { length: 50 }),
    description: varchar("description", { length: 500 }),
    status: mysqlEnum("status", [
      "draft",
      "open",
      "void",
      "paid",
      "uncollectible",
    ]),
    amountDue: int("amount_due").notNull(),
    amountPaid: int("amount_paid").notNull(),
    createdAt: int("created_at").notNull(),
    currency: varchar("currency", { length: 5 }),
    invoiceUrl: varchar("invoice_url", { length: 520 }),
  },
  (table) => {
    return {
      subscriptionIndex: index("subscription_id_idx").on(table.subscriptionId),
      userIndex: index("user_id_idx").on(table.userId),
    };
  }
);

export const invoicesRelations = relations(invoiceSchema, ({ one }) => ({
  subscription: one(subscriptionSchema, {
    fields: [invoiceSchema.subscriptionId],
    references: [subscriptionSchema.id],
  }),
}));

export type InvoiceSchema = InferModel<typeof invoiceSchema, "insert">;

// stripeInvoiceId
// billing_reason
// subscription
// userId
// status
// amount_due
// amount_paid
// created
// currency
// invoice_url

// account_country?

// export const invoiceSchema = mysqlTable("invoices", {
//   id: int("id").autoincrement().primaryKey(),
// });

// export const billingDetails = mysqlTable("billing_details", {
//   id: int("id").autoincrement().primaryKey(),
// });

// export const cities = mysqlTable('cities', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
//   countryId: int('country_id').references(() => countries.id),
//   popularity: mysqlEnum('popularity', ['unknown', 'known', 'popular']),
// });
