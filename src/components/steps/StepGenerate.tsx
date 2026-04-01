"use client";

import { useAgent, generateAllFiles, encodeStateToUrl } from "@/lib/AgentContext";
import { useState } from "react";
import {
  Download, Copy, Check, Share2, Package,
  File, Folder, FolderOpen, Terminal as TerminalIcon, ChevronLeft
} from "lucide-react";
import hljs from "highlight.js/lib/core";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
import ValidationPanel from "@/components/ValidationPanel";

hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("markdown", markdown);

function getLanguage(path: string) {
  if (path.endsWith(".yaml") || path.endsWith(".yml")) return "yaml";
  return "markdown";
}

function getFileIcon(path: string) {
  if (path.endsWith(".yaml")) return { icon: File, color: "#ffb800" };
  if (path.includes("SOUL")) return { icon: File, color: "#00ff88" };
  if (path.includes("RULES")) return { icon: File, color: "#ff4444" };
  if (path.includes("SKILL")) return { icon: File, color: "#00d4ff" };
  return { icon: File, color: "#888888" };
}

interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileTreeNode[];
}

function buildTree(files: { path: string; content: string }[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  files.forEach(({ path }) => {
    const parts = path.split("/");
    let current = root;
    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      const fullPath = parts.slice(0, i + 1).join("/");
      let node = current.find((n) => n.name === part);
      if (!node) {
        node = { name: part, path: fullPath, isDir: !isLast, children: isLast ? undefined : [] };
        current.push(node);
      }
      if (!isLast) current = node.children!;
    });
  });

  return root;
}

function FileTreeNode({
  node, depth, selected, onSelect, expandedDirs, toggleDir
}: {
  node: FileTreeNode;
  depth: number;
  selected: string;
  onSelect: (p: string) => void;
  expandedDirs: Set<string>;
  toggleDir: (p: string) => void;
}) {
  const isExpanded = expandedDirs.has(node.path);

  if (node.isDir) {
    const FolderIcon = isExpanded ? FolderOpen : Folder;
    return (
      <div>
        <div
          className="file-tree-item"
          style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
          onClick={() => toggleDir(node.path)}
        >
          <FolderIcon size={13} color="#888" />
          <span>{node.name}</span>
        </div>
        {isExpanded && node.children?.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            selected={selected}
            onSelect={onSelect}
            expandedDirs={expandedDirs}
            toggleDir={toggleDir}
          />
        ))}
      </div>
    );
  }

  const { icon: FileIcon, color } = getFileIcon(node.path);
  return (
    <div
      className={`file-tree-item ${selected === node.path ? "active" : ""}`}
      style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
      onClick={() => onSelect(node.path)}
    >
      <FileIcon size={13} color={selected === node.path ? "var(--accent-green)" : color} />
      <span>{node.name}</span>
    </div>
  );
}

