"use client";

import { useAgent, MODEL_OPTIONS, AVAILABLE_TAGS, ModelId } from "@/lib/AgentContext";
import { FileText } from "lucide-react";

export default function StepManifest() {
  const { state, dispatch } = useAgent();

  const set = (field: string, value: unknown) =>
    dispatch({ type: "SET_FIELD", field: field as keyof typeof state, value: value as typeof state[keyof typeof state] });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <FileText size={20} color="var(--accent-green)" />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Manifest</h2>
          <code style={{
            fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-amber)",
            background: "var(--accent-amber-dim)", border: "1px solid var(--accent-amber-border)",
            padding: "0.15rem 0.5rem", borderRadius: "4px",
          }}>agent.yaml</code>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Basic identity and configuration for your agent.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="label">Agent Name (slug)</label>
          <input
            className="input-base"
            type="text"
            placeholder="my-awesome-agent"
            value={state.name}
            onChange={(e) => set("name", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem", fontFamily: "var(--font-mono)" }}>
            Lowercase, hyphens only
          </span>
        </div>

        {/* Version */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="label">Version</label>
          <input
            className="input-base"
            type="text"
            placeholder="0.1.0"
            value={state.version}
            onChange={(e) => set("version", e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">One-line Description</label>
        <input
          className="input-base"
          type="text"
          placeholder="A helpful AI agent that..."
          value={state.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Model selector */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">Preferred Model</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {MODEL_OPTIONS.map((m) => (
            <label
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem 1rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${state.model === m.id ? "var(--accent-green-border)" : "var(--border)"}`,
                background: state.model === m.id ? "var(--accent-green-dim)" : "var(--bg-secondary)",
                cursor: "pointer",
                transition: "all var(--transition)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <input
                  type="radio"
                  name="model"
                  value={m.id}
                  checked={state.model === m.id}
                  onChange={() => set("model", m.id as ModelId)}
                  style={{ accentColor: "var(--accent-green)" }}
                />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.id}</div>
                </div>
              </div>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.7rem", padding: "0.2rem 0.6rem",
                borderRadius: "20px",
                background: state.model === m.id ? "var(--accent-green)" : "var(--bg-tertiary)",
                color: state.model === m.id ? "#000" : "var(--text-muted)",
                fontWeight: 600,
              }}>
                {m.badge}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label className="label">Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {AVAILABLE_TAGS.map((tag) => {
            const active = state.tags.includes(tag);
            return (
              <button
                key={tag}
                className={`tag ${active ? "tag-active" : "tag-inactive"}`}
                onClick={() => dispatch({ type: "TOGGLE_TAG", tag })}
              >
                {active && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                {tag}
              </button>
            );
          })}
        </div>
        {state.tags.length > 0 && (
          <span style={{ marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {state.tags.length} tag{state.tags.length !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>
    </div>
  );
}
