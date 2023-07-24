import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "../env.mjs";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
// ts
import type { Page } from "@/types/page";
import type { AppProps } from "next/app";
import Dashboard from "./dashboard/help.jsx";

type Props = AppProps & {
  Component: Page;
};

const MyApp: AppType = ({ Component, pageProps }: Props) => {
  const getLayout =
    Component.getLayout ||
    ((page) => <DashboardLayout> {page} </DashboardLayout>);

  return (
    <ClerkProvider
      localization={esES}
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...pageProps}
    >
      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
