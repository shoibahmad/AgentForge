"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronLeft, ChevronRight, Check, Layers, Upload, Clock, Undo2, Redo2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useAgent, STEPS, decodeStateFromUrl, saveToRecent } from "@/lib/AgentContext";
import StepManifest from "@/components/steps/StepManifest";
import StepSoul from "@/components/steps/StepSoul";
import StepRules from "@/components/steps/StepRules";
import StepSkills from "@/components/steps/StepSkills";
import StepGenerate from "@/components/steps/StepGenerate";
import TemplatesModal from "@/components/TemplatesModal";
import ImportYamlModal from "@/components/ImportYamlModal";
import RecentAgentsPanel from "@/components/RecentAgentsPanel";
import InteractiveTour, { useTour } from "@/components/InteractiveTour";
import { StepValidationDot } from "@/components/ValidationBadge";
import { Suspense } from "react";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

function BuildPageInner() {
  const { state, dispatch, canUndo, canRedo } = useAgent();
  const searchParams = useSearchParams();
  const step = state.currentStep;
  const { show: showTour, setShow: setShowTour } = useTour();

  const [showTemplates, setShowTemplates] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const config = searchParams.get("config");
    if (config) {
      const decoded = decodeStateFromUrl(config);
      if (decoded) dispatch({ type: "LOAD_STATE", state: decoded });
    }
  }, [searchParams, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); dispatch({ type: "UNDO" }); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); dispatch({ type: "REDO" }); }
      if (e.key === "Enter") { e.preventDefault(); goTo(step + 1); }
      if (e.key === "d") {
        e.preventDefault();
        // trigger download from StepGenerate — dispatch a custom event
        window.dispatchEvent(new CustomEvent("agentforge:download"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, dispatch]);

  // Save to recent when on generate step
  useEffect(() => {
    if (step === 4 && state.name.trim()) saveToRecent(state);
  }, [step]);

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
      {/* Modals */}
      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}
      {showImport && <ImportYamlModal onClose={() => setShowImport(false)} />}
      {showRecent && <RecentAgentsPanel onClose={() => setShowRecent(false)} />}
      {showTour && <InteractiveTour onClose={() => setShowTour(false)} />}

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 1.25rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        gap: "0.75rem",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
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
                style={{ cursor: "pointer", border: "none", background: undefined, position: "relative" }}
                title={s.label}
              >
                {i < step ? <Check size={12} /> : i + 1}
                {i !== step && (
                  <span style={{ position: "absolute", top: -3, right: -3 }}>
                    <StepValidationDot state={state} stepIndex={i} />
                  </span>
                )}
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

        {/* Right toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
          <button className="btn-ghost" style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem" }} title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => dispatch({ type: "UNDO" })}>
            <Undo2 size={14} style={{ opacity: canUndo ? 1 : 0.3 }} />
          </button>
          <button className="btn-ghost" style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem" }} title="Redo (Ctrl+Y)" disabled={!canRedo} onClick={() => dispatch({ type: "REDO" })}>
            <Redo2 size={14} style={{ opacity: canRedo ? 1 : 0.3 }} />
          </button>
          <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 0.2rem" }} />
          <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }} title="Templates" onClick={() => setShowTemplates(true)}>
            <Layers size={14} />
            <span style={{ display: "none" }}>Templates</span>
          </button>
          <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }} title="Import YAML" onClick={() => setShowImport(true)}>
            <Upload size={14} />
          </button>
          <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }} title="Recent agents" onClick={() => setShowRecent(true)}>
            <Clock size={14} />
          </button>
          <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }} title="Tour" onClick={() => setShowTour(true)}>
            <HelpCircle size={14} />
          </button>
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
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            {i < step ? "✓ " : ""}{s.label}
            {i !== step && <StepValidationDot state={state} stepIndex={i} />}
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
            Step {step + 1} of {STEPS.length} · <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.3rem" }}>Ctrl+Enter</kbd> to advance
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
