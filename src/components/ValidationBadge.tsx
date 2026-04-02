"use client";

import { validateAgent, AgentState } from "@/lib/AgentContext";

// Returns a small colored dot for a given step index
export function StepValidationDot({ state, stepIndex }: { state: AgentState; stepIndex: number }) {
  const result = validateAgent(state);
  const stepChecks = result.checks.filter((c) => c.step === stepIndex);
  if (stepChecks.length === 0) return null;
  const hasFail = stepChecks.some((c) => c.severity === "fail");
  const hasWarn = stepChecks.some((c) => c.severity === "warn");
  const color = hasFail ? "#ff4444" : hasWarn ? "#ffb800" : "var(--accent-green)";
  const label = hasFail ? "fail" : hasWarn ? "warn" : "pass";
  return (
    <span
      title={label}
      style={{
        display: "inline-block", width: 7, height: 7, borderRadius: "50%",
        background: color, boxShadow: `0 0 5px ${color}`,
        flexShrink: 0,
      }}
    />
  );
}
