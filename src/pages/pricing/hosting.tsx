import Stripe from "stripe";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import type { InferGetServerSidePropsType } from "next";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";

// runs once at build time & is cached
export const getStaticProps = async () => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  const { data: prices } = await stripe.prices.list({
    type: "recurring",
    active: true,
  });

  const productPromises = prices.map(async (p) => {
    const product = await stripe.products.retrieve(
      p.product as unknown as string
    );

    return {
      id: p.id,
      name: product.name,
      priceId: p.id,
      price: p.unit_amount,
      interval: p.recurring?.interval,
      currency: p.currency,
    };
  });

  const plans = await Promise.all(productPromises);
  // HACE FALTA ALGO QUE ORDENE AQUI LOS PLANES

  return {
    props: {
      plans,
    },
  };
};

export default ({
  plans,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  //const [prices, setPrices] = useState([]);
  const { mutateAsync: createCheckoutSession } =
    api.payments.createSubscriptionCheckout.useMutation();
  const router = useRouter();

  async function processSubscription() {
    console.log("button clicked");
    const { sessionId, sessionUrl } = await createCheckoutSession({
      priceId: plans[0]?.priceId as string,
    });
    router.push(sessionUrl as string);
  }

  return (
    <div>
      {" "}
      <Button onClick={processSubscription}>Subscribe!</Button>
    </div>
  );
};
