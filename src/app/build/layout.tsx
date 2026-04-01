"use client";

import { AgentProvider } from "@/lib/AgentContext";

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <AgentProvider>{children}</AgentProvider>;
}
