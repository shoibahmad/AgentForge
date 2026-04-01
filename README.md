# AgentForge — gitagent Studio

> **Build AI agents like you write code.** A polished, client-side studio for defining, previewing, validating, and packaging AI agents in the `gitagent` format — no backend, no sign-up, everything runs in your browser.

---

## What Is AgentForge?

AgentForge is a full-stack web application that guides you through a 5-step interactive builder to create a complete AI agent repository. Once configured, it generates all required files — `agent.yaml`, `SOUL.md`, `RULES.md`, and skill definitions — syntax-highlighted in a live VS Code-style editor, then bundles them into a downloadable ZIP. Your data never leaves your browser.

The output is a spec-compliant **gitagent** repository, ready to be run with `gitclaw` or deployed via `clawless`.

---

## The gitagent Ecosystem

AgentForge is built around three companion tools that form a complete agent development workflow:

| Tool | Role |
|---|---|
| **gitagent** | The specification format — defines how an AI agent repository is structured (files, frontmatter, schema) |
| **gitclaw** | The runtime — executes a gitagent repo locally (`gitclaw run ./my-agent`) |
| **clawless** | The deployment layer — deploys a gitagent repo to a serverless cloud environment |

AgentForge is the **visual IDE** that generates a valid gitagent repo without hand-writing any YAML or Markdown.

---

## Features

### 5-Step Agent Builder
A guided, multi-step form with animated step transitions and a persistent progress bar. Each step maps directly to a file in the agent repository.

| Step | Output File | What You Define |
|---|---|---|
| 1 — Manifest | `agent.yaml` | Agent slug, version, description, Claude model, tags |
| 2 — Soul | `SOUL.md` | Core identity, communication style, values |
| 3 — Rules | `RULES.md` | Must-always behaviors and must-never constraints |
| 4 — Skills | `skills/*/SKILL.md` | Dynamic skill cards with tools and instructions |
| 5 — Generate | All files | Preview, validate, download ZIP |

### Live File Preview  
A VS Code-style editor on Step 5 with:
- File tree explorer with collapsible `skills/` folder
- Tab bar for switching between all generated files
- Syntax-highlighted code view (YAML and Markdown) via **highlight.js**
- Line numbers on every row
- Per-file **Copy** button to clipboard

### In-Browser Agent Validation  
The **Agent Validation** panel (Step 5) runs a full spec compliance check against your configuration:
- Checks all required and recommended fields in `agent.yaml`
- Validates name as a lowercase slug (`[a-z0-9-]+`)
- Validates version as semver (`x.y.z`)
- Checks `SOUL.md` sections for content
- Checks `RULES.md` for must-always and must-never entries
- Validates each skill for name, instructions, and tool permissions
- Catches duplicate skill names
- Produces a **score (%)**, filterable **pass / warn / fail** rows, and a **jump-to-step** navigation on any failed check

### One-Click ZIP Download  
All files are bundled client-side into a `.zip` using **JSZip** — no server upload, no API call. The ZIP is named `<agent-name>.zip` and is ready to extract and run.

### Share via URL  
The full agent state is Base64-encoded into the URL query string. Clicking **Share** copies a link that, when opened, restores the exact same configuration across any browser.

### Auto-Save with localStorage  
State is automatically persisted to `localStorage` on every change. Refreshing the page or closing and reopening the tab restores exactly where you left off.

### Randomize Soul  
Step 2 includes a **Randomize Soul** button that fills the identity, communication style, and values fields with one of three built-in personas:
- **Aria** — creative storyteller AI
- **Forge** — no-nonsense engineering AI
- **Sage** — philosophical, Socratic AI

### Supported Claude Models

| Model ID | Label | Badge |
|---|---|---|
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 | Recommended |
| `claude-opus-4-5` | Claude Opus 4.5 | Most Capable |
| `claude-haiku-4-5` | Claude Haiku 4.5 | Fastest |

### Supported Skill Tools

Each skill can be granted any combination of the following tool permissions:

| Tool | Description |
|---|---|
| `Read` | Read files from the filesystem |
| `Write` | Write or modify files |
| `Bash` | Execute shell commands |
| `WebSearch` | Perform live web searches |

