# Create T3 App

## Requirements

- The stripe CLI to locally test webhooks

## TODO

- deploy to vercel

- Legal pages in MD -> remove A2 hosting relevant info & serve them statically.

  - https://www.youtube.com/watch?v=Hiabp1GY8fA

- change billing details?
- payment methods? edit?
- On boarding questions? Get phone number for db?
- add billing email to subscription? Where we send the invoices
- Figure out how to do mobile that works for the DataTable
- build a utility to construct the where clause based on filter object for DB
- implement reload subscription data button
- Create a subscription page where you have access to all the data for a specific subscription

## TODO less important

- Header

  - Add payment methods?
  - Add billing details?

- Subscriptions
  Make option for free trials without credit card. Need to handle - customer.subscription.paused - customer.subscription.resumed - customer.subscription.trial_will_end

  On subscription update MAY WANT TO HANDLE WHEN A SUBSCRIBER DECIDES TO CANCEL AT PERIOD END. NOT RIGHT NOW BUT AT SOME POINT. REACHES HERE THEN WHEN PERIOD ENDS SENDS DELETED

- Data Table

  - make custom filter component! that works on any table

- Layouts

  - Remove dashboard layout as default & add getLayout function (need to do some ts config...)

- dashboard

  - avoid the additional call to DB when user clicks on my services (have that be a simply link, query param that filters the data passed to the table)
  - Allow for notifications via either DB table or just query params (the alert)

- cancel
  - Make 2nd page where I try to convince you to switch to monthly payments

## Customizing this

- Make sure to head to stripe & customize the invoices & checkout pages for better customer experience
- look at schema & stripe hooks. Please not right now it is set up to only handle subscriptions. Not one time payments.
- In the stripe products add features or they won't show up. (product.metadata.featuresList as array)

- Make sure to edit the pages/dashboard/services/cancel text to align with the subscriptions you have

- To avoid having to make the products twice do this
- https://gist.github.com/mikegogulski/83ce5f6ac0633ca6cac913d0dab4b9eb

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
