"use client";

import { useState, useRef } from "react";
import { useAgent, AgentState } from "@/lib/AgentContext";
import { X, Upload, FileText, AlertTriangle } from "lucide-react";

// Minimal YAML parser for agent.yaml structure
function parseAgentYaml(text: string): Partial<AgentState> {
  const result: Partial<AgentState> = {};
  const lines = text.split("\n");
  const get = (key: string) => {
    const line = lines.find((l) => l.trimStart().startsWith(key + ":"));
    if (!line) return "";
    return line.split(":").slice(1).join(":").trim().replace(/^["']|["']$/g, "");
  };
  result.name = get("name");
  result.version = get("version");
  result.description = get("description");
  const model = get("preferred") || get("model");
  if (model) result.model = model as AgentState["model"];
  // tags
  const tagStart = lines.findIndex((l) => l.trimStart().startsWith("tags:"));
  if (tagStart !== -1) {
    const tags: string[] = [];
    for (let i = tagStart + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.startsWith("- ")) tags.push(l.slice(2).trim());
      else if (!l.startsWith("#") && l !== "") break;
    }
    result.tags = tags;
  }
  return result;
}

export default function ImportYamlModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useAgent();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    setError("");
    if (!text.trim()) { setError("Paste your agent.yaml content above."); return; }
    try {
      const parsed = parseAgentYaml(text);
      if (!parsed.name) { setError("Could not find a 'name' field. Make sure this is a valid agent.yaml."); return; }
      dispatch({ type: "LOAD_STATE", state: { ...getBlankState(), ...parsed, currentStep: 0 } });
      onClose();
    } catch {
      setError("Failed to parse YAML. Check the format and try again.");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target?.result as string || "");
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "600px",
        display: "flex", flexDirection: "column",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <FileText size={18} color="var(--accent-amber)" />
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>Import agent.yaml</span>
          </div>
          <button className="btn-ghost" style={{ padding: "0.25rem" }} onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Paste your <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}>agent.yaml</code> content below, or upload the file. The manifest fields will be imported into the builder.
          </p>
          <textarea
            className="input-base textarea-base"
            style={{ minHeight: "200px", fontSize: "0.78rem" }}
            placeholder={"spec_version: \"0.1.0\"\nname: my-agent\nversion: \"0.1.0\"\ndescription: \"...\"\nmodel:\n  preferred: claude-sonnet-4-5-20250929\ntags:\n  - coding"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="btn-secondary" style={{ fontSize: "0.78rem" }} onClick={() => fileRef.current?.click()}>
              <Upload size={13} />
              Upload file
            </button>
            <input ref={fileRef} type="file" accept=".yaml,.yml" style={{ display: "none" }} onChange={handleFile} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>.yaml / .yml</span>
          </div>
          {error && (
            <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: "var(--radius-md)" }}>
              <AlertTriangle size={14} color="#ff4444" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "0.8rem", color: "#ff4444" }}>{error}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleImport}>Import</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBlankState(): AgentState {
  return {
    name: "", version: "0.1.0", description: "",
    model: "claude-sonnet-4-5-20250929", tags: [],
    identity: "", communicationStyle: "", values: "",
    mustAlways: "", mustNever: "", skills: [], currentStep: 0,
  };
}