### Tags / Categories

Built-in agent tags for discoverability:
`productivity` · `coding` · `research` · `creative` · `assistant` · `data-analysis` · `devops` · `automation` · `writing` · `security`

---

## gitagent File Format Reference

### `agent.yaml`
The primary manifest for an agent repository.

```yaml
spec_version: "0.1.0"
name: my-agent              # lowercase-hyphen slug, required
version: "0.1.0"            # semver, required
description: "..."          # one-line summary, recommended (≤120 chars)
model:
  preferred: claude-haiku-4-5
tags:
  - coding
  - automation
skills:
  - my-skill-name
```

### `SOUL.md`
Defines the agent's personality and behavioral identity.

```markdown
# Soul

## Core Identity
Who the agent is, its persona, and purpose.

## Communication Style
How it communicates — tone, format, style preferences.

## Values
- Value one
- Value two
```

### `RULES.md`
Hard behavioral constraints for the agent.

```markdown
# Rules

## Must Always
- Cite sources when making factual claims
- Ask for clarification before destructive operations

## Must Never
- Execute code without user confirmation
- Share sensitive data
```

### `skills/<skill-name>/SKILL.md`
Each skill lives in its own folder with a frontmatter header.

```markdown
---
name: my-skill
description: "What this skill does"
allowed-tools: Read, Bash
---

# My Skill

Step-by-step instructions the agent follows when this skill is invoked.
```

---

## Local Validator CLI

Since `gitagent` is not a published npm package (it is a format specification), a real zero-dependency Node.js validator script is included.

### Usage

```powershell
# Validate an extracted agent folder
node gitagent-validate.js ./my-agent

# Validate the current directory
node gitagent-validate.js .
```

### What It Checks

The validator runs checks across all agent files and produces a colored terminal report:

**agent.yaml checks**
- File exists
- `name` is present and a valid slug
- `version` follows semver (`x.y.z`)
- `description` is present and ≤120 characters
- `spec_version` is declared
- `model.preferred` is configured
- At least one tag is defined

**SOUL.md checks**
- File exists
- `## Core Identity` section has content
- `## Communication Style` section present
- `## Values` section present

**RULES.md checks**
- File exists
- `## Must Always` section present
- `## Must Never` section present

**skills/ checks**
- `skills/` directory exists
- At least one skill folder is present
- Each skill folder name is a valid slug
- No duplicate skill folder names
- Each skill has a `SKILL.md` file
- Each `SKILL.md` has a YAML frontmatter block
- Each `SKILL.md` declares `allowed-tools`
- Each `SKILL.md` has non-empty instructions

### Example Output

```
  gitagent validate
  Validating: D:\my-agent

  ✓ PASS  agent.yaml exists
  ✓ PASS  name field present and valid slug
           name: my-coding-assistant
  ✓ PASS  version follows semver
           version: 0.1.0
  ✓ PASS  description present and concise
  ✓ PASS  model.preferred configured
  ✓ PASS  SOUL.md exists
  ✓ PASS  SOUL.md: Core Identity section
  ⚠ WARN  RULES.md: Must Never section
           Missing ## Must Never
  ✓ PASS  skill "code-review": SKILL.md present

  Score: 95%  ✓ Valid
  19 passed  1 warnings  0 failed  (20 checks)

  ✓ Agent is valid and ready to run.
  Next steps:
    gitclaw run ./my-agent
    clawless deploy ./my-agent
```

### Exit Codes

| Code | Meaning |
|---|---|
| `0` | Valid — no failures |
| `1` | Invalid — one or more FAIL checks |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16 (App Router) | React framework, routing, server components |
| **TypeScript** | 5 | Type safety across all components and logic |
| **Tailwind CSS** | 3 | Utility-class styling foundation |
| **Framer Motion** | Latest | Step transition animations, scroll reveals |
| **JSZip** | 3 | Client-side ZIP generation and download |
| **highlight.js** | Latest | Syntax highlighting (YAML + Markdown) |
| **Lucide React** | Latest | Icon set throughout the UI |
| **clawless** | Latest | Deployment integration (installed locally) |

### Design System

