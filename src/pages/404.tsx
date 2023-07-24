import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Inner404 from "~/components/ui/inner404";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="Page not found" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {/* <UserButton afterSignOutUrl="/" /> */}
        <Inner404></Inner404>
        {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
      </main>
    </>
  );
};

export default Home;
