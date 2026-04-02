#!/usr/bin/env node
/**
 * gitagent-validate.js — Local validator for gitagent format agent repos
 * Usage: node gitagent-validate.js [agent-folder]
 * Example: node gitagent-validate.js ./my-coding-assistant
 */

const fs = require("fs");
const path = require("path");

// ── ANSI colors ────────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const PASS = c.green("✓ PASS");
const WARN = c.yellow("⚠ WARN");
const FAIL = c.red("✗ FAIL");

// ── Simple YAML key extractor (no dependencies needed) ─────────────────────────
function extractYamlField(content, key) {
  const match = content.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

function extractYamlList(content, key) {
  const lines = content.split("\n");
  const result = [];
  let inKey = false;
  for (const line of lines) {
    if (new RegExp(`^${key}:`).test(line)) { inKey = true; continue; }
    if (inKey) {
      const item = line.match(/^\s+-\s+(.+)/);
      if (item) result.push(item[1].trim());
      else if (/^\S/.test(line)) break;
    }
  }
  return result;
}

// ── Checks ─────────────────────────────────────────────────────────────────────
const checks = [];
let passed = 0, warned = 0, failed = 0;

function check(severity, label, detail) {
  checks.push({ severity, label, detail });
  if (severity === "pass") passed++;
  else if (severity === "warn") warned++;
  else failed++;
}

// ── Main ───────────────────────────────────────────────────────────────────────
const agentPath = process.argv[2] || ".";
const resolvedPath = path.resolve(agentPath);

console.log();
console.log(c.bold(`  gitagent validate`));
console.log(c.dim(`  Validating: ${resolvedPath}`));
console.log(c.dim("  ─".repeat(36)));
console.log();

// Check folder exists
if (!fs.existsSync(resolvedPath)) {
  console.log(c.red(`  Error: folder not found: ${resolvedPath}\n`));
  process.exit(1);
}

// ── agent.yaml ─────────────────────────────────────────────────────────────────
const yamlPath = path.join(resolvedPath, "agent.yaml");
const hasYaml = fs.existsSync(yamlPath);

check(hasYaml ? "pass" : "fail", "agent.yaml exists", hasYaml ? yamlPath : "Missing required file: agent.yaml");

if (hasYaml) {
  const yaml = fs.readFileSync(yamlPath, "utf-8");

  const name = extractYamlField(yaml, "name");
  const validSlug = name && /^[a-z0-9-]+$/.test(name);
  check(
    !name ? "fail" : validSlug ? "pass" : "fail",
    "name field present and valid slug",
    name ? (validSlug ? `name: ${name}` : `"${name}" — use lowercase-hyphen-format`) : "Missing required field: name"
  );

  const version = extractYamlField(yaml, "version");
  const validSemver = version && /^\d+\.\d+\.\d+$/.test(version);
  check(
    !version ? "warn" : validSemver ? "pass" : "warn",
    "version follows semver",
    version ? (validSemver ? `version: ${version}` : `"${version}" — expected semver e.g. 0.1.0`) : "Missing field: version"
  );

  const description = extractYamlField(yaml, "description");
  check(
    description ? (description.length <= 120 ? "pass" : "warn") : "warn",
    "description present and concise",
    description
      ? description.length <= 120
        ? `"${description.slice(0, 72)}${description.length > 72 ? "…" : ""}"`
        : `${description.length} chars — consider keeping under 120`
      : "Missing recommended field: description"
  );

  const specVersion = extractYamlField(yaml, "spec_version");
  check(
    specVersion ? "pass" : "warn",
    "spec_version declared",
    specVersion ? `spec_version: ${specVersion}` : "Missing optional field: spec_version"
  );

  const modelSection = yaml.includes("model:") && yaml.includes("preferred:");
  check(
    modelSection ? "pass" : "warn",
    "model.preferred configured",
    modelSection ? "model.preferred is set" : "model block missing — agent may use default"
  );

  const tags = extractYamlList(yaml, "tags");
  check(
    tags.length > 0 ? "pass" : "warn",
    "at least one tag defined",
    tags.length > 0 ? `tags: [${tags.join(", ")}]` : "No tags — add tags for discoverability"
  );
}

// ── SOUL.md ────────────────────────────────────────────────────────────────────
const soulPath = path.join(resolvedPath, "SOUL.md");
const hasSoul = fs.existsSync(soulPath);

check(hasSoul ? "pass" : "warn", "SOUL.md exists", hasSoul ? soulPath : "Missing recommended file: SOUL.md");

if (hasSoul) {
  const soul = fs.readFileSync(soulPath, "utf-8");
  const hasIdentity = soul.includes("## Core Identity") && soul.replace(/## Core Identity/, "").trim().length > 20;
  const hasStyle = soul.includes("## Communication Style");
  const hasValues = soul.includes("## Values");

  check(hasIdentity ? "pass" : "warn", "SOUL.md: Core Identity section", hasIdentity ? "Found" : "Empty or missing ## Core Identity");
  check(hasStyle ? "pass" : "warn", "SOUL.md: Communication Style section", hasStyle ? "Found" : "Missing ## Communication Style");
  check(hasValues ? "pass" : "warn", "SOUL.md: Values section", hasValues ? "Found" : "Missing ## Values");
}

// ── RULES.md ───────────────────────────────────────────────────────────────────
const rulesPath = path.join(resolvedPath, "RULES.md");
const hasRules = fs.existsSync(rulesPath);

check(hasRules ? "pass" : "warn", "RULES.md exists", hasRules ? rulesPath : "Missing recommended file: RULES.md");

if (hasRules) {
  const rules = fs.readFileSync(rulesPath, "utf-8");
  const hasAlways = rules.includes("## Must Always");
  const hasNever = rules.includes("## Must Never");
  check(hasAlways ? "pass" : "warn", "RULES.md: Must Always section", hasAlways ? "Found" : "Missing ## Must Always");
  check(hasNever ? "pass" : "warn", "RULES.md: Must Never section", hasNever ? "Found" : "Missing ## Must Never");
}

// ── skills/ ────────────────────────────────────────────────────────────────────
const skillsDir = path.join(resolvedPath, "skills");
const hasSkillsDir = fs.existsSync(skillsDir) && fs.statSync(skillsDir).isDirectory();

check(hasSkillsDir ? "pass" : "warn", "skills/ directory exists", hasSkillsDir ? skillsDir : "No skills/ directory — consider adding skills");

if (hasSkillsDir) {
  const skillFolders = fs.readdirSync(skillsDir).filter((f) => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });

  check(
    skillFolders.length > 0 ? "pass" : "warn",
    "skills/ has at least one skill",
    skillFolders.length > 0 ? `${skillFolders.length} skill(s): ${skillFolders.join(", ")}` : "No skill folders found"
  );

  const seenNames = new Set();
  skillFolders.forEach((folder) => {
    const skillMdPath = path.join(skillsDir, folder, "SKILL.md");
    const hasSkillMd = fs.existsSync(skillMdPath);

    check(
      /^[a-z0-9-]+$/.test(folder) ? "pass" : "fail",
      `skill "${folder}": valid slug name`,
      /^[a-z0-9-]+$/.test(folder) ? `skills/${folder}/` : `"${folder}" has invalid chars — use lowercase-hyphen-format`
    );

    if (seenNames.has(folder)) {
      check("fail", `skill "${folder}": unique name`, `Duplicate skill folder name "${folder}"`);
    } else {
      seenNames.add(folder);
    }

    check(
      hasSkillMd ? "pass" : "fail",
      `skill "${folder}": SKILL.md present`,
      hasSkillMd ? skillMdPath : `Missing required file: skills/${folder}/SKILL.md`
    );

    if (hasSkillMd) {
      const skillContent = fs.readFileSync(skillMdPath, "utf-8");
      const hasFrontmatter = skillContent.startsWith("---");
      const hasInstructions = skillContent.replace(/---[\s\S]*?---/, "").trim().length > 10;
      const hasAllowedTools = skillContent.includes("allowed-tools:");

      check(hasFrontmatter ? "pass" : "warn", `skill "${folder}": SKILL.md has frontmatter`, hasFrontmatter ? "YAML frontmatter found" : "Missing --- frontmatter block");
      check(hasAllowedTools ? "pass" : "warn", `skill "${folder}": allowed-tools specified`, hasAllowedTools ? "allowed-tools field found" : "No allowed-tools in frontmatter");
      check(hasInstructions ? "pass" : "warn", `skill "${folder}": has instructions`, hasInstructions ? `${skillContent.trim().split("\n").length} lines` : "Instructions section is empty");
    }
  });
}

// ── Summary ────────────────────────────────────────────────────────────────────
const total = checks.length;
const scorePercent = Math.round((passed / total) * 100);
const isValid = failed === 0;

console.log();
console.log(c.dim("  ─".repeat(36)));
console.log();

checks.forEach(({ severity, label, detail }) => {
  const badge = severity === "pass" ? PASS : severity === "warn" ? WARN : FAIL;
  console.log(`  ${badge}  ${c.bold(label)}`);
  console.log(`       ${c.dim(detail)}`);
});

console.log();
console.log(c.dim("  ─".repeat(36)));
console.log();

const scoreLine = `  Score: ${c.bold(`${scorePercent}%`)}  ${isValid ? c.green("✓ Valid") : c.red("✗ Invalid")}`;
console.log(scoreLine);
console.log(`  ${c.green(`${passed} passed`)}  ${c.yellow(`${warned} warnings`)}  ${c.red(`${failed} failed`)}  (${total} checks)`);
console.log();

if (isValid) {
  console.log(c.green("  ✓ Agent is valid and ready to run."));
  console.log();
  console.log(c.dim("  Next steps:"));
  console.log(c.dim("    npx gitagent info"));
  console.log(c.dim("    npm install gitclaw"));
  console.log(c.dim("    npm install clawless"));
} else {
  console.log(c.red(`  ✗ ${failed} error(s) must be fixed before running.`));
  if (warned > 0) {
    console.log(c.yellow(`  ⚠ ${warned} warning(s) — optional but recommended.`));
  }
  console.log();
  console.log(c.dim("  Fix the errors above and re-run:"));
  console.log(c.dim("    node gitagent-validate.js " + agentPath));
}

console.log();
process.exit(isValid ? 0 : 1);
