"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Terminal, ArrowLeft, FileText, Heart, Shield, Wrench,
  Download, GitBranch, Layers, BookOpen, Code2, Zap,
  ChevronRight, Package, Settings, AlertTriangle, CheckCircle,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "4rem", scrollMarginTop: "80px" }}>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 32, height: 32, borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} color={color} />
      </div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>{children}</h2>
    </div>
  );
}

function CodeBlock({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <pre style={{
      background: "var(--bg-secondary)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)", padding: "1rem 1.25rem",
      fontFamily: "var(--font-mono)", fontSize: "0.82rem",
      color: "var(--text-secondary)", overflowX: "auto",
      lineHeight: 1.7, margin: "0.75rem 0",
    }}>
      <code data-lang={lang}>{children}</code>
    </pre>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <code style={{
      fontFamily: "var(--font-mono)", fontSize: "0.7rem", color,
      background: color + "18", border: `1px solid ${color}44`,
      padding: "0.15rem 0.5rem", borderRadius: "4px", whiteSpace: "nowrap",
    }}>
      {children}
    </code>
  );
}

function InfoBox({ type, children }: { type: "tip" | "warning" | "info"; children: React.ReactNode }) {
  const styles = {
    tip: { color: "var(--accent-green)", bg: "var(--accent-green-dim)", border: "var(--accent-green-border)", icon: CheckCircle },
    warning: { color: "#ffb800", bg: "rgba(255,184,0,0.08)", border: "rgba(255,184,0,0.25)", icon: AlertTriangle },
    info: { color: "#00d4ff", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.25)", icon: BookOpen },
  }[type];
  const Icon = styles.icon;
  return (
    <div style={{
      display: "flex", gap: "0.75rem", padding: "0.875rem 1rem",
      background: styles.bg, border: `1px solid ${styles.border}`,
      borderRadius: "var(--radius-md)", margin: "1rem 0",
    }}>
      <Icon size={16} color={styles.color} style={{ flexShrink: 0, marginTop: "2px" }} />
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

const navItems = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "step-manifest", label: "Step 1 — Manifest", icon: FileText },
  { id: "step-soul", label: "Step 2 — Soul", icon: Heart },
  { id: "step-rules", label: "Step 3 — Rules", icon: Shield },
  { id: "step-skills", label: "Step 4 — Skills", icon: Wrench },
  { id: "step-generate", label: "Step 5 — Generate", icon: Download },
  { id: "file-format", label: "File Format Reference", icon: Code2 },
  { id: "ecosystem", label: "Ecosystem", icon: GitBranch },
  { id: "validation", label: "Validation", icon: CheckCircle },
  { id: "sharing", label: "Sharing & Persistence", icon: Package },
  { id: "faq", label: "FAQ", icon: Settings },
];

