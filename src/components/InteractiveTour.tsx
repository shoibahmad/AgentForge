"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const TOUR_KEY = "agentforge_tour_done";

const steps = [
  {
    title: "Welcome to AgentForge 👋",
    body: "Build a complete AI agent in ~5 minutes. This quick tour shows you what each step does.",
    highlight: null,
  },
  {
    title: "Step 1 — Manifest",
    body: "Set your agent's name, version, model, and tags. This becomes agent.yaml — the entry point gitclaw reads.",
    highlight: "manifest",
  },
  {
    title: "Step 2 — Soul",
    body: "Define your agent's personality, communication style, and values. Use Randomize Soul to get started fast.",
    highlight: "soul",
  },
  {
    title: "Step 3 — Rules",
    body: "Set hard behavioral constraints. Must Always = positive rules. Must Never = hard guardrails.",
    highlight: "rules",
  },
  {
    title: "Step 4 — Skills",
    body: "Add modular capabilities. Each skill gets its own SKILL.md with tool permissions (Read, Write, Bash, WebSearch).",
    highlight: "skills",
  },
  {
    title: "Step 5 — Generate",
    body: "Preview all files, run validation, share via URL, or download the complete ZIP. You're done.",
    highlight: "generate",
  },
  {
    title: "Pro tips",
    body: "• Use Templates to start from a pre-built config\n• Ctrl+Z / Ctrl+Y for undo/redo\n• Ctrl+Enter to advance steps\n• Ctrl+D to download ZIP",
    highlight: null,
  },
];

export default function InteractiveTour({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const current = steps[idx];
  const isLast = idx === steps.length - 1;

  const finish = () => {
    try { localStorage.setItem(TOUR_KEY, "1"); } catch {}
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--accent-green-border)",
        borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "440px",
        boxShadow: "0 0 40px rgba(0,255,136,0.1)",
        overflow: "hidden",
      }}>
        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--border)" }}>
          <div style={{ height: "100%", background: "var(--accent-green)", width: `${((idx + 1) / steps.length) * 100}%`, transition: "width 0.3s" }} />
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{current.title}</h3>
            <button className="btn-ghost" style={{ padding: "0.2rem", flexShrink: 0 }} onClick={finish}><X size={14} /></button>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{current.body}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>{idx + 1} / {steps.length}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {idx > 0 && (
                <button className="btn-secondary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.78rem" }} onClick={() => setIdx(i => i - 1)}>
                  <ChevronLeft size={13} /> Back
                </button>
              )}
              {isLast ? (
                <button className="btn-primary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.78rem" }} onClick={finish}>
                  Let's build
                </button>
              ) : (
                <button className="btn-primary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.78rem" }} onClick={() => setIdx(i => i + 1)}>
                  Next <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useTour() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_KEY)) setShow(true);
    } catch {}
  }, []);
  return { show, setShow };
}
