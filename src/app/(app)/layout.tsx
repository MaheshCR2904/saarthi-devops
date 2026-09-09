"use client";

import { type ReactNode } from "react";
import SaarthiSidebar from "@/components/SaarthiSidebar";
import { useSaarthi } from "@/components/SaarthiProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useSaarthi();

  return (
    <div className="flex min-h-screen bg-[#0a0e17]">
      <SaarthiSidebar
        userName={user?.name}
        lifeStage={user?.lifeStage}
        overallLifeScore={user?.overallLifeScore}
        unreadAlerts={0}
      />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
