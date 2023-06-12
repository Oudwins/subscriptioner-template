import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Subscription,
  columns,
} from "~/components/dashboard/SubscriptionTable";
import { DataTable } from "~/components/ui/DataTable/";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const { isLoaded, userId, sessionId } = useAuth();
  const subscriptions = api.subscriptions.getMySubscriptions.useQuery(
    undefined,
    {
      enabled: isLoaded,
    }
  );

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="container">
          {/* LOADING SPINNER */}
          {subscriptions.isLoading && <LoadingSpinner />}

          {subscriptions.data && (
            <DataTable columns={columns} data={subscriptions.data} />
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
