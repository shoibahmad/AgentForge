"use client";

import { useState } from "react";
import { AGENT_TEMPLATES, AgentTemplate, useAgent } from "@/lib/AgentContext";
import { X, Layers } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function TemplatesModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useAgent();
  const [pending, setPending] = useState<AgentTemplate | null>(null);

  const apply = (t: AgentTemplate) => setPending(t);

  const confirm = () => {
    if (!pending) return;
    dispatch({ type: "APPLY_TEMPLATE", template: pending });
    setPending(null);
    onClose();
  };

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      }} onClick={onClose}>
        <div style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "680px",
          maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column",
        }} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Layers size={18} color="var(--accent-green)" />
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>Agent Templates</span>
            </div>
            <button className="btn-ghost" style={{ padding: "0.25rem" }} onClick={onClose}><X size={16} /></button>
          </div>
          <p style={{ padding: "0.75rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
            Start from a pre-built config. All fields are editable after loading.
          </p>
          {/* Templates grid */}
          <div style={{ overflowY: "auto", padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {AGENT_TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => apply(t)} style={{
                textAlign: "left", padding: "1.25rem", background: "var(--bg-primary)",
                border: `1px solid var(--border)`, borderRadius: "var(--radius-md)",
                cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.color + "66"; (e.currentTarget as HTMLElement).style.background = t.color + "08"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-primary)"; }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem", color: t.color }}>{t.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{t.description}</div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {t.state.skills.map(s => (
                    <span key={s.id} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {pending && (
        <ConfirmDialog
          title={`Load "${pending.name}"?`}
          message="This will replace your current agent configuration. Any unsaved changes will be lost."
          confirmLabel="Load Template"
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
}
