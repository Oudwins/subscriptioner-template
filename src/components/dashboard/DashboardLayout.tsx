import { useState, type ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(false);

  // Replace javascript:void(0) paths with your paths
  const navigation = [
    { title: "Panel de Control", path: "/dashboard" },
    { title: "Mis Servicios", path: "/dashboard" },
    { title: "Facturación", path: "/invoices" },
    { title: "Atención al Cliente", path: "/help" },
  ];

  const footerNav = [
    {
      href: "/terms-of-service",
      name: "Terminos de Uso",
    },
    {
      href: "/privacy-policy",
      name: "Política de Privacidad",
    },
    {
      href: "/privacy-policy",
      name: "Política de Cookies",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full border-b bg-white md:static md:border-none md:text-sm">
        <div className="container mx-auto items-center px-4 md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:block md:py-5">
            <Link href="/dashboard">
              <img
                src="https://www.floatui.com/logo.svg"
                width={120}
                height={50}
                alt="Float UI logo"
              />
            </Link>
            <div className="md:hidden">
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setState(!state)}
              >
                {state ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div
            className={`mt-8 flex-1 pb-3 md:mt-0 md:block md:pb-0 ${
              state ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-end space-y-6 md:flex md:space-x-6 md:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li key={idx} className="text-gray-700 hover:text-indigo-600">
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <span className="hidden h-6 w-px bg-gray-300 md:block"></span>
              <div className="items-center gap-x-6 space-y-3 md:flex md:space-y-0">
                <UserButton afterSignOutUrl="/" />
                {/* <li>
                  <Link
                    href="javascript:void(0)"
                    className="block rounded-lg border py-3 text-center text-gray-700 hover:text-indigo-600 md:border-none"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="javascript:void(0)"
                    className="block rounded-lg bg-indigo-600 px-4 py-3 text-center font-medium text-white shadow hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none md:inline"
                  >
                    Sign in
                  </Link>
                </li> */}
              </div>
            </ul>
          </div>
        </div>
      </nav>
      {/* CONTENT */}
      {children}

      {/* Footer */}

      <footer className="pt-10">
        <div className="mx-auto max-w-screen-xl px-4 text-gray-600 md:px-8">
          <div className="mt-10 items-center justify-between border-t py-10 sm:flex">
            <p>© {new Date().getFullYear()} Ridaly Inc. All rights reserved.</p>
            <ul className="mt-6 flex flex-wrap items-center gap-4 sm:mt-0 sm:text-sm">
              {footerNav.map((item, idx) => (
                <li className="text-gray-800 duration-150 hover:text-gray-500">
                  <Link key={idx} href={item.href}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};
