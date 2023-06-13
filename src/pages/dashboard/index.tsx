import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Subscription,
  columns,
} from "~/components/dashboard/SubscriptionTable";
import { DataTable } from "~/components/ui/DataTable/";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { api } from "~/utils/api";
// Alert
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send } from "lucide-react";

const Dashboard: NextPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const subscriptions = api.subscriptions.getMySubscriptions.useQuery(
    { filter: { status: "active" } },
    {
      enabled: isLoaded,
    }
  );

  return (
    <>
      {/* <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <main className="py-16">
        <div className="container space-y-8" style={{ minHeight: "50vh" }}>
          {/* Alert */}
          {!isLoaded && <LoadingSpinner />}

          {isLoaded && (
            <Alert className="space-y-3 sm:flex">
              <div className="mr-5 hidden sm:block">
                <Send className="h-full" />
              </div>
              <div className="space-y-2">
                <AlertTitle className="">Hola {user?.firstName} </AlertTitle>
                <AlertDescription>
                  Si necesitas algo no dudes en poner en contacto con nosotros!
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* TABLE */}
          <div>
            {/* LOADING SPINNER */}
            {subscriptions.isLoading && <LoadingSpinner />}
            {subscriptions.data && (
              <DataTable columns={columns} data={subscriptions.data} />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
