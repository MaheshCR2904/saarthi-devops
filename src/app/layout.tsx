import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SaarthiProvider from "@/components/SaarthiProvider";

export const metadata: Metadata = {
  title: "Saarthi — Your Guide from Dreams to Legacy",
  description:
    "A holistic lifelong navigation platform that guides you from age 16 to retirement through every major life decision. Saarthi never judges — it only recalculates.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0e17] text-slate-100 antialiased">
        <SaarthiProvider>{children}</SaarthiProvider>
      </body>
    </html>
  );
}
