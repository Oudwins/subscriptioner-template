# Subscriptioner 
####
#### Description:

##### What is this?
This is meant to be the base building blocks for any app that needs to manage subscriptions & handle subscription payments. The example used here is a hosting company. Since this was the usecase I was aiming for.

This repo was used as the basis for my hosting business (whose repo is not public unfortunatly), you can visit the site here -> https://app.ridaly.com

#### How does it work?
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


##### Problems I encountered
I did not encounter many problems or hard to fix bugs. I imagine that is because the application is quite simple. The biggest roadblock was how unfamiliar I was with the tecnologies I was using.

It took me almost 2 days to get the logic of how the T3 stack functioned, how nextjs works, how trpc works and be able to start writing code. After grinding it out for those first days everything started to click and was pretty smooth sailing from there.


##### Thoughts on the project as a whole
It is certainly not the most complex app ever writen (and certainly has bugs). But I am pretty how with my work. It was a chance to, as I have said, learn some tecnologies I was unfamiliar with and I am happy that I could turn it into something of use in the real world. Not just a course project.

