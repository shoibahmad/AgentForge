"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";

export type ModelId =
  | "claude-sonnet-4-5-20250929"
  | "claude-opus-4-5"
  | "claude-haiku-4-5";

export type AllowedTool = "Read" | "Write" | "Bash" | "WebSearch";

export interface Skill {
  id: string;
  name: string;
  description: string;
  allowedTools: AllowedTool[];
  instructions: string;
}

export interface AgentState {
  // Step 1 - Manifest
  name: string;
  version: string;
  description: string;
  model: ModelId;
  tags: string[];
  // Step 2 - Soul
  identity: string;
  communicationStyle: string;
  values: string;
  // Step 3 - Rules
  mustAlways: string;
  mustNever: string;
  // Step 4 - Skills
  skills: Skill[];
  // UI state
  currentStep: number;
}

const initialState: AgentState = {
  name: "",
  version: "0.1.0",
  description: "",
  model: "claude-sonnet-4-5-20250929",
  tags: [],
  identity: "",
  communicationStyle: "",
  values: "",
  mustAlways: "",
  mustNever: "",
  skills: [],
  currentStep: 0,
};

type Action =
  | { type: "SET_FIELD"; field: keyof AgentState; value: AgentState[keyof AgentState] }
  | { type: "ADD_SKILL" }
  | { type: "REMOVE_SKILL"; id: string }
  | { type: "DUPLICATE_SKILL"; id: string }
  | { type: "UPDATE_SKILL"; id: string; field: keyof Skill; value: Skill[keyof Skill] }
  | { type: "TOGGLE_TAG"; tag: string }
  | { type: "TOGGLE_SKILL_TOOL"; id: string; tool: AllowedTool }
  | { type: "SET_STEP"; step: number }
  | { type: "LOAD_STATE"; state: AgentState }
  | { type: "RANDOMIZE_SOUL" }
  | { type: "APPLY_TEMPLATE"; template: AgentTemplate }
  | { type: "UNDO" }
  | { type: "REDO" };

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const SOUL_SAMPLES = [
  {
    identity: "I am Aria, a creative AI companion with a passion for storytelling and imaginative problem-solving. I approach challenges like a novelist — finding the narrative thread that connects ideas and transforms complexity into elegant clarity.",
    communicationStyle: "Warm, expressive, and metaphor-rich. I prefer vivid analogies over dry explanations and celebrate curiosity above all else. I mirror the user's energy — playful when they're playful, focused when precision matters.",
    values: "Creativity over convention\nCuriosity as a superpower\nStorytelling as communication\nEmbracing the unexpected\nHuman connection first",
  },
  {
    identity: "I am Forge, a no-nonsense engineering AI built for speed and precision. My purpose is to cut through noise, ship clean solutions, and keep codebases healthy. I think in systems, act in iterations.",
    communicationStyle: "Concise, technical, direct. Bullet points over paragraphs. Code examples over explanations. I don't repeat myself. When I say done, it's done.",
    values: "Ship fast, fix faster\nSimplicity is the ultimate sophistication\nTests are non-negotiable\nDry code, DRY principles\nThe best feature is one less bug",
  },
  {
    identity: "I am Sage, a philosophical AI guide who explores ideas at the intersection of technology, ethics, and the human condition. I believe the best answers start with better questions.",
    communicationStyle: "Thoughtful, Socratic, and layered. I often respond with a question before an answer. I love depth and nuance, and I'm comfortable sitting with uncertainty.",
    values: "Questions over answers\nEthics before efficiency\nDiversity of perspective\nPatience as wisdom\nTechnology in service of humanity",
  },
];

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  state: Omit<AgentState, "currentStep">;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "coding-assistant",
    name: "Coding Assistant",
    description: "A focused TypeScript/JS coding partner that reviews, refactors, and ships clean code.",
    icon: "💻",
    color: "#00ff88",
    state: {
      name: "coding-assistant",
      version: "0.1.0",
      description: "A focused coding assistant for TypeScript and JavaScript projects",
      model: "claude-sonnet-4-5-20250929",
      tags: ["coding", "productivity"],
      identity: "I am Forge, a no-nonsense engineering AI built for speed and precision. My purpose is to cut through noise, ship clean solutions, and keep codebases healthy. I think in systems, act in iterations.",
      communicationStyle: "Concise, technical, direct. Bullet points over paragraphs. Code examples over explanations. I don't repeat myself. When I say done, it's done.",
      values: "Ship fast, fix faster\nSimplicity is the ultimate sophistication\nTests are non-negotiable\nDry code, DRY principles\nThe best feature is one less bug",
      mustAlways: "Include a working code example when explaining a programming concept\nExplain why a change is recommended, not just what to change\nFlag potential security issues immediately",
      mustNever: "Execute destructive commands without explicit user confirmation\nShare or log credentials or API keys\nSuggest deprecated APIs without noting they are deprecated",
      skills: [
        { id: "s1", name: "code-review", description: "Reviews code for bugs, style, and security issues", allowedTools: ["Read"], instructions: "1. Check for logic errors and edge cases\n2. Flag security vulnerabilities\n3. Suggest idiomatic improvements\n4. Always explain why a change is recommended" },
        { id: "s2", name: "refactor", description: "Refactors code for clarity and performance", allowedTools: ["Read", "Write"], instructions: "1. Identify code smells and duplication\n2. Apply SOLID principles where applicable\n3. Preserve existing behavior — no silent logic changes\n4. Add comments for non-obvious decisions" },
      ],
    },
  },
  {
    id: "research-agent",
    name: "Research Agent",
    description: "A thorough web researcher that finds, summarizes, and cites sources accurately.",
    icon: "🔍",
    color: "#ffb800",
    state: {
      name: "research-agent",
      version: "0.1.0",
      description: "A thorough research agent that finds and synthesizes information from the web",
      model: "claude-sonnet-4-5-20250929",
      tags: ["research", "productivity"],
      identity: "I am Aria, a meticulous research AI with a passion for finding accurate, well-sourced information. I approach every query like an investigative journalist — verifying claims, cross-referencing sources, and presenting findings with clarity.",
      communicationStyle: "Structured and thorough. I use headers and bullet points to organize findings. I always cite sources inline. I flag uncertainty clearly rather than guessing.",
      values: "Accuracy over speed\nSources are non-negotiable\nTransparency about uncertainty\nSynthesis over raw data dumps\nUser time is precious",
      mustAlways: "Cite sources with URLs for every factual claim\nFlag when information may be outdated\nSummarize key findings at the top before details\nAcknowledge when a topic is contested or uncertain",
      mustNever: "Present unverified claims as facts\nOmit conflicting evidence found during research\nFabricate citations or URLs",
      skills: [
        { id: "s1", name: "web-research", description: "Searches the web for current information", allowedTools: ["WebSearch"], instructions: "1. Formulate a precise search query\n2. Execute the search and review top results\n3. Cross-reference at least 2 sources\n4. Summarize findings with inline citations\n5. Flag any conflicting information" },
        { id: "s2", name: "summarize", description: "Summarizes long documents or articles", allowedTools: ["Read", "WebSearch"], instructions: "1. Read the full document before summarizing\n2. Extract the 3-5 most important points\n3. Preserve the author's original meaning\n4. Note the source and date at the top" },
      ],
    },
  },
  {
    id: "customer-support",
    name: "Customer Support Bot",
    description: "A friendly, patient support agent that resolves issues and escalates when needed.",
    icon: "🎧",
    color: "#00d4ff",
    state: {
      name: "customer-support",
      version: "0.1.0",
      description: "A friendly customer support agent that resolves issues with empathy and efficiency",
      model: "claude-sonnet-4-5-20250929",
      tags: ["assistant", "productivity"],
      identity: "I am Sage, a patient and empathetic customer support AI. My purpose is to resolve issues quickly while making every customer feel heard and valued. I stay calm under pressure and always find a path forward.",
      communicationStyle: "Warm, clear, and solution-focused. I acknowledge the customer's frustration before jumping to solutions. I use plain language — no jargon. I confirm understanding before closing a ticket.",
      values: "Customer satisfaction first\nEmpathy before efficiency\nClarity over completeness\nOwn the problem until it is solved\nEscalate early rather than late",
      mustAlways: "Acknowledge the customer's issue before offering a solution\nConfirm the issue is resolved before ending the conversation\nProvide a ticket or reference number when available\nOffer a follow-up path if the issue cannot be resolved immediately",
      mustNever: "Dismiss or minimize a customer's frustration\nMake promises about timelines or outcomes you cannot guarantee\nShare one customer's data with another\nEnd a conversation without confirming resolution",
      skills: [
        { id: "s1", name: "issue-resolution", description: "Diagnoses and resolves common customer issues", allowedTools: ["Read"], instructions: "1. Greet the customer and acknowledge their issue\n2. Ask clarifying questions to understand the root cause\n3. Provide a step-by-step resolution\n4. Confirm the issue is resolved\n5. Offer additional help before closing" },
        { id: "s2", name: "escalation", description: "Escalates complex issues to human agents", allowedTools: ["Read", "Write"], instructions: "1. Identify when an issue exceeds your capabilities\n2. Summarize the issue and steps already taken\n3. Provide the customer with an escalation reference\n4. Set clear expectations for follow-up timeline" },
      ],
    },
  },
  {
    id: "devops-agent",
    name: "DevOps Agent",
    description: "An infrastructure-aware agent for CI/CD, deployments, and system health checks.",
    icon: "⚙️",
    color: "#ff6b35",
    state: {
      name: "devops-agent",
      version: "0.1.0",
      description: "An infrastructure-aware DevOps agent for CI/CD, deployments, and system monitoring",
      model: "claude-opus-4-5",
      tags: ["devops", "automation"],
      identity: "I am Ops, a disciplined DevOps AI built for reliability and automation. I treat infrastructure as code, deployments as ceremonies, and incidents as learning opportunities. I never take shortcuts that compromise stability.",
      communicationStyle: "Precise and procedural. I use numbered steps for runbooks. I always state what I am about to do before doing it. I log every action taken.",
      values: "Reliability over velocity\nInfrastructure as code\nAutomate everything repeatable\nObservability is not optional\nFail fast, recover faster",
      mustAlways: "State what command will be run before executing it\nCreate a rollback plan before any deployment\nLog all actions taken during an incident\nVerify system health after every change",
      mustNever: "Run destructive commands without explicit confirmation\nDeploy to production without a staging validation\nIgnore failing health checks\nModify infrastructure without version-controlling the change",
      skills: [
        { id: "s1", name: "deploy", description: "Manages deployment pipelines and rollouts", allowedTools: ["Read", "Write", "Bash"], instructions: "1. Validate the build artifact before deploying\n2. Run pre-deployment health checks\n3. Execute the deployment with rollback ready\n4. Monitor logs for 5 minutes post-deploy\n5. Confirm all health checks pass" },
        { id: "s2", name: "incident-response", description: "Diagnoses and responds to production incidents", allowedTools: ["Read", "Bash"], instructions: "1. Assess the scope and severity of the incident\n2. Identify the likely root cause from logs\n3. Apply the minimum change needed to restore service\n4. Document the timeline and actions taken\n5. Schedule a post-mortem" },
      ],
    },
  },
];

