import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "../env.mjs";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      localization={esES}
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...pageProps}
    >
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
      <script async src="//js-eu1.hs-scripts.com/27233929.js"></script>
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
