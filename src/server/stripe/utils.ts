import { clerkClient, type User } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { getBaseUrl } from "../../utils/api";
import { stripe } from "./client";
//import { stripeApiClient } from "use-stripe-subscription";

export const createCustomerId = async ({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string | undefined;
}) => {
  const customer = await stripe.customers.create(
    {
      email: userEmail || "noemail@noemail.com",
      metadata: {
        userId: userId,
      },
    },
    {
      idempotencyKey: userId,
    }
  );

  const user = await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      stripeCustomerId: customer.id,
    },
  });

  return user.publicMetadata.stripeCustomerId as string;
  //   const customerCreate = await stripeApiClient.customers.create(
  //     {
  //       name: user.firstName + " " + user.lastName,
  //       email: user.emailAddresses.find(
  //         (x) => x.id === user.primaryEmailAddressId
  //       ).emailAddress,
  //       metadata: {
  //         userId: user.id,
  //       },
  //     },
  //     {
  //       idempotencyKey: user.id,
  //     }
  //   );
  // user = await clerkClient.users.updateUser(user.id, {
  //   publicMetadata: {
  //     stripeCustomerId: customerCreate.id,
  //   },
  // });
  //return user.publicMetadata.stripeCustomerId as string;
};

export const findOrCreateCustomerId = async ({ user }: { user: User }) => {
  if (user.publicMetadata.stripeCustomerId) {
    return user.publicMetadata.stripeCustomerId;
  }
  const userEmail = user.emailAddresses.find(
    (x) => x.id === user.primaryEmailAddressId
  )?.emailAddress;
  return await createCustomerId({
    userId: user.id,
    userEmail: userEmail,
  });
};

export const createSubscriptionCheckout = async ({
  user,
  priceId,
  successUrl,
}: {
  user: User;
  priceId: string;
  successUrl?: string;
}) => {
  const stripeCustomerId = await findOrCreateCustomerId({ user });
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as any,
    client_reference_id: user.id,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${getBaseUrl()}${
      successUrl || "/dashboard?checkoutSuccess=true"
    }`,
    cancel_url: `${getBaseUrl()}/dashboard?checkoutCancelled=true`,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
  });

  return { sessionId: session.id, sessionUrl: session.url };
};
