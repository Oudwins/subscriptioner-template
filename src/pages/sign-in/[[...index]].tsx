import { SignIn } from "@clerk/nextjs";
import type { Page } from "@/types/page";
import AuthLayout from "~/components/layouts/AuthLayout";

const Page: Page = () => {
  return <SignIn path="/sign-in" signUpUrl="/sign-up" />;
};

Page.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page;
