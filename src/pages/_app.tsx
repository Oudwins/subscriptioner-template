import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "../env.mjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      localization={esES}
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...pageProps}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
