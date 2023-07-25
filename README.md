# Subscriptioner

#### Video: https://youtu.be/PDJzmKOsLvw

#### Description:

##### What is this?

This is meant to be the base building blocks for any app that needs to manage subscriptions & handle subscription payments. The example used here is a hosting company. Since this was the usecase I was aiming for.

This repo was used as the basis for my hosting business (whose repo is not public unfortunatly), you can visit the site here -> https://app.ridaly.com

##### What does it do?

Clerk.dev protects all routes, requiring you to sign in to view the app.

Once you are signed in, you may purchase a "hosting" subscription on a yearly basis. This uses stripe checkout to generate a checkout page for the user.

If the user pays, a webhook is sent to our backend with the new subscription as well as the userId. To avoid getting raid limited by using stripe's api as a database we store the subscription inside our own mysql DB.

Finally, the user is redirected to the home page, where he may view his own subscriptions, their statuses, the next due date, the price.... He may cancel a subscription, in which case it is set to end at the next due date.

The user may also view all his invoices, or invoices for a specific subscription.

Finnaly, there is a simple support form.

##### What tecnologies does it use?

This repo is built up on the t3 stack (https://create.t3.gg/). Mostly because I was familiar with front-end web dev but wanted to make something more complex & have an excuse to learn nextjs, react & try out the t3 stack.

From the T3 stack we take

- TRPC, a typesafe alternative to having a rest api. (Really just uses http under the hood but is nicer to work with)
- tailwind, strictly better than CSS (we should have learned it instead!)
- typescript, not much to say here...
- nextjs/react, not much to say here...

Things I have added

- Clerk.dev for auth. I didn't want to spend most of the time on this project getting auth right so I chose to use clerk to move faster and get to working on the things that mattered in this case.
- stripe, to handle payments
- drizzle-orm, this is a pretty barebones orm for mysql. It works amazing and really isn't that much different from writing raw sql queries like we did in cs50. But the ability to describe the DB tables in a file and push to update is really nice.
- shadcn ui (https://ui.shadcn.com/), this uses headless uis to create tailwind styled components you can customize. It allowed me to create the UI pretty fast so I could focus on building the backend logic.

##### Relevant Files & folder structure

Everything relevant is inside the src/ dir so I will omit it.

"Front End"

- /pages/index.ts
  - This never shows because the app currently redirects / to /dahsboard. Its just there in case I want to make a landing page for the hosting service (which I ended up doing for app.ridaly.com)
- /pages/dashboard/index.tsx
  - home page. Queries the backend & displays a table with all your active subscriptions (yes it filters)
- /pages/dashboard/services/index.tsx
  - queries backend & displays table with ALL your subscriptions (no filters)
  - Looking back at it now, its not great UX. I wanted to do it differently, but making a front end table filter that was on by default on the home page looked like it would take longer than I had.
- /pages/dashboard/invoices
  - queries the backend & displays a similar table with all your invoices
- /pages/dashboard/help
  - support form
- /pages/pricing
  - Every time the site builds, calls the stripe api, gets the recurring products and generates this page statically based on the updated information.
- /pages/dashboard/services/cancel
  - gets the subscription id from query param and makes sure you want to cancel the subscription. If you do, it calls the backend api to request subscription cancel.
- /utils/format.ts
  - contains some utility functions I wrote to format currencies & dates correctly on the front end. We store dates as unix timestamps and I wanted to avoid having lots of repetitive code to convert them for exmaple.
- /components - the components used inside the previous mentioned pages. Some are writen by me some are copied from shadcn ui
  "Back End"
- /db/schema.ts
  - contains the DB schema. This is a representation of the mysql tables using code
- /pages/api/stripe-hooks
  - This is the api end point that handles the stripe hooks. Mostly it just routes each hook to the appropriate handler
- /server/stripe/stripe-webhook-handlers.ts
  - This is where all the logic about interacting with stripe & storing stripe information on our database lives
- /server/stripe/utils
  - these are a few utility functions regarding stripe, mostly used inside the previous file
- /server/api/routers
  - these are the equivalent of our rest resources but for trpc.
  - these are mostly protected end points that can only be called if you are authenticated.
  - There is one for invoices, stripe (to create a checkout session) and for subscriptions.

Most of the other files are boilerplate provided by t3app or configuration files. Some of which I did edit, or even write code in. But the most important aspects of this project are in the above files.

##### Problems I encountered

I did not encounter many problems or hard to fix bugs. I imagine that is because the application is quite simple. The biggest roadblock was how unfamiliar I was with the tecnologies I was using.

It took me almost 2 days to get the logic of how the T3 stack functioned, how nextjs works, how trpc works and be able to start writing code. After grinding it out for those first days everything started to click and was pretty smooth sailing from there.

##### Design Decision

I believe the design was mostly straight forward. The design decisions related to choosing technologies are in the tecnologies section. Here I hope to detail & explain at least some of the other design decisions.

1. Having two pages for displaying subscriptions.

As I mentioned above, I believe this is a mistake and I will fix it in the future. It generates a lot of duplicate code. However, at the moment I do not have time to do what I believe to be the best solution for this problem which is adding a client side filter option. (I do realise that it would be a bad solution if people had many subscriptions because you would have to load all the subscriptions on page load, but it does not seem likely).

2. Storing the userId inside the invoice object.
   This was mostly done for convenience. The alternative was to have to build a somewhat complex query that would query for all the invoices for any subscription for the current user. It would also force me to add additional database queries when getting information about a specific invoice. Because we would need to check if the user is allowed to view information about that invoice and to do that we would need to query for the attached subscription and see if it has the correct userId.

##### Thoughts on the project as a whole

It is certainly not the most complex app ever writen (and certainly has bugs). But I am pretty how with my work for two main reasons.

Firstly, the only technologies I was familiar with before starting the project were typescript and reactjs. Everything else I had to learn on the go. Which was quite the challenge. Additionally, I am happy that I could turn it into something of use in the real world. Not just a course project.

## How to copy this or run this locally

1. Clone repo
2. run pnpm install
3. rename .env.example to .env & fill out the env variables
4. run pnpm run db:push (this makes drizzle-orm push the DB structure to your sql database)]
5. You may want to either comment out the pricing page or have a look at it. We get the subscription features from the stripe product metadata. So if your products don't have any, build will fail.
6. run pnpn start.
7. Done!
8. Checkout the t3 stack for information on the project structure

## TODO Future

- load the .md legal pages inside assets/legalPages & add links to them inside the website footer
- i18n
