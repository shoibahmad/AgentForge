"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useAgent, STEPS, decodeStateFromUrl } from "@/lib/AgentContext";
import StepManifest from "@/components/steps/StepManifest";
import StepSoul from "@/components/steps/StepSoul";
import StepRules from "@/components/steps/StepRules";
import StepSkills from "@/components/steps/StepSkills";
import StepGenerate from "@/components/steps/StepGenerate";
import { Suspense } from "react";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

function BuildPageInner() {
  const { state, dispatch } = useAgent();
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = state.currentStep;

  useEffect(() => {
    const config = searchParams.get("config");
    if (config) {
      const decoded = decodeStateFromUrl(config);
      if (decoded) dispatch({ type: "LOAD_STATE", state: decoded });
    }
  }, [searchParams, dispatch]);

  const goTo = (s: number) => {
    if (s < 0 || s >= STEPS.length) return;
    dispatch({ type: "SET_STEP", step: s });
  };

  const stepComponents = [
    <StepManifest key="manifest" />,
    <StepSoul key="soul" />,
    <StepRules key="rules" />,
    <StepSkills key="skills" />,
    <StepGenerate key="generate" />,
  ];

  const isLast = step === STEPS.length - 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <Terminal size={18} color="var(--accent-green)" />
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
            Agent<span style={{ color: "var(--accent-green)" }}>Forge</span>
          </span>
        </Link>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={() => goTo(i)}
                className={`step-indicator ${i < step ? "complete" : i === step ? "active" : "inactive"}`}
                style={{ cursor: "pointer", border: "none", background: undefined }}
                title={s.label}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div style={{
                  height: 1, width: "2rem",
                  background: i < step ? "var(--accent-green-border)" : "var(--border)",
                  transition: "background var(--transition)",
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {STEPS[step].label}
        </div>
      </header>

      {/* Step labels bar */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "36px",
        display: "flex",
        alignItems: "center",
        gap: "0",
        background: "var(--bg-secondary)",
        overflowX: "auto",
      }}>
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              padding: "0 1.25rem",
              height: "36px",
              background: i === step ? "var(--bg-primary)" : "transparent",
              border: "none",
              borderBottom: i === step ? "2px solid var(--accent-green)" : "2px solid transparent",
              color: i === step ? "var(--text-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all var(--transition)",
            }}
          >
            {i < step ? "✓ " : ""}{s.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: "900px", width: "100%", margin: "0 auto", position: "relative" }}>
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {stepComponents[step]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer nav */}
      {!isLast && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-secondary)",
        }}>
          <button
            className="btn-secondary"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Step {step + 1} of {STEPS.length}
          </span>

          <button className="btn-primary" onClick={() => goTo(step + 1)}>
            {step === STEPS.length - 2 ? "Generate" : "Next"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense>
      <BuildPageInner />
    </Suspense>
  );
}
