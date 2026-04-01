"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Zap, Download, GitBranch, Layers, Shield } from "lucide-react";

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Layers,
    title: "5-Step Agent Builder",
    desc: "Define manifest, soul, rules, and skills through a guided UI. No YAML editing required.",
    color: "var(--accent-green)",
  },
  {
    icon: Terminal,
    title: "gitagent Format",
    desc: "Outputs spec-compliant agent.yaml, SOUL.md, RULES.md, and skill files ready for gitclaw.",
    color: "var(--accent-amber)",
  },
  {
    icon: Download,
    title: "One-Click Download",
    desc: "Bundle your entire agent repo as a ZIP — no backend, runs entirely in your browser.",
    color: "var(--accent-green)",
  },
  {
    icon: Shield,
    title: "Local-First",
    desc: "Your data never leaves your browser. Full localStorage persistence across sessions.",
    color: "var(--accent-amber)",
  },
  {
    icon: GitBranch,
    title: "gitclaw Compatible",
    desc: "Run your agent instantly with `gitclaw run` or deploy with `clawless deploy`.",
    color: "var(--accent-green)",
  },
  {
    icon: Zap,
    title: "Live Preview",
    desc: "See your generated YAML/Markdown update in real-time as you fill in each step.",
    color: "var(--accent-amber)",
  },
];

const concepts = [
  {
    name: "gitagent",
    desc: "A structured format for defining AI agents as version-controlled repositories. Includes a manifest, a soul (personality), rules, and skills.",
    color: "#00ff88",
  },
  {
    name: "gitclaw",
    desc: "The runtime that executes gitagent repos. Run `gitclaw run` in any agent directory to spin up your agent.",
    color: "#ffb800",
  },
  {
    name: "clawless",
    desc: "Serverless deployment layer for gitagent. Deploy your agent to the cloud in seconds — no infrastructure needed.",
    color: "#00d4ff",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.9)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Terminal size={20} color="var(--accent-green)" />
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
            Agent<span style={{ color: "var(--accent-green)" }}>Forge</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="#concepts" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none" }}>Docs</a>
          <a href="#features" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none" }}>Features</a>
          <Link href="/build">
            <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
              Start Building
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid-bg" style={{ padding: "6rem 2rem 5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--accent-green-dim)", border: "1px solid var(--accent-green-border)",
              borderRadius: "20px", padding: "0.3rem 0.875rem",
              fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)",
              marginBottom: "2rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} />
              gitagent spec v0.1.0 — ready to build
            </div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}
          >
            Build AI Agents<br />
            <span className="gradient-text">Like You Write Code</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "580px", margin: "0 auto 2.5rem" }}
          >
            AgentForge is a visual builder for the <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)", background: "var(--accent-green-dim)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>gitagent</code> format.
            Define your agent's personality, rules, and skills — then download a complete, deploy-ready repository.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/build">
              <button className="btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                Start Building
                <ArrowRight size={16} />
              </button>
            </Link>
            <a href="#concepts">
              <button className="btn-secondary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                Learn More
              </button>
            </a>
          </motion.div>
        </div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ maxWidth: "680px", margin: "4rem auto 0", textAlign: "left" }}
        >
          <div className="terminal-block" style={{ borderColor: "var(--accent-green-border)" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div><span className="terminal-comment"># Clone your generated agent</span></div>
            <div><span className="terminal-prompt">$ </span><span className="terminal-cmd">gitclaw validate ./my-agent</span></div>
            <div style={{ color: "var(--accent-green)", paddingLeft: "1rem" }}>✓ agent.yaml valid</div>
            <div style={{ color: "var(--accent-green)", paddingLeft: "1rem" }}>✓ SOUL.md present</div>
            <div style={{ color: "var(--accent-green)", paddingLeft: "1rem" }}>✓ 3 skills loaded</div>
            <div><span className="terminal-prompt">$ </span><span className="terminal-cmd">gitclaw run ./my-agent</span></div>
            <div style={{ color: "var(--accent-amber)" }}>⚡ Agent running on localhost:4000</div>
            <div style={{ marginTop: "0.5rem" }}><span className="terminal-prompt">$ </span><span className="terminal-cmd">clawless deploy ./my-agent<span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>_</span></span></div>
          </div>
        </motion.div>
      </section>

      {/* Concepts */}
      <section id="concepts" style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>The Ecosystem</h2>
          <p style={{ color: "var(--text-secondary)" }}>Three tools. One complete agent development workflow.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {concepts.map((c, i) => (
            <motion.div
              key={c.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card"
              style={{ borderColor: `${c.color}33`, position: "relative", overflow: "hidden" }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`,
              }} />
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 700, color: c.color }}>
                {c.name}
              </code>
              <p style={{ marginTop: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "5rem 2rem", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>Everything You Need</h2>
            <p style={{ color: "var(--text-secondary)" }}>No YAML hand-writing. No guesswork. Just build.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{
                    padding: "1.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--bg-primary)",
                    transition: "all var(--transition)",
                  }}
                  whileHover={{ borderColor: f.color + "44", y: -2 }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--radius-md)",
                    background: f.color + "15", display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1rem",
                  }}>
                    <Icon size={20} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Ready to forge your agent?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "1rem" }}>
            Takes ~5 minutes. Download a production-ready repository.
          </p>
          <Link href="/build">
            <button className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
              Open the Builder
              <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Terminal size={16} color="var(--accent-green)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            AgentForge — gitagent builder
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          100% client-side · no data collected
        </span>
      </footer>
    </div>
  );
}