export default function DocsPage() {
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
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> / docs</span>
            </span>
          </div>
        </div>
        <Link href="/build">
          <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
            Open Builder
          </button>
        </Link>
      </header>

      <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Sidebar */}
        <aside style={{
          width: "220px", flexShrink: 0, position: "sticky", top: "60px",
          height: "calc(100vh - 60px)", overflowY: "auto",
          padding: "2rem 1rem 2rem 0", borderRight: "1px solid var(--border)",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            Contents
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.id} href={`#${item.id}`} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.4rem 0.6rem", borderRadius: "6px",
                  color: "var(--text-secondary)", textDecoration: "none",
                  fontSize: "0.8rem", fontFamily: "var(--font-mono)",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                >
                  <Icon size={13} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "3rem 0 3rem 3rem", minWidth: 0 }}>
          {/* Page title */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: "3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)", borderRadius: "20px", padding: "0.3rem 0.875rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)", marginBottom: "1rem" }}>
              <BookOpen size={12} />
              Documentation
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              AgentForge Docs
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Everything you need to build, validate, and deploy AI agents using the gitagent format.
            </p>
          </motion.div>

          {/* OVERVIEW */}
          <Section id="overview">
            <SectionTitle icon={BookOpen} color="var(--accent-green)">Overview</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              AgentForge is a fully client-side visual builder for the <Badge color="var(--accent-green)">gitagent</Badge> specification. It lets you define an AI agent's identity, behavior, and capabilities through a guided 5-step UI — no YAML hand-editing required.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The output is a complete, spec-compliant agent repository that can be run immediately with <Badge color="#ffb800">gitclaw</Badge> or deployed serverlessly via <Badge color="#00d4ff">clawless</Badge>.
            </p>
            <InfoBox type="info">
              AgentForge runs entirely in your browser. No data is sent to any server. Your agent configuration is persisted in localStorage and can be shared via URL.
            </InfoBox>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
              {[
                { label: "5 builder steps", color: "var(--accent-green)" },
                { label: "4 output files", color: "var(--accent-amber)" },
                { label: "20+ validation checks", color: "#00d4ff" },
                { label: "100% local-first", color: "var(--accent-green)" },
              ].map(item => (
                <div key={item.label} style={{ padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ChevronRight size={14} color={item.color} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* GETTING STARTED */}
          <Section id="getting-started">
            <SectionTitle icon={Zap} color="var(--accent-amber)">Getting Started</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              Building an agent takes about 5 minutes. Here's the full workflow:
            </p>
            {[
              { step: "01", title: "Open the Builder", desc: 'Click "Start Building" or "Open the Builder" from the landing page. You\'ll land on Step 1 — Manifest.' },
              { step: "02", title: "Fill in each step", desc: "Work through the 5 steps: Manifest → Soul → Rules → Skills → Generate. Each step maps to a specific output file." },
              { step: "03", title: "Validate your agent", desc: "On Step 5, click \"Validate Agent\" to run 20+ checks. Fix any FAIL items before downloading." },
              { step: "04", title: "Download the ZIP", desc: "Click \"Download ZIP\" to get your complete agent repository. Extract it anywhere." },
              { step: "05", title: "Run with gitclaw", desc: "Install gitclaw (`npm install gitclaw`) and use the SDK to bring your agent to life. See the gitclaw README for full API docs." },
            ].map((item, i) => (
              <motion.div key={item.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ display: "flex", gap: "1.25rem", marginBottom: "1.25rem", padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)", borderRadius: "6px", padding: "0.25rem 0.5rem", height: "fit-content", flexShrink: 0 }}>
                  {item.step}
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{item.title}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
            <CodeBlock>{`# After downloading and extracting your agent ZIP:
cd my-agent

# Validate the spec (uses npx — no global install needed)
npx gitagent validate
npx gitagent info

# Install gitclaw and run the agent locally
npm install gitclaw
# (use the gitclaw SDK in your project — see gitclaw README)

# Optionally deploy serverlessly with clawless
npm install clawless`}</CodeBlock>
          </Section>

          {/* STEP 1 - MANIFEST */}
          <Section id="step-manifest">
            <SectionTitle icon={FileText} color="var(--accent-amber)">Step 1 — Manifest</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The manifest defines your agent's core identity and configuration. It outputs <Badge color="var(--accent-amber)">agent.yaml</Badge> — the entry point that gitclaw reads first.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              {[
                { field: "name", type: "slug", required: true, desc: "Unique identifier. Lowercase letters, numbers, and hyphens only. Example: my-coding-assistant" },
                { field: "version", type: "semver", required: true, desc: "Semantic version of your agent. Defaults to 0.1.0. Increment when you make breaking changes." },
                { field: "description", type: "string", required: false, desc: "One-line summary of what your agent does. Shown in gitclaw listings." },
                { field: "model", type: "enum", required: true, desc: "The Claude model to use. Options: claude-sonnet-4-5, claude-opus-4-5, claude-haiku-4-5." },
                { field: "tags", type: "string[]", required: false, desc: "Categorization tags. Used for discovery and filtering in agent registries." },
              ].map(f => (
                <div key={f.field} style={{ padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <Badge color="var(--accent-amber)">{f.field}</Badge>
                    <Badge color={f.required ? "var(--accent-green)" : "var(--text-muted)"}>{f.required ? "required" : "optional"}</Badge>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <CodeBlock lang="yaml">{`# agent.yaml output example
spec_version: "0.1.0"
name: my-coding-assistant
version: "0.1.0"
description: "A focused coding assistant for TypeScript projects"
model:
  preferred: claude-sonnet-4-5-20250929
skills:
  - code-review
tags:
  - coding
  - productivity`}</CodeBlock>
          </Section>

          {/* STEP 2 - SOUL */}
          <Section id="step-soul">
            <SectionTitle icon={Heart} color="var(--accent-green)">Step 2 — Soul</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The soul defines your agent's personality, voice, and values. It outputs <Badge color="var(--accent-green)">SOUL.md</Badge> — injected into the system prompt at runtime to shape how the agent communicates.
            </p>
            <InfoBox type="tip">
              Use the "Randomize Soul" button to fill in a pre-built persona (Aria, Forge, or Sage) as a starting point, then customize it to fit your use case.
            </InfoBox>
            {[
              { field: "Core Identity", desc: "A first-person statement describing who the agent is. This is the foundation of the agent's self-concept. Be specific — vague identities produce generic agents." },
              { field: "Communication Style", desc: "How the agent speaks: tone, format preferences, verbosity, use of analogies, etc. This directly shapes every response the agent generates." },
              { field: "Values", desc: "One value per line. These become bullet points in SOUL.md and guide the agent's decision-making when facing ambiguous situations." },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: "1rem", padding: "1rem 1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.35rem", fontSize: "0.9rem" }}>{f.field}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
            <CodeBlock lang="markdown">{`# Soul

## Core Identity
I am Forge, a no-nonsense engineering AI built for speed and precision.

## Communication Style
Concise, technical, direct. Bullet points over paragraphs.

## Values
- Ship fast, fix faster
- Simplicity is the ultimate sophistication
- Tests are non-negotiable`}</CodeBlock>
          </Section>

          {/* STEP 3 - RULES */}
          <Section id="step-rules">
            <SectionTitle icon={Shield} color="#ff4444">Step 3 — Rules</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Rules define hard behavioral constraints. They output <Badge color="#ff4444">RULES.md</Badge> — enforced at runtime to prevent unwanted behavior and ensure consistent responses.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ padding: "1rem 1.25rem", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)" }} />
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Must Always</p>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Positive constraints — behaviors the agent must exhibit in every interaction. One rule per line.</p>
              </div>
              <div style={{ padding: "1rem 1.25rem", background: "rgba(255,68,68,0.05)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4444" }} />
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Must Never</p>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Hard guardrails — behaviors the agent must never perform. These are enforced as absolute restrictions.</p>
              </div>
            </div>
            <InfoBox type="warning">
              Keep rules specific and actionable. Vague rules like "be helpful" are ignored in practice. Prefer "always include a code example when explaining a programming concept."
            </InfoBox>
            <CodeBlock lang="markdown">{`# Rules

## Must Always
- Include a code example when explaining a programming concept
- Cite sources when referencing external documentation
- Ask for clarification before making destructive file changes

## Must Never
- Execute shell commands without explicit user confirmation
- Share or log any credentials or API keys
- Provide medical, legal, or financial advice`}</CodeBlock>
          </Section>

          {/* STEP 4 - SKILLS */}
          <Section id="step-skills">
            <SectionTitle icon={Wrench} color="#00d4ff">Step 4 — Skills</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Skills are modular capability bundles. Each skill outputs a <Badge color="#00d4ff">skills/[name]/SKILL.md</Badge> file with its own instructions and tool permissions. An agent can have zero or many skills.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { tool: "Read", color: "#00d4ff", desc: "Read files from the filesystem" },
                { tool: "Write", color: "var(--accent-amber)", desc: "Create and modify files" },
                { tool: "Bash", color: "#ff4444", desc: "Execute shell commands" },
                { tool: "WebSearch", color: "var(--accent-green)", desc: "Search the web for information" },
              ].map(t => (
                <div key={t.tool} style={{ padding: "0.875rem", background: "var(--bg-secondary)", border: `1px solid ${t.color}33`, borderRadius: "var(--radius-md)" }}>
                  <Badge color={t.color}>{t.tool}</Badge>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.4rem", lineHeight: 1.5 }}>{t.desc}</p>
                </div>
              ))}
            </div>
            <InfoBox type="warning">
              Only grant the tools a skill actually needs. Giving every skill all four tools increases the attack surface and can lead to unintended behavior.
            </InfoBox>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Each skill has four fields:
            </p>
            {[
              { field: "name", desc: "Slug identifier for the skill directory. Example: code-review, web-research." },
              { field: "description", desc: "One-line summary of what the skill does. Used in agent listings and the SKILL.md frontmatter." },
              { field: "allowed-tools", desc: "Which tools this skill can invoke. Principle of least privilege applies." },
              { field: "instructions", desc: "Detailed instructions for how the agent should behave when this skill is active. Supports full Markdown." },
            ].map(f => (
              <div key={f.field} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", padding: "0.875rem 1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <Badge color="#00d4ff">{f.field}</Badge>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
            <CodeBlock lang="markdown">{`---
name: code-review
description: "Reviews code for bugs, style, and security issues"
allowed-tools: Read
---

# Code Review

When reviewing code:
1. Check for logic errors and edge cases
2. Flag security vulnerabilities (injection, auth issues, etc.)
3. Suggest idiomatic improvements for the language
4. Always explain *why* a change is recommended`}</CodeBlock>
          </Section>

          {/* STEP 5 - GENERATE */}
          <Section id="step-generate">
            <SectionTitle icon={Download} color="var(--accent-green)">Step 5 — Generate</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The final step shows a live preview of all generated files and lets you download, share, or validate your agent.
            </p>
            {[
              { action: "File Explorer", desc: "A VS Code-style sidebar shows your agent's file tree. Click any file to view its syntax-highlighted content." },
              { action: "Copy File", desc: "Copy the content of any individual file to your clipboard with one click." },
              { action: "Share", desc: "Encodes your entire agent configuration into a URL query parameter. Anyone with the link can restore your exact configuration." },
              { action: "Download ZIP", desc: "Bundles all generated files into a ZIP archive. Runs entirely client-side via JSZip — no upload required." },
              { action: "Validate Agent", desc: "Runs 20+ checks across all files. Click any FAIL or WARN row to jump directly to the relevant step and fix it." },
            ].map((item, i) => (
              <div key={item.action} style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", padding: "0.875rem 1rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <Badge color="var(--accent-green)">{item.action}</Badge>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </Section>

          {/* FILE FORMAT REFERENCE */}
          <Section id="file-format">
            <SectionTitle icon={Code2} color="var(--accent-amber)">File Format Reference</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              A complete gitagent repository has the following structure:
            </p>
            <CodeBlock>{`my-agent/
├── agent.yaml          # Manifest — name, version, model, skills, tags
├── SOUL.md             # Personality, communication style, values
├── RULES.md            # Must-always and must-never constraints
├── skills/
│   ├── code-review/
│   │   └── SKILL.md    # Skill instructions + tool permissions
│   └── web-research/
│       └── SKILL.md
└── tools/              # Optional: tool definitions (YAML schemas)`}</CodeBlock>

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, margin: "1.5rem 0 0.75rem" }}>Full <Badge color="var(--accent-amber)">agent.yaml</Badge> schema:</p>
            <CodeBlock lang="yaml">{`spec_version: "0.1.0"
name: string          # required — lowercase-hyphen slug
version: "0.1.0"      # required — semver, quoted string
description: string   # optional — one-line summary
model:                # required
  preferred: string   # claude model id
skills:               # optional — list of skill directory names
  - my-skill
tags:                 # optional — categorization tags
  - hackathon`}</CodeBlock>

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, margin: "1.5rem 0 0.75rem" }}>Full <Badge color="#00d4ff">SKILL.md</Badge> frontmatter schema:</p>
            <CodeBlock lang="yaml">{`---
name: string              # required — slug identifier
description: string       # required — one-line summary
allowed-tools: string[]   # required — Read | Write | Bash | WebSearch
---`}</CodeBlock>
          </Section>

          {/* ECOSYSTEM */}
          <Section id="ecosystem">
            <SectionTitle icon={GitBranch} color="#00d4ff">Ecosystem</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              AgentForge is part of a three-tool ecosystem for building and deploying AI agents.
            </p>
            {[
              {
                name: "gitagent", color: "#00ff88",
                desc: "The open specification format for AI agents. Defines how agent.yaml, SOUL.md, RULES.md, and skill files are structured. Version-controlled, human-readable, and tool-agnostic.",
                commands: ["# Validate your agent repo (no global install needed)\nnpx gitagent validate\nnpx gitagent info"],
              },
              {
                name: "gitclaw", color: "#ffb800",
                desc: "The SDK runtime that turns your gitagent repo into a running agent. Reads agent.yaml, loads SOUL.md and RULES.md into the system prompt, and activates skills from the skills/ directory.",
                commands: [
                  "npm install gitclaw",
                  "# gitclaw reads your repo and creates a fully functional AI agent",
                  "# See the gitclaw README for full SDK docs, examples, and API reference",
                ],
              },
              {
                name: "clawless", color: "#00d4ff",
                desc: "Serverless runtime powered by WebContainers. Runs your agent in the browser with zero infrastructure. Important: WebContainer environment only — Node.js/npm skills work, but no Python, no system binaries, no Docker.",
                commands: [
                  "npm install clawless",
                  "# Skills must be Node-compatible (node / npx commands work)",
                  "# If your skill needs python or apt-get, use gitclaw instead",
                ],
              },
            ].map((tool, i) => (
              <motion.div key={tool.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "var(--bg-secondary)", border: `1px solid ${tool.color}33`, borderRadius: "var(--radius-lg)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }} />
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "1.05rem", fontWeight: 700, color: tool.color }}>{tool.name}</code>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, margin: "0.75rem 0" }}>{tool.desc}</p>
                <CodeBlock>{tool.commands.join("\n")}</CodeBlock>
              </motion.div>
            ))}
          </Section>

          {/* VALIDATION */}
          <Section id="validation">
            <SectionTitle icon={CheckCircle} color="var(--accent-green)">Validation</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              AgentForge runs 20+ validation checks across all generated files. Each check has a severity level:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                { level: "PASS", color: "var(--accent-green)", desc: "Check passed. No action needed." },
                { level: "WARN", color: "var(--accent-amber)", desc: "Non-blocking issue. Agent will run but may behave unexpectedly." },
                { level: "FAIL", color: "#ff4444", desc: "Blocking issue. Fix before downloading." },
              ].map(s => (
                <div key={s.level} style={{ padding: "1rem", background: "var(--bg-secondary)", border: `1px solid ${s.color}33`, borderRadius: "var(--radius-md)" }}>
                  <Badge color={s.color}>{s.level}</Badge>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>Checks are grouped by file:</p>
            {[
              { file: "agent.yaml", checks: ["Name is defined and is a valid slug", "Version follows semver format", "Description is present", "Model is a recognized Claude model ID"] },
              { file: "SOUL.md", checks: ["Core identity is defined (min 20 chars)", "Communication style is defined", "At least one value is listed"] },
              { file: "RULES.md", checks: ["At least one must-always rule", "At least one must-never rule", "Rules are specific (min length check)"] },
              { file: "skills/*/SKILL.md", checks: ["Skill name is a valid slug", "Description is present", "At least one tool is granted", "Instructions are non-empty"] },
            ].map(group => (
              <div key={group.file} style={{ marginBottom: "1rem", padding: "1rem 1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <Badge color="var(--accent-amber)">{group.file}</Badge>
                <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
                  {group.checks.map(c => <li key={c} style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>{c}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          {/* SHARING & PERSISTENCE */}
          <Section id="sharing">
            <SectionTitle icon={Package} color="var(--accent-amber)">Sharing & Persistence</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
              AgentForge has two mechanisms for preserving your work:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>localStorage Auto-Save</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Every change is automatically saved to your browser's localStorage under the key <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-green)" }}>agentforge_state</code>. Your work persists across page refreshes and browser restarts.
                </p>
              </div>
              <div style={{ padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>URL Sharing</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  The "Share" button on Step 5 encodes your entire agent state as a Base64 URL parameter (<code style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-amber)" }}>?config=...</code>). Anyone with the link can open your exact configuration.
                </p>
              </div>
            </div>
            <InfoBox type="info">
              URL sharing is read-only — the recipient gets a copy of your configuration, not a live-synced session. Changes they make won't affect your local state.
            </InfoBox>
          </Section>

          {/* FAQ */}
          <Section id="faq">
            <SectionTitle icon={Settings} color="var(--text-secondary)">FAQ</SectionTitle>
            {[
              {
                q: "Does AgentForge send my data anywhere?",
                a: "No. AgentForge is 100% client-side. All processing happens in your browser. No data is sent to any server. The only storage used is your browser's localStorage.",
              },
              {
                q: "Can I edit the generated files manually?",
                a: "Yes. The generated files are plain text (YAML and Markdown). You can edit them in any text editor after downloading. Just make sure they remain spec-compliant — run `npx gitagent validate` to check.",
              },
              {
                q: "What Claude models are supported?",
                a: "AgentForge currently supports claude-sonnet-4-5-20250929, claude-opus-4-5, and claude-haiku-4-5. The model is specified in agent.yaml and used by gitclaw at runtime.",
              },
              {
                q: "Can I have multiple skills?",
                a: "Yes. There's no hard limit on the number of skills. Each skill gets its own directory under skills/ with a SKILL.md file. Skills are loaded by gitclaw based on context.",
              },
              {
                q: "What happens if I reload the page mid-build?",
                a: "Your progress is automatically saved to localStorage on every change. Reloading the page will restore your exact state, including the current step.",
              },
              {
                q: "Can I import an existing agent.yaml?",
                a: "Yes — use the Import YAML button in the builder toolbar. Paste your agent.yaml content or upload the file directly. The manifest fields (name, version, description, model, tags) will be imported into the builder.",
              },
              {
                q: "Is the gitagent spec versioned?",
                a: "Yes. The current spec version is v0.1.0, shown in the landing page badge. AgentForge always outputs files compliant with the latest spec version.",
              },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ marginBottom: "1rem", padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>{item.q}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.a}</p>
              </motion.div>
            ))}
          </Section>

          {/* CTA */}
          <div style={{ padding: "2.5rem", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>Ready to build your agent?</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Takes about 5 minutes. No account required.</p>
            <Link href="/build">
              <button className="btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                Open the Builder
                <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
