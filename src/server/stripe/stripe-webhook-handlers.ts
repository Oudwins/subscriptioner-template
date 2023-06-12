import type Stripe from "stripe";
import { db } from "~/db";
import { subscriptionSchema } from "~/db/schema";
import { InferModel, eq, and, asc, desc, or } from "drizzle-orm";

type SubscriptionSchema = InferModel<typeof subscriptionSchema, "insert">;

export const handleInvoicePaid = async ({
  event,
  stripe,
}: {
  event: Stripe.Event;
  stripe: Stripe;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );
  const userId = subscription.metadata.userId;

  //   // update user with subscription data
  //   await prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       stripeSubscriptionId: subscription.id,
  //       stripeSubscriptionStatus: subscription.status,
  //     },
  //   });
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
