"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Terminal, ArrowLeft, GitBranch, Zap, Shield, Wrench, Star } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

const changelog = [
  {
    version: "0.3.0",
    date: "April 2026",
    label: "latest",
    labelColor: "var(--accent-green)",
    icon: Star,
    color: "var(--accent-green)",
    changes: [
      { type: "feat", text: "Agent Templates — 4 pre-built starter configs (Coding Assistant, Research Agent, Customer Support, DevOps)" },
      { type: "feat", text: "Import from YAML — paste or upload an existing agent.yaml to reverse-engineer it into the builder" },
      { type: "feat", text: "Duplicate Skill — clone any skill card as a starting point" },
      { type: "feat", text: "Undo/Redo — full history with Ctrl+Z / Ctrl+Y (up to 50 steps)" },
      { type: "feat", text: "Validation badges on step tabs — colored dots show pass/warn/fail per step without going to Step 5" },
      { type: "feat", text: "Recent Agents panel — last 10 agents stored in localStorage, one-click restore" },
      { type: "feat", text: "Interactive Tour — first-visit walkthrough with 7 steps" },
      { type: "feat", text: "Keyboard shortcuts — Ctrl+Enter (next step), Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+D (download)" },
      { type: "feat", text: "CLI preview pre-filled with agent name in deploy commands" },
      { type: "feat", text: "Health score counter on landing page — tracks how many agents you've built locally" },
      { type: "feat", text: "Changelog page (/changelog)" },
      { type: "feat", text: "Docs page (/docs) with full reference documentation" },
      { type: "feat", text: "Features page (/features) with detailed feature breakdown and comparison table" },
    ],
  },
  {
    version: "0.2.0",
    date: "March 2026",
    label: "stable",
    labelColor: "var(--accent-amber)",
    icon: Wrench,
    color: "var(--accent-amber)",
    changes: [
      { type: "feat", text: "5-step guided builder — Manifest, Soul, Rules, Skills, Generate" },
      { type: "feat", text: "Live file preview with syntax highlighting (highlight.js)" },
      { type: "feat", text: "One-click ZIP download via JSZip (fully client-side)" },
      { type: "feat", text: "ValidationPanel with 20+ checks, severity levels, and click-to-jump" },
      { type: "feat", text: "URL sharing — encode full agent state as Base64 URL param" },
      { type: "feat", text: "localStorage auto-save on every state change" },
      { type: "feat", text: "Randomize Soul button with 3 built-in personas (Aria, Forge, Sage)" },
      { type: "feat", text: "VS Code-style file explorer with collapsible tree" },
      { type: "feat", text: "Framer Motion step transitions and scroll animations" },
      { type: "fix", text: "Step navigation now preserves scroll position" },
      { type: "fix", text: "Skill slug auto-formatting on name input" },
    ],
  },
  {
    version: "0.1.0",
    date: "February 2026",
    label: "initial",
    labelColor: "#00d4ff",
    icon: GitBranch,
    color: "#00d4ff",
    changes: [
      { type: "feat", text: "Initial release of AgentForge" },
      { type: "feat", text: "gitagent spec v0.1.0 support" },
      { type: "feat", text: "Basic agent.yaml, SOUL.md, RULES.md generation" },
      { type: "feat", text: "Skills system with SKILL.md output" },
      { type: "feat", text: "Dark terminal design system with CSS custom properties" },
      { type: "feat", text: "Next.js App Router with /build route" },
    ],
  },
];

const typeColors: Record<string, string> = {
  feat: "var(--accent-green)",
  fix: "var(--accent-amber)",
  break: "#ff4444",
  perf: "#00d4ff",
};

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
            <ArrowLeft size={14} />Home
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Terminal size={18} color="var(--accent-green)" />
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem" }}>
              Agent<span style={{ color: "var(--accent-green)" }}>Forge</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> / changelog</span>
            </span>
          </div>
        </div>
        <Link href="/build">
          <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Open Builder</button>
        </Link>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "4rem 2rem" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)", borderRadius: "20px", padding: "0.3rem 0.875rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)", marginBottom: "1rem" }}>
            <GitBranch size={12} />
            Release history
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Changelog</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Every release, every change. Most recent first.</p>
        </motion.div>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: "1.1rem", top: 0, bottom: 0, width: 1, background: "var(--border)" }} />

          {changelog.map((release, ri) => {
            const Icon = release.icon;
            return (
              <motion.div key={release.version} custom={ri} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ display: "flex", gap: "1.75rem", marginBottom: "3rem", position: "relative" }}>
                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: release.color + "18", border: `1px solid ${release.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, background: "var(--bg-primary)" as string }}>
                  <Icon size={16} color={release.color} />
                </div>

                <div style={{ flex: 1, paddingTop: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem", color: release.color }}>v{release.version}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: release.labelColor, background: release.labelColor + "18", border: `1px solid ${release.labelColor}44`, padding: "0.15rem 0.5rem", borderRadius: "20px" }}>{release.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>{release.date}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.75rem" }}>
                    {release.changes.map((c, ci) => (
                      <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: typeColors[c.type] || "var(--text-muted)", background: (typeColors[c.type] || "var(--text-muted)") + "18", border: `1px solid ${(typeColors[c.type] || "var(--text-muted)")}33`, padding: "0.1rem 0.4rem", borderRadius: "4px", flexShrink: 0, marginTop: "2px" }}>
                          {c.type}
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