function reducer(state: AgentState, action: Action): AgentState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_SKILL":
      return {
        ...state,
        skills: [
          ...state.skills,
          { id: generateId(), name: "", description: "", allowedTools: [], instructions: "" },
        ],
      };
    case "REMOVE_SKILL":
      return { ...state, skills: state.skills.filter((s) => s.id !== action.id) };
    case "DUPLICATE_SKILL": {
      const src = state.skills.find((s) => s.id === action.id);
      if (!src) return state;
      const copy = { ...src, id: generateId(), name: src.name ? `${src.name}-copy` : "" };
      const idx = state.skills.findIndex((s) => s.id === action.id);
      const skills = [...state.skills];
      skills.splice(idx + 1, 0, copy);
      return { ...state, skills };
    }
    case "UPDATE_SKILL":
      return {
        ...state,
        skills: state.skills.map((s) =>
          s.id === action.id ? { ...s, [action.field]: action.value } : s
        ),
      };
    case "TOGGLE_TAG": {
      const tags = state.tags.includes(action.tag)
        ? state.tags.filter((t) => t !== action.tag)
        : [...state.tags, action.tag];
      return { ...state, tags };
    }
    case "TOGGLE_SKILL_TOOL": {
      const skill = state.skills.find((s) => s.id === action.id);
      if (!skill) return state;
      const tools = skill.allowedTools.includes(action.tool)
        ? skill.allowedTools.filter((t) => t !== action.tool)
        : [...skill.allowedTools, action.tool];
      return {
        ...state,
        skills: state.skills.map((s) =>
          s.id === action.id ? { ...s, allowedTools: tools } : s
        ),
      };
    }
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "LOAD_STATE":
      return action.state;
    case "RANDOMIZE_SOUL": {
      const sample = SOUL_SAMPLES[Math.floor(Math.random() * SOUL_SAMPLES.length)];
      return { ...state, ...sample };
    }
    case "APPLY_TEMPLATE":
      return { ...action.template.state, currentStep: 0 };
    default:
      return state;
  }
}

