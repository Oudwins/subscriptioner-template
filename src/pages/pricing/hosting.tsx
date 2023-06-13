import Stripe from "stripe";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import type { InferGetServerSidePropsType } from "next";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { formatCurrency } from "~/utils/format";

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
      price: p.unit_amount || 0,
      interval: p.recurring?.interval,
      currency: p.currency,
      features: JSON.parse(product.metadata.featuresList as string) || null,
    };
  });
  const plans = (await Promise.all(productPromises)).sort(
    (a, b) => a.price - b.price
  );

  // PLANES FEATURES
  // basic ["Servidores ultra rápidos", "Certificado SSL gratuito", "Backups Gratuitos", "Seguridad Mejorada", "Garantía de devolución", "CDN gratuita", "Correo electrónico gratuito"]
  // ["Servidores ultra rápidos", "Certificado SSL gratuito", "Backups Gratuitos", "Seguridad Mejorada", "Garantía de devolución", "CDN gratuita", "Correo electrónico gratuito"]
  // wp ["Wordpress gestionado", "Servidores ultra rápidos", "Certificado SSL gratuito", "Backups Gratuitos", "Seguridad Mejorada", "Garantía de devolución", "CDN gratuita", "Correo electrónico gratuito", "staging", "mejor cache WordPress"]
  // advanced ["Nivel más alto de recursos", "Soporte Prioritario", "Mantenimiento Web", "Servidores ultra rápidos", "Certificado SSL gratuito", "Backups Gratuitos", "Seguridad Mejorada", "Garantía de devolución", "CDN gratuita", "Correo electrónico gratuito", "staging"]

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

  async function processSubscription(priceId: string) {
    const { sessionId, sessionUrl } = await createCheckoutSession({
      priceId: priceId,
    });
    router.push(sessionUrl as string);
  }

  return (
    <div>
      <div className="">
        <section className="py-14">
          <div className="mx-auto max-w-screen-xl px-4 text-gray-600 md:px-8">
            <div className="relative mx-auto max-w-xl text-center">
              <h1 className="text-3xl font-extrabold text-gray-800 sm:text-6xl">
                Planes de Hosting
              </h1>
              <div className="mt-3 max-w-xl text-lg">
                <p>Hospedaje web compartido ultrarrápido y de bajo coste</p>
              </div>
            </div>

            {/* PRECIOS */}
            <div className="mt-16 justify-center gap-6 space-y-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
              {plans.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-1 flex-col items-stretch  space-y-8 rounded-xl border-2 p-8"
                >
                  {/* price */}
                  <div>
                    <div className="text-center text-xl font-medium text-indigo-600">
                      {item.name}
                    </div>
                    <div className="space-y-1">
                      <div className="mt-4 text-center text-3xl font-semibold text-gray-800">
                        {formatCurrency({
                          amount: item.price / 12,
                          currency: item.currency,
                        })}{" "}
                        <span className="text-xl font-normal text-gray-600">
                          /mes{" "}
                        </span>
                      </div>
                      <div className="text-center text-xs italic">
                        {" "}
                        (pagado anualmente)
                      </div>
                    </div>
                  </div>
                  {/* BUY BUTTON */}
                  <div className="flex items-start">
                    <Button
                      onClick={() => {
                        processSubscription(item.priceId);
                      }}
                      className="w-full rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
                    >
                      Contratar
                    </Button>
                    {/* <button className="w-full rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700">
                      Contratar
                    </button> */}
                  </div>
                  {/* Features */}
                  {!!item.features && !!item.features[0] && (
                    <ul className="flex-1 space-y-3">
                      {item.features.map((featureItem: string, idx: number) => (
                        <li key={idx} className=" text-center">
                          {featureItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
