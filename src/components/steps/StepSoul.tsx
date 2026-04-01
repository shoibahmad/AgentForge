"use client";

import { useAgent } from "@/lib/AgentContext";
import { Shuffle, Heart } from "lucide-react";

export default function StepSoul() {
  const { state, dispatch } = useAgent();

  const set = (field: string, value: string) =>
    dispatch({ type: "SET_FIELD", field: field as keyof typeof state, value: value as typeof state[keyof typeof state] });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Heart size={20} color="var(--accent-green)" />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Soul</h2>
            <code style={{
              fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-amber)",
              background: "var(--accent-amber-dim)", border: "1px solid var(--accent-amber-border)",
              padding: "0.15rem 0.5rem", borderRadius: "4px",
            }}>SOUL.md</code>
          </div>
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: "RANDOMIZE_SOUL" })}
            style={{ fontSize: "0.78rem", padding: "0.4rem 0.875rem", gap: "0.4rem" }}
            title="Fill with a random personality"
          >
            <Shuffle size={14} />
            Randomize Soul
          </button>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Define your agent's personality, voice, and core values.
        </p>
      </div>

      {/* Core Identity */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">Core Identity</label>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          Who is this agent? Write it as a first-person statement.
        </p>
        <textarea
          className="input-base textarea-base"
          style={{ minHeight: "120px" }}
          placeholder="I am Forge, an AI designed to help developers ship production-ready code faster..."
          value={state.identity}
          onChange={(e) => set("identity", e.target.value)}
        />
      </div>

      {/* Communication Style */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">Communication Style</label>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          How does this agent speak? Tone, vocabulary, format preferences.
        </p>
        <textarea
          className="input-base textarea-base"
          style={{ minHeight: "100px" }}
          placeholder="Concise and direct. Uses code examples over long explanations. Avoids jargon..."
          value={state.communicationStyle}
          onChange={(e) => set("communicationStyle", e.target.value)}
        />
      </div>

      {/* Values */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">Values</label>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          One value per line. These become bullet points in SOUL.md.
        </p>
        <textarea
          className="input-base textarea-base"
          style={{ minHeight: "120px" }}
          placeholder={"Clarity over cleverness\nShip early, iterate fast\nTests are documentation"}
          value={state.values}
          onChange={(e) => set("values", e.target.value)}
        />
        <span style={{ marginTop: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
          {state.values.split("\n").filter((v) => v.trim()).length} values defined
        </span>
      </div>
    </div>
  );
}
