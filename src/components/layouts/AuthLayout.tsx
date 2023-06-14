import { ReactNode } from "react";
import Head from "next/head";

export default ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Ridaly Portal de Clientes</title>
        <meta
          name="description"
          content="Inicia sesión para gestionar tus servicios y obtener soporte personalizado"
        ></meta>
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="">{children}</div>
        </div>
      </main>
    </>
  );
};