export default function StepGenerate() {
  const { state, dispatch } = useAgent();
  const files = generateAllFiles(state);
  const [selectedFile, setSelectedFile] = useState(files[0]?.path || "");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(["skills"]));

  const tree = buildTree(files);
  const currentFile = files.find((f) => f.path === selectedFile);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const highlighted = currentFile
    ? hljs.highlight(currentFile.content, { language: getLanguage(currentFile.path) }).value
    : "";

  const copyFile = async (path: string) => {
    const file = files.find((f) => f.path === path);
    if (!file) return;
    await navigator.clipboard.writeText(file.content);
    setCopiedFile(path);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const downloadZip = async () => {
    setDownloading(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      files.forEach(({ path, content }) => zip.file(path, content));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.name || "my-agent"}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const shareAgent = async () => {
    const url = encodeStateToUrl(state);
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const lines = (currentFile?.content || "").split("\n");

  const agentName = state.name || "my-agent";
  const deployCommands = [
    { comment: "# Unzip your downloaded agent", cmd: `Expand-Archive ${agentName}.zip -DestinationPath ./${agentName}` },
    { comment: "# Validate with local validator (no install needed)", cmd: `node gitagent-validate.js ./${agentName}` },
    { comment: "# Or run the agent once gitclaw is available", cmd: `gitclaw run ./${agentName}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Package size={20} color="var(--accent-green)" />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Generate & Download</h2>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.7rem",
            background: "var(--accent-green-dim)", color: "var(--accent-green)",
            border: "1px solid var(--accent-green-border)",
            padding: "0.15rem 0.5rem", borderRadius: "4px",
          }}>
            {files.length} file{files.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button className="btn-secondary" onClick={shareAgent} style={{ fontSize: "0.78rem", padding: "0.4rem 0.875rem" }}>
            {shared ? <Check size={14} color="var(--accent-green)" /> : <Share2 size={14} />}
            {shared ? "Copied!" : "Share"}
          </button>
          <button
            className="btn-primary"
            onClick={downloadZip}
            disabled={downloading}
            style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", position: "relative" }}
          >
            {downloading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite", border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", width: 14, height: 14 }} />
                Packaging...
              </>
            ) : (
              <>
                <Download size={15} />
                Download ZIP
              </>
            )}
          </button>
        </div>
      </div>

      {/* File explorer */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "0",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        minHeight: "480px",
      }}>
        {/* Sidebar - File tree */}
        <div style={{
          background: "#0d0d0d",
          borderRight: "1px solid var(--border)",
          padding: "0.5rem 0",
          overflowY: "auto",
        }}>
          <div style={{
            padding: "0.5rem 0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.25rem",
          }}>
            Explorer
          </div>
          {tree.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              depth={0}
              selected={selectedFile}
              onSelect={setSelectedFile}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
            />
          ))}
        </div>

        {/* Code panel */}
        <div style={{ display: "flex", flexDirection: "column", background: "#060606" }}>
          {/* Tab bar */}
          <div style={{
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            background: "#0d0d0d",
            overflowX: "auto",
          }}>
            {files.map((f) => (
              <button
                key={f.path}
                onClick={() => setSelectedFile(f.path)}
                style={{
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  border: "none",
                  borderBottom: selectedFile === f.path ? "2px solid var(--accent-green)" : "2px solid transparent",
                  background: selectedFile === f.path ? "#060606" : "transparent",
                  color: selectedFile === f.path ? "var(--text-primary)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                  transition: "all var(--transition)",
                }}
              >
                {f.path.split("/").pop()}
              </button>
            ))}
          </div>

          {/* File path + copy */}
          <div style={{
            padding: "0.4rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
            background: "#0a0a0a",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {selectedFile}
            </span>
            <button
              className="btn-ghost"
              onClick={() => copyFile(selectedFile)}
              style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
            >
              {copiedFile === selectedFile
                ? <><Check size={12} color="var(--accent-green)" /> Copied</>
                : <><Copy size={12} /> Copy</>
              }
            </button>
          </div>

          {/* Code content */}
          <div style={{ flex: 1, overflow: "auto", padding: "1rem 0" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
              <tbody>
                {lines.map((_, i) => (
                  <tr key={i} style={{ display: "flex" }}>
                    <td className="line-number" style={{ width: "3rem", flexShrink: 0, paddingLeft: "0.75rem", paddingRight: "0.75rem", borderRight: "1px solid var(--border)", marginRight: "1rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", userSelect: "none", textAlign: "right" }}>
                      {i + 1}
                    </td>
                    <td style={{ flex: 1, paddingRight: "1rem" }}>
                      <span
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre" }}
                        dangerouslySetInnerHTML={{
                          __html: hljs.highlight(lines[i], { language: getLanguage(selectedFile) }).value || "&nbsp;",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Validation Panel */}
      <div className="card">
        <ValidationPanel onJumpToStep={(step) => dispatch({ type: "SET_STEP", step })} />
      </div>

      {/* Deploy commands */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <TerminalIcon size={16} color="var(--accent-green)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Deploy Commands</span>
        </div>
        <div className="terminal-block">
          <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>
          {deployCommands.map((dc, i) => (
            <div key={i} style={{ marginBottom: "0.75rem" }}>
              <div className="terminal-comment">{dc.comment}</div>
              <div>
                <span className="terminal-prompt">$ </span>
                <span className="terminal-cmd">{dc.cmd}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to edit */}
      <button
        className="btn-ghost"
        onClick={() => dispatch({ type: "SET_STEP", step: 3 })}
        style={{ alignSelf: "flex-start" }}
      >
        <ChevronLeft size={14} />
        Back to Skills
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .hljs-attr { color: #00d4ff; }
        .hljs-string { color: #00ff88; }
        .hljs-number { color: #ffb800; }
        .hljs-literal { color: #ff6b35; }
        .hljs-comment { color: #555; font-style: italic; }
        .hljs-bullet { color: #00ff88; }
        .hljs-section { color: #ffb800; font-weight: bold; }
        .hljs-title { color: #00d4ff; }
        .hljs-keyword { color: #ff6b35; }
      `}</style>
    </div>
  );
}
