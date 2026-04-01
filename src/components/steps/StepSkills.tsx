"use client";

import { useAgent, ALL_TOOLS, AllowedTool } from "@/lib/AgentContext";
import { Plus, Trash2, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const TOOL_COLORS: Record<AllowedTool, string> = {
  Read: "#00d4ff",
  Write: "#ffb800",
  Bash: "#ff6b35",
  WebSearch: "#00ff88",
};

export default function StepSkills() {
  const { state, dispatch } = useAgent();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateSkill = (id: string, field: string, value: unknown) =>
    dispatch({ type: "UPDATE_SKILL", id, field: field as keyof import("@/lib/AgentContext").Skill, value: value as import("@/lib/AgentContext").Skill[keyof import("@/lib/AgentContext").Skill] });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Wrench size={20} color="var(--accent-green)" />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Skills</h2>
            <code style={{
              fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-amber)",
              background: "var(--accent-amber-dim)", border: "1px solid var(--accent-amber-border)",
              padding: "0.15rem 0.5rem", borderRadius: "4px",
            }}>skills/*/SKILL.md</code>
          </div>
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: "ADD_SKILL" })}
            style={{ fontSize: "0.78rem", padding: "0.4rem 0.875rem" }}
          >
            <Plus size={14} />
            Add Skill
          </button>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Skills give your agent specific capabilities. Each skill gets its own SKILL.md file.
        </p>
      </div>

      {state.skills.length === 0 && (
        <div style={{
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          <Wrench size={32} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>No skills yet.</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>Click "Add Skill" to create your first one.</p>
        </div>
      )}

      {state.skills.map((skill, idx) => {
        const isCollapsed = collapsed.has(skill.id);
        return (
          <div
            key={skill.id}
            className="card"
            style={{ gap: "1.25rem", display: "flex", flexDirection: "column", padding: "0" }}
          >
            {/* Skill header */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.875rem 1.25rem",
                borderBottom: isCollapsed ? "none" : "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => toggleCollapse(skill.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)",
                  background: "var(--bg-tertiary)", padding: "0.1rem 0.4rem", borderRadius: "4px",
                }}>
                  #{idx + 1}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 600 }}>
                  {skill.name || <span style={{ color: "var(--text-muted)" }}>untitled-skill</span>}
                </span>
                {skill.allowedTools.length > 0 && (
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    {skill.allowedTools.map((t) => (
                      <span key={t} style={{
                        padding: "0.1rem 0.4rem", borderRadius: "4px",
                        fontSize: "0.65rem", fontFamily: "var(--font-mono)",
                        background: TOOL_COLORS[t] + "15", color: TOOL_COLORS[t],
                        border: `1px solid ${TOOL_COLORS[t]}33`,
                      }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  className="btn-danger"
                  style={{ padding: "0.25rem 0.5rem" }}
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_SKILL", id: skill.id }); }}
                >
                  <Trash2 size={13} />
                </button>
                {isCollapsed ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronUp size={16} color="var(--text-muted)" />}
              </div>
            </div>

            {!isCollapsed && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "0 1.25rem 1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Skill Name (slug)</label>
                    <input
                      className="input-base"
                      placeholder="web-search"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <input
                      className="input-base"
                      placeholder="Searches the web for current information"
                      value={skill.description}
                      onChange={(e) => updateSkill(skill.id, "description", e.target.value)}
                    />
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <label className="label">Allowed Tools</label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {ALL_TOOLS.map((tool) => {
                      const active = skill.allowedTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          onClick={() => dispatch({ type: "TOGGLE_SKILL_TOOL", id: skill.id, tool })}
                          style={{
                            padding: "0.35rem 0.875rem",
                            borderRadius: "20px",
                            fontSize: "0.78rem",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all var(--transition)",
                            border: `1px solid ${active ? TOOL_COLORS[tool] + "66" : "var(--border)"}`,
                            background: active ? TOOL_COLORS[tool] + "18" : "transparent",
                            color: active ? TOOL_COLORS[tool] : "var(--text-muted)",
                          }}
                        >
                          {active && "✓ "}{tool}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="label">Instructions</label>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    Step-by-step instructions the agent follows when using this skill.
                  </p>
                  <textarea
                    className="input-base textarea-base"
                    style={{ minHeight: "140px" }}
                    placeholder={"1. Formulate a precise search query based on user intent\n2. Execute the web search\n3. Summarize the top 3 results, citing URLs\n4. Flag any conflicting information found"}
                    value={skill.instructions}
                    onChange={(e) => updateSkill(skill.id, "instructions", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {state.skills.length > 0 && (
        <button
          className="btn-secondary"
          onClick={() => dispatch({ type: "ADD_SKILL" })}
          style={{ alignSelf: "flex-start" }}
        >
          <Plus size={14} />
          Add Another Skill
        </button>
      )}
    </div>
  );
}
