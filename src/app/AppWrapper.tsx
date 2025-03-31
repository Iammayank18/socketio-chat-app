import { ReactNode } from "react";
import GlobalContextProvider from "../context/GlobalContextProvider";
import Script from "next/script";

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <GlobalContextProvider>
      {children}
      <Script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></Script>
    </GlobalContextProvider>
  );
}
