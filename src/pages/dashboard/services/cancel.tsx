import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { api } from "~/utils/api";
import Inner404 from "~/components/ui/inner404";
import { Button } from "~/components/ui/button";
import { useState, MouseEvent } from "react";

import { useRouter } from "next/router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Alert

// same as dashboard but shows all file
const CancelationPage: NextPage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [isSubmitting, setIsSumbmitting] = useState(false);
  const {
    subscription_id: subscriptionId,
    plan,
    current_period_end: currentPeriodEnd,
  } = router.query;

  // show 404 page if query params not provided
  if (!subscriptionId || !plan || !currentPeriodEnd) {
    return (
      <div className="">
        <Inner404 />
      </div>
    );
  }

  function calculateDaysLeft() {
    const oneDay = 24 * 60 * 60 * 1000;
    const subscriptionEnd = new Date(
      parseInt(currentPeriodEnd as string) * 1000
    );
    const today = new Date();
    // @ts-ignore
    return Math.round(Math.abs((subscriptionEnd - today) / oneDay));
  }
  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function handleSubscriptionCancelation(
    e: MouseEvent<HTMLElement>,
    subscriptionId: string
  ) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSumbmitting(true);

    router.push("/dashboard");
  }

  return (
    <>
      <main className="py-16">
        <div
          className="container flex items-center justify-center space-y-8"
          style={{ minHeight: "70vh" }}
        >
          {!isLoaded && <LoadingSpinner />}

          {isLoaded && (
            <div className="mx-auto max-w-4xl space-y-8">
              {/* HEADINGS */}
              <div className="space-y-4">
                <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight">
                  {user?.firstName}, tu web es tu{" "}
                  <span className="font-extrabold text-indigo-600">
                    escaparate digital
                  </span>
                  , cancelar tu subscripción es como cerrar tu tienda. ¿Seguro
                  que quieres cancelar tu{" "}
                  <span className="font-extrabold text-indigo-600">{plan}</span>
                  ?
                </h1>
                <h3 className="text-center text-xl font-medium sm:text-2xl">
                  Todavia{" "}
                  <span className="font-extrabold text-indigo-600">
                    te quedan {calculateDaysLeft()} días
                  </span>{" "}
                  para disfrutar de tu web hasta el próximo pago
                </h3>
              </div>

              {/* Buttons */}
              <div className="flex flex-col space-y-4  sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                {/* Three days before next billing cycle */}
                {/* <Button >Recuerdamelo más tarde </Button> */}

                {/* CLOSE ACCOUNT DIALOG */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="">
                      Cerrar mi tienda{" "}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Está acción es irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e: MouseEvent<HTMLElement>) =>
                          handleSubscriptionCancelation(
                            e,
                            subscriptionId as string
                          )
                        }
                        disabled={isSubmitting}
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/*  */}

                <Button
                  className="rounded-lg bg-indigo-600 px-3 py-3   font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
                  asChild
                >
                  <Link href="/"> Mantener subscripción</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CancelationPage;
