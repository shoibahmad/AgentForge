import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentForge – Build AI Agents Like Code",
  description:
    "A multi-step UI builder for the gitagent format. Define your AI agent's soul, rules, and skills, then download a ready-to-deploy repository.",
  keywords: ["gitagent", "AI agent builder", "gitclaw", "clawless", "agent configuration"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
