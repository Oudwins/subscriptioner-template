import type Stripe from "stripe";
import { db } from "~/db";
import {
  subscriptionSchema,
  SubscriptionSchema,
  invoiceSchema,
  InvoiceSchema,
} from "~/db/schema";
import { eq, and, asc, desc, or } from "drizzle-orm";

// invoice events -> https://stripe.com/docs/billing/subscriptions/webhooks#understand
// - WHEN YOU CREATE IT
// 1. invoice.created
// 2. invoice.finalized
// 3. invoice.finalization_failed (need to handle this some way if I want to create invoices)
// - OTHER
// 1. invoice.paid
// 2. invoice.payment_action_required
// 3. invoice.payment_failed
// 4. invoice.upcoming
// 5. invoice.updated

const createNewInvoiceObj = (event: Stripe.Event, userId: string) => {
  const invoice = event.data.object as Stripe.Invoice;

  const newInvoice: InvoiceSchema = {
    id: invoice.id,
    userId,
    subscriptionId: invoice.subscription as string,
    billingReason: invoice.billing_reason,
    description: invoice.description,
    status: invoice.status,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    invoiceUrl: invoice.hosted_invoice_url,
    createdAt: invoice.created,
    currency: invoice.currency,
  };

  return newInvoice;
};

export const handleInvoices = async ({ event }: { event: Stripe.Event }) => {
  const invoice = event.data.object as Stripe.Invoice;

  // find subscription & throw error if it doesn't exist + get the user
  if (!invoice.subscription) {
    // error
    console.error("INVOICE WITHOUT SUBSCRIPTION");
    return;
  }
  const subscription = await db
    .select()
    .from(subscriptionSchema)
    .where(eq(subscriptionSchema.id, invoice.subscription as string));
  if (subscription.length === 0) {
    // error
    console.error("INVOICE WITHOUT SUBSCRIPTION");
    return;
  }

  // returns empty array if it doesn't find anything
  const results = await db
    .select()
    .from(invoiceSchema)
    .where(eq(invoiceSchema.id, invoice.id));

  if (results.length === 0) {
    // INSERT!
    const invoiceObj = createNewInvoiceObj(
      event,
      subscription[0]?.userId as string
    );
    const res = await db.insert(invoiceSchema).values(invoiceObj);
  } else {
    // UPDATE
    const res = await db
      .update(invoiceSchema)
      .set({
        billingReason: invoice.billing_reason,
        description: invoice.description,
        status: invoice.status,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        invoiceUrl: invoice.hosted_invoice_url,
      })
      .where(eq(invoiceSchema.id, invoice.id));
  }
};

const createNewSubscriptionObj = (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const {
    id,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    status,
  } = subscription;
  const userId = subscription.metadata.userId;

  const subscriptionObj: SubscriptionSchema = {
    id: id,
    userId: userId as string,
    name: subscription.items.data[0]?.price.nickname || "Subscripción",
    currentPeriodStart,
    currentPeriodEnd,
    currency: subscription.currency,
    status,
    price: subscription.items.data[0]?.price["unit_amount"] || null,
    stripePriceId: subscription.items.data[0]?.price.id || null,
  };

  return subscriptionObj;
};

export const handleSubscriptionCreated = async ({
  event,
}: {
  event: Stripe.Event;
}) => {
  const subscriptionObj = createNewSubscriptionObj(event);
  try {
    const res = await db.insert(subscriptionSchema).values(subscriptionObj);
  } catch (e) {
    console.log(e);
  }
};

export const handleSubscriptionUpdated = async ({
  event,
}: {
  event: Stripe.Event;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const { id } = subscription;

  // returns empty array if it doesn't find anything
  const results = await db
    .select()
    .from(subscriptionSchema)
    .where(eq(subscriptionSchema.id, id));

  if (results.length === 0) {
    // INSERT!
    const subscriptionObj = createNewSubscriptionObj(event);
    const res = await db.insert(subscriptionSchema).values(subscriptionObj);
  } else {
    // UPDATE
    const res = await db
      .update(subscriptionSchema)
      .set({
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        price: subscription.items.data[0]?.price["unit_amount"] || null,
        stripePriceId: subscription.items.data[0]?.price.id || null,
      })
      .where(eq(subscriptionSchema.id, id));
  }
};

export const handleSubscriptionCanceled = async ({
  event,
}: {
  event: Stripe.Event;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const {
    id: stripeId,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    status,
  } = subscription;
  const res = await db
    .update(subscriptionSchema)
    .set({
      currentPeriodStart,
      currentPeriodEnd,
      status,
      price: subscription.items.data[0]?.price["unit_amount"] || null,
      stripePriceId: subscription.items.data[0]?.price.id || null,
    })
    .where(eq(subscriptionSchema.id, stripeId));
};