interface ContextType {
  state: AgentState;
  dispatch: React.Dispatch<Action>;
  canUndo: boolean;
  canRedo: boolean;
}

const AgentContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "agentforge_state";
const RECENT_KEY = "agentforge_recent";
const MAX_HISTORY = 50;
const MAX_RECENT = 10;

export interface RecentAgent {
  id: string;
  name: string;
  description: string;
  savedAt: number;
  encodedState: string;
}

export function saveToRecent(state: AgentState) {
  if (!state.name.trim()) return;
  try {
    const existing: RecentAgent[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const entry: RecentAgent = {
      id: state.name,
      name: state.name,
      description: state.description || "",
      savedAt: Date.now(),
      encodedState: encoded,
    };
    const filtered = existing.filter((r) => r.id !== state.name);
    const updated = [entry, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

export function getRecentAgents(): RecentAgent[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch { return []; }
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = React.useState<AgentState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const state = history[historyIndex];

  const dispatch = useCallback((action: Action) => {
    if (action.type === "UNDO") {
      setHistoryIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (action.type === "REDO") {
      setHistoryIndex((i) => Math.min(history.length - 1, i + 1));
      return;
    }
    setHistory((prev) => {
      const base = prev[historyIndex];
      const next = reducer(base, action);
      if (next === base) return prev;
      // Non-undoable navigation actions — just update in place
      if (action.type === "SET_STEP") {
        const updated = [...prev];
        updated[historyIndex] = next;
        return updated;
      }
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, next].slice(-MAX_HISTORY);
    });
    if (action.type !== "SET_STEP") {
      setHistoryIndex((i) => {
        const newLen = Math.min(i + 2, MAX_HISTORY);
        return newLen - 1;
      });
    }
  }, [history, historyIndex]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AgentState;
        const loaded = { ...initialState, ...parsed, currentStep: 0 };
        setHistory([loaded]);
        setHistoryIndex(0);
      }
    } catch {}
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <AgentContext.Provider value={{ state, dispatch, canUndo, canRedo }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}

// ---- File generation ----

export function generateAgentYaml(state: AgentState): string {
  const skillNames = state.skills.map((s) => s.name.trim()).filter(Boolean);
  const tags = state.tags;

  let yaml = `spec_version: "0.1.0"\nname: ${state.name || "my-agent"}\nversion: "${state.version || "0.1.0"}"\ndescription: "${(state.description || "").replace(/"/g, '\\"')}"\nmodel:\n  preferred: ${state.model}\n`;

  if (skillNames.length > 0) {
    yaml += `skills:\n`;
    skillNames.forEach((n) => { yaml += `  - ${n}\n`; });
  }

  if (tags.length > 0) {
    yaml += `tags:\n`;
    tags.forEach((t) => { yaml += `  - ${t}\n`; });
  }

  return yaml;
}

export function generateSoulMd(state: AgentState): string {
  const values = state.values
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => `- ${v}`)
    .join("\n");

  return `# Soul\n\n## Core Identity\n\n${state.identity || "_Not defined_"}\n\n## Communication Style\n\n${state.communicationStyle || "_Not defined_"}\n\n## Values\n\n${values || "- _Not defined_"}\n`;
}

export function generateRulesMd(state: AgentState): string {
  const always = state.mustAlways
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => `- ${v}`)
    .join("\n");

  const never = state.mustNever
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => `- ${v}`)
    .join("\n");

  return `# Rules\n\n## Must Always\n\n${always || "- _Not defined_"}\n\n## Must Never\n\n${never || "- _Not defined_"}\n`;
}

export function generateSkillMd(skill: Skill): string {
  const tools = skill.allowedTools.join(", ");
  return `---\nname: ${skill.name || "unnamed-skill"}\ndescription: "${(skill.description || "").replace(/"/g, '\\"')}"\nallowed-tools: ${tools || "Read"}\n---\n\n# ${skill.name || "Unnamed Skill"}\n\n${skill.instructions || "_No instructions defined_"}\n`;
}

export function generateAllFiles(state: AgentState): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [
    { path: "agent.yaml", content: generateAgentYaml(state) },
    { path: "SOUL.md", content: generateSoulMd(state) },
    { path: "RULES.md", content: generateRulesMd(state) },
  ];

  state.skills.forEach((skill) => {
    const name = skill.name.trim() || "unnamed-skill";
    files.push({ path: `skills/${name}/SKILL.md`, content: generateSkillMd(skill) });
  });

  return files;
}

