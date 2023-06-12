import { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { stripe } from "~/server/stripe/client";
import { env } from "~/env.mjs";
import { buffer } from "micro";
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionUpdated,
  handleSubscriptionCreated,
} from "~/server/stripe/stripe-webhook-handlers";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
  } catch (e) {
    return res.status(400).send(e);
  }

  // EVENT TYPES!
  // payment_intent.created
  // payment_intent.succeeded
  // customer.subscription.updated
  // invoice.payment_succeeded

  switch (event.type) {
    case "invoice.paid":
      console.log(JSON.stringify(event));
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
      await handleInvoicePaid({
        event,
        stripe,
      });
      break;
    case "customer.subscription.created":
      // Used to provision services as they are added to a subscription.
      await handleSubscriptionCreated({
        event,
      });
      break;
    case "customer.subscription.updated":
      // Used to provision services as they are updated.
      await handleSubscriptionUpdated({
        event,
      });
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
      break;
    case "customer.subscription.deleted":
      // handle subscription cancelled automatically based
      // upon your subscription settings.
      await handleSubscriptionCanceled({
        event,
      });
      break;
    default:
    // Unexpected event type
  }

  return res.status(200).send({ message: "success" });
};

export default webhook;
