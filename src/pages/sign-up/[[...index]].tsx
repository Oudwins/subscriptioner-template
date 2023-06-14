import { SignUp } from "@clerk/nextjs";
import type { Page } from "@/types/page";
import AuthLayout from "~/components/layouts/AuthLayout";

const Page: Page = () => {
  return <SignUp path="/sign-up" signInUrl="/sign-in" />;
};

Page.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page;