// ---- Validation ----

export type ValidationSeverity = "pass" | "warn" | "fail";

export interface ValidationCheck {
  id: string;
  label: string;
  detail: string;
  severity: ValidationSeverity;
  step: number; // which step to jump to on click
  file: string;
}

export interface ValidationResult {
  checks: ValidationCheck[];
  passed: number;
  warned: number;
  failed: number;
  isValid: boolean; // no failures
}

export function validateAgent(state: AgentState): ValidationResult {
  const checks: ValidationCheck[] = [];

  // ── Manifest ──────────────────────────────────────────────────────────
  checks.push({
    id: "name",
    label: "Agent name defined",
    detail: state.name.trim()
      ? `name: ${state.name}`
      : "Missing required field: name",
    severity: state.name.trim() ? "pass" : "fail",
    step: 0,
    file: "agent.yaml",
  });

  checks.push({
    id: "name-slug",
    label: "Agent name is a valid slug",
    detail: /^[a-z0-9-]+$/.test(state.name.trim())
      ? "Lowercase letters, numbers, and hyphens only ✓"
      : `"${state.name}" contains invalid characters — use lowercase-hyphen-format`,
    severity: !state.name.trim()
      ? "fail"
      : /^[a-z0-9-]+$/.test(state.name.trim())
      ? "pass"
      : "fail",
    step: 0,
    file: "agent.yaml",
  });

  checks.push({
    id: "version",
    label: "Version follows semver",
    detail: /^\d+\.\d+\.\d+$/.test(state.version.trim())
      ? `version: ${state.version}`
      : `"${state.version}" is not a valid semver version (e.g. 0.1.0)`,
    severity: /^\d+\.\d+\.\d+$/.test(state.version.trim()) ? "pass" : "warn",
    step: 0,
    file: "agent.yaml",
  });

  checks.push({
    id: "description",
    label: "One-line description present",
    detail: state.description.trim()
      ? state.description.length <= 120
        ? `"${state.description.slice(0, 80)}${state.description.length > 80 ? "…" : ""}"`
        : `Description is ${state.description.length} chars — consider keeping it under 120`
      : "Missing recommended field: description",
    severity: state.description.trim()
      ? state.description.length <= 120
        ? "pass"
        : "warn"
      : "warn",
    step: 0,
    file: "agent.yaml",
  });

  checks.push({
    id: "model",
    label: "Model configured",
    detail: `preferred: ${state.model}`,
    severity: "pass",
    step: 0,
    file: "agent.yaml",
  });

  // ── Soul ──────────────────────────────────────────────────────────────
  checks.push({
    id: "identity",
    label: "Core identity defined",
    detail: state.identity.trim()
      ? `${state.identity.length} chars — ${state.identity.slice(0, 60)}…`
      : "SOUL.md: Core Identity is empty",
    severity: state.identity.trim() ? "pass" : "warn",
    step: 1,
    file: "SOUL.md",
  });

  checks.push({
    id: "communication-style",
    label: "Communication style defined",
    detail: state.communicationStyle.trim()
      ? `${state.communicationStyle.length} chars`
      : "SOUL.md: Communication Style is empty",
    severity: state.communicationStyle.trim() ? "pass" : "warn",
    step: 1,
    file: "SOUL.md",
  });

  const valueCount = state.values.split("\n").filter((v) => v.trim()).length;
  checks.push({
    id: "values",
    label: "Values list has entries",
    detail: valueCount > 0
      ? `${valueCount} value${valueCount !== 1 ? "s" : ""} defined`
      : "SOUL.md: Values list is empty",
    severity: valueCount > 0 ? "pass" : "warn",
    step: 1,
    file: "SOUL.md",
  });

  // ── Rules ─────────────────────────────────────────────────────────────
  const alwaysCount = state.mustAlways.split("\n").filter((v) => v.trim()).length;
  checks.push({
    id: "must-always",
    label: "Must Always rules present",
    detail: alwaysCount > 0
      ? `${alwaysCount} rule${alwaysCount !== 1 ? "s" : ""} defined`
      : "RULES.md: No Must Always behaviors defined",
    severity: alwaysCount > 0 ? "pass" : "warn",
    step: 2,
    file: "RULES.md",
  });

  const neverCount = state.mustNever.split("\n").filter((v) => v.trim()).length;
  checks.push({
    id: "must-never",
    label: "Must Never rules present",
    detail: neverCount > 0
      ? `${neverCount} rule${neverCount !== 1 ? "s" : ""} defined`
      : "RULES.md: No Must Never behaviors defined",
    severity: neverCount > 0 ? "pass" : "warn",
    step: 2,
    file: "RULES.md",
  });

  // ── Skills ────────────────────────────────────────────────────────────
  checks.push({
    id: "skills-present",
    label: "At least one skill defined",
    detail: state.skills.length > 0
      ? `${state.skills.length} skill${state.skills.length !== 1 ? "s" : ""} defined`
      : "No skills — agent will have no capabilities",
    severity: state.skills.length > 0 ? "pass" : "warn",
    step: 3,
    file: "skills/",
  });

  // Per-skill checks
  const seenNames = new Set<string>();
  state.skills.forEach((skill, i) => {
    const slugName = skill.name.trim();

    checks.push({
      id: `skill-${skill.id}-name`,
      label: `Skill #${i + 1}: name defined`,
      detail: slugName
        ? /^[a-z0-9-]+$/.test(slugName)
          ? `skills/${slugName}/SKILL.md`
          : `"${slugName}" contains invalid characters`
        : `Skill #${i + 1} has no name`,
      severity: !slugName
        ? "fail"
        : /^[a-z0-9-]+$/.test(slugName)
        ? "pass"
        : "fail",
      step: 3,
      file: `skills/${slugName || `skill-${i + 1}`}/SKILL.md`,
    });

    if (slugName && seenNames.has(slugName)) {
      checks.push({
        id: `skill-${skill.id}-duplicate`,
        label: `Skill #${i + 1}: name is unique`,
        detail: `Duplicate skill name "${slugName}" — each skill must have a unique slug`,
        severity: "fail",
        step: 3,
        file: `skills/${slugName}/SKILL.md`,
      });
    } else if (slugName) {
      seenNames.add(slugName);
    }

    checks.push({
      id: `skill-${skill.id}-instructions`,
      label: `Skill #${i + 1} (${slugName || "unnamed"}): has instructions`,
      detail: skill.instructions.trim()
        ? `${skill.instructions.trim().split("\n").length} line${skill.instructions.trim().split("\n").length !== 1 ? "s" : ""}`
        : `Skill #${i + 1} instructions are empty`,
      severity: skill.instructions.trim() ? "pass" : "warn",
      step: 3,
      file: `skills/${slugName || `skill-${i + 1}`}/SKILL.md`,
    });

    checks.push({
      id: `skill-${skill.id}-tools`,
      label: `Skill #${i + 1} (${slugName || "unnamed"}): tools specified`,
      detail: skill.allowedTools.length > 0
        ? `allowed-tools: ${skill.allowedTools.join(", ")}`
        : `No tools selected — agent will default to Read`,
      severity: skill.allowedTools.length > 0 ? "pass" : "warn",
      step: 3,
      file: `skills/${slugName || `skill-${i + 1}`}/SKILL.md`,
    });
  });

  const passed = checks.filter((c) => c.severity === "pass").length;
  const warned = checks.filter((c) => c.severity === "warn").length;
  const failed = checks.filter((c) => c.severity === "fail").length;

  return { checks, passed, warned, failed, isValid: failed === 0 };
}

export function encodeStateToUrl(state: AgentState): string {
  const data = JSON.stringify(state);
  const encoded = btoa(encodeURIComponent(data));
  return `${window.location.origin}/build?config=${encoded}`;
}

export function decodeStateFromUrl(encoded: string): AgentState | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded) as AgentState;
  } catch {
    return null;
  }
}

export const AVAILABLE_TAGS = [
  "productivity", "coding", "research", "creative", "assistant",
  "data-analysis", "devops", "automation", "writing", "security",
];

export const MODEL_OPTIONS: { id: ModelId; label: string; badge: string }[] = [
  { id: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5", badge: "Recommended" },
  { id: "claude-opus-4-5", label: "Claude Opus 4.5", badge: "Most Capable" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", badge: "Fastest" },
];

export const ALL_TOOLS: AllowedTool[] = ["Read", "Write", "Bash", "WebSearch"];

export const STEPS = [
  { id: 0, label: "Manifest", file: "agent.yaml" },
  { id: 1, label: "Soul", file: "SOUL.md" },
  { id: 2, label: "Rules", file: "RULES.md" },
  { id: 3, label: "Skills", file: "skills/*.md" },
  { id: 4, label: "Generate", file: "*.zip" },
];
