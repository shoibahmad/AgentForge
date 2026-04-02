"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Terminal, ArrowLeft, ArrowRight, Layers, Download, Shield, GitBranch,
  Zap, Code2, FileText, Heart, Wrench, CheckCircle, Share2, Package,
  RefreshCw, Eye, Lock, Cpu, Palette, ChevronRight, Star,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)", fontSize: "0.68rem", color,
      background: color + "18", border: `1px solid ${color}44`,
      padding: "0.2rem 0.55rem", borderRadius: "20px",
    }}>
      {children}
    </span>
  );
}

function FeatureCard({
  icon: Icon, color, title, desc, tags, detail, i,
}: {
  icon: React.ElementType; color: string; title: string;
  desc: string; tags?: string[]; detail?: string[]; i: number;
}) {
  return (
    <motion.div
      custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      whileHover={{ y: -3, borderColor: color + "55" }}
      style={{
        padding: "1.75rem", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)",
        display: "flex", flexDirection: "column", gap: "1rem",
        transition: "border-color 0.2s, transform 0.2s", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: "10px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={22} color={color} />
        </div>
        {tags && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {tags.map(t => <Tag key={t} color={color}>{t}</Tag>)}
          </div>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
      </div>
      {detail && (
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {detail.map(d => (
            <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <ChevronRight size={12} color={color} style={{ marginTop: "3px", flexShrink: 0 }} />
              {d}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

const coreFeatures = [
  {
    icon: Layers,
    color: "var(--accent-green)",
    title: "5-Step Guided Builder",
    desc: "A structured wizard that walks you through every aspect of your agent — from identity to capabilities. No blank-page paralysis.",
    tags: ["UX", "Workflow"],
    detail: [
      "Manifest → Soul → Rules → Skills → Generate",
      "Step progress indicator with visual checkmarks",
      "Click any step tab to jump directly",
      "Animated slide transitions between steps",
    ],
  },
  {
    icon: Eye,
    color: "var(--accent-amber)",
    title: "Live File Preview",
    desc: "Every change you make is instantly reflected in the generated output. See your YAML and Markdown update in real-time as you type.",
    tags: ["Real-time", "Preview"],
    detail: [
      "Syntax-highlighted YAML and Markdown",
      "VS Code-style file explorer sidebar",
      "Line numbers on every file",
      "Tab bar for switching between files",
    ],
  },
  {
    icon: Download,
    color: "var(--accent-green)",
    title: "One-Click ZIP Download",
    desc: "Bundle your entire agent repository into a ZIP file with a single click. No backend, no upload — runs entirely in your browser via JSZip.",
    tags: ["Client-side", "Export"],
    detail: [
      "Complete directory structure preserved",
      "All files included: agent.yaml, SOUL.md, RULES.md, skills/",
      "Ready to extract and run immediately",
      "No file size limits",
    ],
  },
  {
    icon: Lock,
    color: "#00d4ff",
    title: "100% Local-First",
    desc: "Your agent configuration never leaves your browser. No accounts, no servers, no tracking. Full privacy by design.",
    tags: ["Privacy", "Security"],
    detail: [
      "Zero network requests for your data",
      "No account or login required",
      "No analytics on your agent content",
      "Works fully offline after initial load",
    ],
  },
  {
    icon: RefreshCw,
    color: "var(--accent-amber)",
    title: "Auto-Save with localStorage",
    desc: "Every keystroke is automatically persisted to your browser's localStorage. Reload the page, close the tab — your work is always there.",
    tags: ["Persistence", "Auto-save"],
    detail: [
      "Saves on every state change",
      "Survives page refreshes and browser restarts",
      "Restores exact step position",
      "No manual save button needed",
    ],
  },
  {
    icon: Share2,
    color: "var(--accent-green)",
    title: "URL Sharing",
    desc: "Share your entire agent configuration as a URL. Anyone with the link can open your exact setup — great for templates and collaboration.",
    tags: ["Sharing", "Collaboration"],
    detail: [
      "Full state encoded as Base64 URL param",
      "One-click copy to clipboard",
      "Recipient gets an independent copy",
      "Works across devices and browsers",
    ],
  },
];

const builderFeatures = [
  {
    icon: FileText,
    color: "var(--accent-amber)",
    title: "Manifest Editor",
    desc: "Configure your agent's core identity: name slug, semver version, description, Claude model selection, and categorization tags.",
    tags: ["Step 1"],
    detail: [
      "Auto-formats name to lowercase-hyphen slug",
      "Model picker: Sonnet, Opus, Haiku",
      "Multi-select tag system (10 predefined tags)",
      "Inline format hints and validation",
    ],
  },
  {
    icon: Heart,
    color: "var(--accent-green)",
    title: "Soul Designer",
    desc: "Define your agent's personality, communication style, and core values. Includes a randomizer with three built-in personas to spark ideas.",
    tags: ["Step 2"],
    detail: [
      "Core identity, communication style, values fields",
      "Randomize Soul button (Aria, Forge, Sage personas)",
      "Values auto-formatted as bullet points in SOUL.md",
      "Character count guidance",
    ],
  },
  {
    icon: Shield,
    color: "#ff4444",
    title: "Rules Engine",
    desc: "Set hard behavioral constraints with Must Always and Must Never sections. Visual indicators distinguish positive rules from hard guardrails.",
    tags: ["Step 3"],
    detail: [
      "Separate Must Always / Must Never textareas",
      "Green dot for always, red dot for never",
      "Live line counters per section",
      "One rule per line — auto-formatted as bullets",
    ],
  },
  {
    icon: Wrench,
    color: "#00d4ff",
    title: "Skills Manager",
    desc: "Build modular capability bundles with per-skill tool permissions. Add, remove, and configure as many skills as your agent needs.",
    tags: ["Step 4"],
    detail: [
      "Dynamic add/remove skill cards",
      "Per-skill tool toggles: Read, Write, Bash, WebSearch",
      "Collapsible skill cards to reduce clutter",
      "Slug auto-formatting for skill names",
    ],
  },
  {
    icon: Package,
    color: "var(--accent-green)",
    title: "Generate & Export",
    desc: "Review all generated files, run validation, copy individual files, share via URL, or download the complete ZIP — all from one screen.",
    tags: ["Step 5"],
    detail: [
      "File tree explorer with expand/collapse",
      "Per-file copy button",
      "Share link generator",
      "Download ZIP + Validate Agent buttons",
    ],
  },
  {
    icon: CheckCircle,
    color: "var(--accent-amber)",
    title: "Validation Panel",
    desc: "20+ automated checks across all generated files. Filter by severity, click any failing check to jump directly to the step that needs fixing.",
    tags: ["Step 5", "Quality"],
    detail: [
      "Pass / Warn / Fail severity levels",
      "Score percentage with progress bar",
      "Filter tabs: All / Fail / Warn / Pass",
      "Click-to-jump on any fail or warn row",
    ],
  },
];

const techFeatures = [
  {
    icon: Cpu,
    color: "var(--accent-green)",
    title: "gitagent Spec Compliant",
    desc: "All output files strictly follow the gitagent v0.1.0 specification — ready to run with gitclaw without any manual editing.",
    tags: ["Spec", "Compatible"],
    detail: [
      "agent.yaml with correct schema",
      "SOUL.md with required sections",
      "RULES.md with must-always/never structure",
      "SKILL.md with valid frontmatter",
    ],
  },
  {
    icon: GitBranch,
    color: "var(--accent-amber)",
    title: "gitclaw & clawless Ready",
    desc: "Downloaded agents work immediately with the gitclaw runtime and clawless serverless deployment — no post-processing required.",
    tags: ["Runtime", "Deploy"],
    detail: [
      "`gitclaw validate` passes out of the box",
      "`gitclaw run` starts the agent locally",
      "`clawless deploy` pushes to serverless cloud",
      "Deploy commands shown in the builder UI",
    ],
  },
  {
    icon: Code2,
    color: "#00d4ff",
    title: "Syntax Highlighting",
    desc: "Generated files are displayed with full syntax highlighting powered by highlight.js — YAML and Markdown both supported.",
    tags: ["DX", "Readability"],
    detail: [
      "highlight.js with YAML and Markdown grammars",
      "Line numbers on every row",
      "Dark theme consistent with the app",
      "Monospace font for code clarity",
    ],
  },
  {
    icon: Zap,
    color: "var(--accent-green)",
    title: "Framer Motion Animations",
    desc: "Smooth step transitions, scroll-triggered reveals, and hover effects throughout — built with Framer Motion for a polished feel.",
    tags: ["Animation", "UX"],
    detail: [
      "Directional slide transitions between steps",
      "Staggered entrance animations on lists",
      "Scroll-triggered fade-ups on sections",
      "Hover lift effects on cards",
    ],
  },
  {
    icon: Palette,
    color: "var(--accent-amber)",
    title: "Terminal Design System",
    desc: "A cohesive dark terminal aesthetic with CSS custom properties — green, amber, and cyan accents on a near-black background.",
    tags: ["Design", "Theming"],
    detail: [
      "CSS variables for all colors and spacing",
      "JetBrains Mono for code, Inter for prose",
      "Consistent border radius and shadow tokens",
      "Responsive grid layouts throughout",
    ],
  },
  {
    icon: Star,
    color: "#00d4ff",
    title: "Next.js App Router",
    desc: "Built on Next.js 14 with the App Router — fast page loads, file-based routing, and React Server Components where applicable.",
    tags: ["Framework", "Performance"],
    detail: [
      "Routes: / (landing), /build, /docs, /features",
      "Suspense boundaries for async URL params",
      "Client components only where interactivity is needed",
      "Zero-config deployment to Vercel",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
            <ArrowLeft size={14} />
            Home
          </Link>
          <span style={{ color: "var(--border)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Terminal size={18} color="var(--accent-green)" />
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem" }}>
              Agent<span style={{ color: "var(--accent-green)" }}>Forge</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> / features</span>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/docs" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none" }}>Docs</Link>
          <Link href="/build">
            <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
              Open Builder
            </button>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Hero */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible"
          style={{ padding: "5rem 0 3.5rem", textAlign: "center" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)",
            borderRadius: "20px", padding: "0.3rem 0.875rem",
            fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)",
            marginBottom: "1.5rem",
          }}>
            <Zap size={12} />
            Everything AgentForge can do
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.1 }}>
            Built for developers<br />
            <span className="gradient-text">who move fast</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 2.5rem" }}>
            AgentForge packs a full agent development workflow into a single browser tab. Here's everything under the hood.
          </p>
          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            {[
              { value: "5", label: "builder steps" },
              { value: "4", label: "output files" },
              { value: "20+", label: "validation checks" },
              { value: "0", label: "backend required" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", fontWeight: 800, color: "var(--accent-green)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.3rem", fontFamily: "var(--font-mono)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Core Features */}
        <section style={{ marginBottom: "5rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{ width: 3, height: "1.4rem", background: "var(--accent-green)", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Core Features</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", paddingLeft: "1rem" }}>The fundamentals that make AgentForge worth using.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {coreFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
          </div>
        </section>

        {/* Builder Features */}
        <section style={{ marginBottom: "5rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{ width: 3, height: "1.4rem", background: "var(--accent-amber)", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Builder Steps</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", paddingLeft: "1rem" }}>What each of the 5 steps gives you.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {builderFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
          </div>
        </section>

        {/* Tech Features */}
        <section style={{ marginBottom: "5rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{ width: 3, height: "1.4rem", background: "#00d4ff", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Under the Hood</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", paddingLeft: "1rem" }}>The tech stack and design decisions powering the experience.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {techFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ marginBottom: "5rem" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{ width: 3, height: "1.4rem", background: "var(--accent-green)", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>AgentForge vs. Hand-Writing YAML</h2>
            </div>
          </motion.div>
          <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
              {["", "AgentForge", "Hand-writing"].map((h, i) => (
                <div key={i} style={{ padding: "0.875rem 1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: i === 1 ? "var(--accent-green)" : i === 2 ? "var(--text-muted)" : "transparent" }}>{h}</div>
              ))}
            </div>
            {[
              ["Spec-compliant output", true, false],
              ["Real-time file preview", true, false],
              ["20+ validation checks", true, false],
              ["One-click ZIP download", true, false],
              ["Shareable URL config", true, false],
              ["Auto-save across sessions", true, false],
              ["No YAML knowledge needed", true, false],
              ["Full control over output", true, true],
              ["Works offline", true, true],
            ].map(([label, forge, hand], i) => (
              <div key={String(label)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < 8 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-secondary)" }}>
                <div style={{ padding: "0.875rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{String(label)}</div>
                <div style={{ padding: "0.875rem 1.25rem" }}>
                  {forge ? <CheckCircle size={16} color="var(--accent-green)" /> : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                </div>
                <div style={{ padding: "0.875rem 1.25rem" }}>
                  {hand ? <CheckCircle size={16} color="var(--text-muted)" /> : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ padding: "3rem", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)", borderRadius: "var(--radius-lg)", textAlign: "center", marginBottom: "4rem" }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>See it in action</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Takes ~5 minutes. No account. No backend. Just build.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/build">
              <button className="btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                Open the Builder
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/docs">
              <button className="btn-secondary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                Read the Docs
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
