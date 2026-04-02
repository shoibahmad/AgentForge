"use client";

import { useEffect, useState } from "react";
import { getRecentAgents, RecentAgent, decodeStateFromUrl, useAgent } from "@/lib/AgentContext";
import { X, Clock, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function RecentAgentsPanel({ onClose }: { onClose: () => void }) {
  const { dispatch } = useAgent();
  const [recents, setRecents] = useState<RecentAgent[]>([]);
  const [pending, setPending] = useState<RecentAgent | null>(null);

  useEffect(() => { setRecents(getRecentAgents()); }, []);

  const load = (r: RecentAgent) => {
    const decoded = decodeStateFromUrl(r.encodedState);
    if (!decoded) return;
    setPending(r);
  };

  const confirm = () => {
    if (!pending) return;
    const decoded = decodeStateFromUrl(pending.encodedState);
    if (!decoded) return;
    dispatch({ type: "LOAD_STATE", state: { ...decoded, currentStep: 0 } });
    setPending(null);
    onClose();
  };

  const fmt = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
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
          borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "480px",
          maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column",
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Clock size={18} color="var(--accent-green)" />
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>Recent Agents</span>
            </div>
            <button className="btn-ghost" style={{ padding: "0.25rem" }} onClick={onClose}><X size={16} /></button>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {recents.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                No recent agents yet.<br />Build one and download it to save it here.
              </div>
            ) : recents.map((r) => (
              <button key={r.id + r.savedAt} onClick={() => load(r)} style={{
                width: "100%", textAlign: "left", padding: "1rem 1.5rem",
                background: "transparent", border: "none", borderBottom: "1px solid var(--border)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.875rem", color: "var(--accent-green)", marginBottom: "0.2rem" }}>{r.name}</div>
                  {r.description && <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{r.description}</div>}
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{fmt(r.savedAt)}</div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {pending && (
        <ConfirmDialog
          title={`Load "${pending.name}"?`}
          message="This will replace your current agent configuration. Any unsaved changes will be lost."
          confirmLabel="Load Agent"
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
}
