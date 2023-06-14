import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="">{children}</div>
      </div>
    </main>
  );
};
