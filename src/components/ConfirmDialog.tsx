"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--bg-secondary)",
          border: `1px solid ${danger ? "rgba(255,68,68,0.35)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
          width: "100%", maxWidth: "400px",
          boxShadow: danger
            ? "0 0 40px rgba(255,68,68,0.08)"
            : "0 0 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div style={{
          height: "3px",
          background: danger
            ? "linear-gradient(90deg, transparent, #ff4444, transparent)"
            : "linear-gradient(90deg, transparent, var(--accent-green), transparent)",
        }} />

        <div style={{ padding: "1.5rem" }}>
          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "8px", flexShrink: 0,
              background: danger ? "rgba(255,68,68,0.12)" : "var(--accent-green-dim)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertTriangle size={18} color={danger ? "#ff4444" : "var(--accent-green)"} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</span>
          </div>

          {/* Message */}
          <p style={{
            fontSize: "0.875rem", color: "var(--text-secondary)",
            lineHeight: 1.6, marginBottom: "1.5rem",
          }}>
            {message}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              className="btn-secondary"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1.25rem", fontSize: "0.82rem",
                fontFamily: "var(--font-mono)", fontWeight: 600,
                borderRadius: "var(--radius-md)", border: "none", cursor: "pointer",
                transition: "all var(--transition)",
                background: danger ? "#ff4444" : "var(--accent-green)",
                color: "#000",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
