"use client";

import { useAgent } from "@/lib/AgentContext";
import { Shield } from "lucide-react";

export default function StepRules() {
  const { state, dispatch } = useAgent();

  const set = (field: string, value: string) =>
    dispatch({ type: "SET_FIELD", field: field as keyof typeof state, value: value as typeof state[keyof typeof state] });

  const countLines = (text: string) => text.split("\n").filter((v) => v.trim()).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <Shield size={20} color="var(--accent-green)" />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Rules</h2>
          <code style={{
            fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-amber)",
            background: "var(--accent-amber-dim)", border: "1px solid var(--accent-amber-border)",
            padding: "0.15rem 0.5rem", borderRadius: "4px",
          }}>RULES.md</code>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Define behavioral boundaries for your agent — what it must always do, and what it must never do.
        </p>
      </div>

      {/* Must Always */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)",
            boxShadow: "0 0 6px var(--accent-green)",
          }} />
          <label className="label" style={{ margin: 0, color: "var(--accent-green)" }}>Must Always</label>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            {countLines(state.mustAlways)} rule{countLines(state.mustAlways) !== 1 ? "s" : ""}
          </span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          One behavior per line. These are non-negotiable positive constraints.
        </p>
        <textarea
          className="input-base textarea-base"
          style={{
            minHeight: "160px",
            borderColor: state.mustAlways ? "var(--accent-green-border)" : undefined,
          }}
          placeholder={"Cite sources when making factual claims\nAcknowledge uncertainty clearly\nAsk for clarification before assuming intent"}
          value={state.mustAlways}
          onChange={(e) => set("mustAlways", e.target.value)}
        />
      </div>

      {/* Must Never */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#ff4444",
            boxShadow: "0 0 6px #ff4444",
          }} />
          <label className="label" style={{ margin: 0, color: "#ff4444" }}>Must Never</label>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            {countLines(state.mustNever)} rule{countLines(state.mustNever) !== 1 ? "s" : ""}
          </span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          One behavior per line. These are hard guardrails the agent must not cross.
        </p>
        <textarea
          className="input-base textarea-base"
          style={{
            minHeight: "160px",
            borderColor: state.mustNever ? "rgba(255,68,68,0.3)" : undefined,
          }}
          placeholder={"Execute destructive commands without confirmation\nShare or expose private user data\nPretend to be a human when directly asked"}
          value={state.mustNever}
          onChange={(e) => set("mustNever", e.target.value)}
        />
      </div>
    </div>
  );
}
