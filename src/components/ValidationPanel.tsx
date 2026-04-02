"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useAgent, validateAgent, ValidationCheck, ValidationSeverity } from "@/lib/AgentContext";

const SEVERITY_CONFIG: Record<ValidationSeverity, {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  pass: {
    icon: CheckCircle2,
    color: "#00ff88",
    bg: "rgba(0,255,136,0.07)",
    border: "rgba(0,255,136,0.2)",
    label: "PASS",
  },
  warn: {
    icon: AlertTriangle,
    color: "#ffb800",
    bg: "rgba(255,184,0,0.07)",
    border: "rgba(255,184,0,0.2)",
    label: "WARN",
  },
  fail: {
    icon: XCircle,
    color: "#ff4444",
    bg: "rgba(255,68,68,0.07)",
    border: "rgba(255,68,68,0.2)",
    label: "FAIL",
  },
};

function CheckRow({ check, onJump }: { check: ValidationCheck; onJump: (step: number) => void }) {
  const cfg = SEVERITY_CONFIG[check.severity];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.625rem 0.875rem",
        borderRadius: "var(--radius-md)",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        cursor: check.severity !== "pass" ? "pointer" : "default",
        transition: "all var(--transition)",
      }}
      whileHover={check.severity !== "pass" ? { scale: 1.005 } : {}}
      onClick={() => check.severity !== "pass" && onJump(check.step)}
    >
      <span style={{ flexShrink: 0, marginTop: 2, display: "flex" }}>
        <Icon size={15} color={cfg.color} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}>
            {check.label}
          </span>
          <code style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            background: "var(--bg-tertiary)",
            padding: "0 0.35rem",
            borderRadius: "3px",
          }}>
            {check.file}
          </code>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: check.severity === "pass" ? "var(--text-muted)" : cfg.color,
          marginTop: "0.2rem",
          opacity: 0.9,
        }}>
          {check.detail}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: cfg.color,
          background: cfg.bg,
          padding: "0.1rem 0.4rem",
          borderRadius: "3px",
          border: `1px solid ${cfg.border}`,
        }}>
          {cfg.label}
        </span>
        {check.severity !== "pass" && (
          <ChevronRight size={12} color="var(--text-muted)" />
        )}
      </div>
    </motion.div>
  );
}

const FILE_GROUPS: { file: string; label: string; files: string[] }[] = [
  { file: "agent.yaml", label: "agent.yaml", files: ["agent.yaml"] },
  { file: "SOUL.md", label: "SOUL.md", files: ["SOUL.md"] },
  { file: "RULES.md", label: "RULES.md", files: ["RULES.md"] },
  { file: "skills/", label: "skills/", files: ["skills/"] },
];

export default function ValidationPanel({ onJumpToStep }: { onJumpToStep: (step: number) => void }) {
  const { state } = useAgent();
  const [filter, setFilter] = useState<ValidationSeverity | "all">("all");
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);

  const result = useMemo(() => validateAgent(state), [state]);

  const handleRun = () => {
    setRunning(true);
    setRan(false);
    setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 800);
  };

  const filtered = ran
    ? filter === "all"
      ? result.checks
      : result.checks.filter((c) => c.severity === filter)
    : [];

  const scorePercent = ran
    ? Math.round((result.passed / result.checks.length) * 100)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ShieldCheck size={20} color="var(--accent-green)" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Agent Validation</h3>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            background: "var(--bg-tertiary)",
            padding: "0.1rem 0.45rem",
            borderRadius: "4px",
          }}>
            npx gitagent validate
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={handleRun}
          disabled={running}
          style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
        >
          {running ? (
            <>
              <span style={{
                display: "inline-block",
                width: 12, height: 12,
                border: "2px solid #000",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
              Validating…
            </>
          ) : (
            <>
              <RefreshCw size={13} />
              {ran ? "Re-run" : "Validate Agent"}
            </>
          )}
        </button>
      </div>

      {/* Summary bar */}
      <AnimatePresence>
        {ran && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Score */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: result.isValid ? "rgba(0,255,136,0.05)" : "rgba(255,68,68,0.05)",
              border: `1px solid ${result.isValid ? "rgba(0,255,136,0.2)" : "rgba(255,68,68,0.2)"}`,
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}>
              {/* Big score */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  fontSize: "2rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  color: result.isValid ? "var(--accent-green)" : "#ff4444",
                  lineHeight: 1,
                }}>
                  {scorePercent}%
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: result.isValid ? "var(--accent-green)" : "#ff4444",
                  }}>
                    {result.isValid ? "✓ Valid" : "✗ Invalid"}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {result.checks.length} checks run
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ height: 6, borderRadius: 3, background: "var(--bg-tertiary)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${scorePercent}%`,
                    background: `linear-gradient(90deg, ${result.isValid ? "var(--accent-green)" : "#ff4444"}, var(--accent-amber))`,
                    borderRadius: 3,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>

              {/* Pill summary */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { label: `${result.passed} passed`, color: "#00ff88", bg: "rgba(0,255,136,0.1)" },
                  { label: `${result.warned} warnings`, color: "#ffb800", bg: "rgba(255,184,0,0.1)" },
                  { label: `${result.failed} failed`, color: "#ff4444", bg: "rgba(255,68,68,0.1)" },
                ].map((s) => (
                  <span key={s.label} style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: s.color,
                    background: s.bg,
                    padding: "0.2rem 0.625rem",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                  }}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              {(["all", "fail", "warn", "pass"] as const).map((f) => {
                const count = f === "all"
                  ? result.checks.length
                  : result.checks.filter((c) => c.severity === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      transition: "all var(--transition)",
                      borderColor: filter === f
                        ? f === "fail" ? "#ff4444" : f === "warn" ? "#ffb800" : f === "pass" ? "#00ff88" : "var(--border-bright)"
                        : "var(--border)",
                      background: filter === f
                        ? f === "fail" ? "rgba(255,68,68,0.12)" : f === "warn" ? "rgba(255,184,0,0.12)" : f === "pass" ? "rgba(0,255,136,0.12)" : "var(--bg-hover)"
                        : "transparent",
                      color: filter === f
                        ? f === "fail" ? "#ff4444" : f === "warn" ? "#ffb800" : f === "pass" ? "#00ff88" : "var(--text-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                  </button>
                );
              })}
            </div>

            {/* Check list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: "1.5rem",
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-md)",
                }}>
                  No {filter !== "all" ? filter : ""} checks to show.
                </div>
              ) : (
                filtered.map((check, i) => (
                  <motion.div key={check.id} custom={i} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.025 } }}>
                    <CheckRow check={check} onJump={onJumpToStep} />
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer hint */}
            {result.failed > 0 && (
              <p style={{
                marginTop: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}>
                💡 Click any <span style={{ color: "#ff4444" }}>FAIL</span> or <span style={{ color: "#ffb800" }}>WARN</span> row to jump to that step and fix it.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!ran && !running && (
        <div style={{
          padding: "2rem",
          textAlign: "center",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}>
          <span style={{ display: "flex", margin: "0 auto 0.75rem", opacity: 0.3 }}>
            <ShieldCheck size={28} />
          </span>
          <p>Run validation to check your agent against the gitagent spec.</p>
          <p style={{ marginTop: "0.25rem", fontSize: "0.72rem" }}>
            Checks name, version, soul, rules, and every skill for completeness.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