- **Font (Monospace):** JetBrains Mono — used for all code, terminals, labels, and form hints
- **Font (Interface):** Inter — used for headings and prose
- **Background:** `#0a0a0a` near-black with subtle dot-grid pattern
- **Accent Green:** `#00ff88` — primary actions, pass states, agent name branding
- **Accent Amber:** `#ffb800` — secondary highlights, warnings
- **Accent Cyan:** `#00d4ff` — skill indicators, tertiary accents
- **UI Paradigm:** Dark terminal aesthetic with glassmorphism card surfaces

### State Management

Agent state is managed through a custom `AgentContext` built with React's `useReducer` and `createContext`. The context handles:

- All form field updates via typed `SET_FIELD` actions
- Dynamic skill creation, deletion, and per-field updates
- Tool permission toggling per skill
- Tag multi-selection
- Step navigation
- Soul randomization
- Full state serialization for localStorage persistence
- Full state encoding / decoding for URL sharing

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### Installation

```bash
git clone <your-repo-url>
cd agent
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

Since the app is 100% client-side (no API routes, no database), it can also be exported as a static site:

```bash
npm run build
# Output is in .next/ — deploy to any static host
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — hero, feature overview, gitagent/gitclaw/clawless ecosystem explainer |
| `/build` | The 5-step agent builder |

---

## Workflow: Build → Validate → Download → Run

```
1. Open /build in AgentForge
2. Complete all 5 steps
3. On Step 5 — click "Validate Agent" to run spec checks
4. Fix any FAIL rows (click to jump to the relevant step)
5. Click "Download ZIP"
6. Extract the ZIP:
   Expand-Archive my-agent.zip -DestinationPath ./my-agent
7. Validate locally:
   node gitagent-validate.js ./my-agent
8. Run with gitclaw (when available):
   gitclaw run ./my-agent
9. Deploy with clawless (when available):
   clawless deploy ./my-agent
```

---

## Privacy

AgentForge collects **zero data**. Everything runs client-side:

- No API calls are made to any server
- No analytics or tracking scripts
- Agent configuration is only stored in your browser's `localStorage`
- The Share URL contains only the Base64-encoded agent state — no server stores it
- The ZIP is generated and downloaded entirely in your browser via JSZip

---

## Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Starts Next.js dev server with Turbopack at port 3000 |
| Build | `npm run build` | Creates optimized production bundle |
| Start | `npm start` | Serves the production build |
| Lint | `npm run lint` | Runs ESLint across the project |
| Validate agent | `node gitagent-validate.js <path>` | Runs local gitagent spec validation on an extracted agent folder |

---

## Environment

No environment variables are required. The app runs entirely client-side with no secrets or API keys needed.

---

## Browser Support

Tested and supported on:
- Chrome / Chromium 110+
- Firefox 115+
- Edge 110+
- Safari 16.4+

Requires:
- `localStorage` (for persistence)
- `navigator.clipboard` (for copy buttons — requires HTTPS or localhost)
- `URL.createObjectURL` (for ZIP download)

---

## Known Limitations

- `gitagent`, `gitclaw`, and `clawless` are not yet published npm packages — use `node gitagent-validate.js` for local validation
- The Share URL grows in length with more skills and longer content — very large agents may exceed browser URL length limits
- The syntax highlighter covers YAML and Markdown only; other file types would show unstyled

---

## Contributing

This project is organized as a standard Next.js App Router application. To add a new step, feature, or validation check:

- **New step:** Add a component to `src/components/steps/`, register it in `src/app/build/page.tsx`, and extend the `STEPS` array in `src/lib/AgentContext.tsx`
- **New validation rule:** Add a check to the `validateAgent()` function in `src/lib/AgentContext.tsx` and the corresponding check to `gitagent-validate.js`
- **New model:** Extend the `MODEL_OPTIONS` array and the `ModelId` union type in `src/lib/AgentContext.tsx`
- **New tool permission:** Add to the `AllowedTool` union type and `ALL_TOOLS` array in `src/lib/AgentContext.tsx`
- **New tag:** Add to the `AVAILABLE_TAGS` array in `src/lib/AgentContext.tsx`

---

## License

MIT — free to use, modify, and distribute.
