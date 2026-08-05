import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const ACTIVITY_START = "<!-- AUTO:ACTIVITY:START -->";
export const ACTIVITY_END = "<!-- AUTO:ACTIVITY:END -->";

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function badgeSegment(value) {
  return encodeURIComponent(String(value).replaceAll("-", "--").replaceAll("_", "__").replaceAll(" ", "_"));
}

const TECH_BADGES = {
  "Go": { logo: "go", color: "00ADD8" },
  "TypeScript": { logo: "typescript", color: "3178C6" },
  "JavaScript": { logo: "javascript", color: "F7DF1E", logoColor: "000000" },
  "Python": { logo: "python", color: "3776AB" },
  "Java": { logo: "openjdk", color: "ED8B00" },
  "C++": { logo: "cplusplus", color: "00599C" },
  "React": { logo: "react", color: "20232A" },
  "Next.js": { logo: "nextdotjs", color: "000000" },
  "Tailwind CSS": { logo: "tailwindcss", color: "06B6D4" },
  "PostgreSQL": { logo: "postgresql", color: "4169E1" },
  "MySQL": { logo: "mysql", color: "4479A1" },
  "Docker": { logo: "docker", color: "2496ED" },
  "Streamlit": { logo: "streamlit", color: "FF4B4B" },
  "NumPy": { logo: "numpy", color: "013243" },
  "Pandas": { logo: "pandas", color: "150458" },
  "Three.js": { logo: "threedotjs", color: "000000" },
  "Vite": { logo: "vite", color: "646CFF" },
  "Wireshark": { logo: "wireshark", color: "1679A7" },
  "Git": { logo: "git", color: "F05032" }
};

function renderTechStack(techStack) {
  return techStack.map((name) => {
    const badge = TECH_BADGES[name] || { logo: "", color: "0B1220" };
    const logoColor = badge.logoColor || "white";
    const logo = badge.logo ? `&logo=${encodeURIComponent(badge.logo)}&logoColor=${logoColor}` : "";
    const image = `https://img.shields.io/badge/-${badgeSegment(name)}-${badge.color}?style=for-the-badge${logo}`;
    return `<img alt="${name}" src="${image}">`;
  }).join(" ");
}

// The "linkedin" slug was pulled from Simple Icons (the library shields.io reads logos from),
// so the glyph is embedded directly as a data URI instead of referencing the slug by name.
const LINKEDIN_LOGO_DATA_URI = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgcm9sZT0iaW1nIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkxpbmtlZEluPC90aXRsZT48cGF0aCBkPSJNMjAuNDQ3IDIwLjQ1MmgtMy41NTR2LTUuNTY5YzAtMS4zMjgtLjAyNy0zLjAzNy0xLjg1Mi0zLjAzNy0xLjg1MyAwLTIuMTM2IDEuNDQ1LTIuMTM2IDIuOTM5djUuNjY3SDkuMzUxVjloMy40MTR2MS41NjFoLjA0NmMuNDc3LS45IDEuNjM3LTEuODUgMy4zNy0xLjg1IDMuNjAxIDAgNC4yNjcgMi4zNyA0LjI2NyA1LjQ1NXY2LjI4NnpNNS4zMzcgNy40MzNjLTEuMTQ0IDAtMi4wNjMtLjkyNi0yLjA2My0yLjA2NSAwLTEuMTM4LjkyLTIuMDYzIDIuMDYzLTIuMDYzIDEuMTQgMCAyLjA2NC45MjUgMi4wNjQgMi4wNjMgMCAxLjEzOS0uOTI1IDIuMDY1LTIuMDY0IDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4=";

function renderLinks(links) {
  return links.map((link) => {
    const logoParam = link.logo === "linkedin" ? LINKEDIN_LOGO_DATA_URI : link.logo;
    const logo = logoParam ? `&logo=${encodeURIComponent(logoParam)}&logoColor=white` : "";
    const image = `https://img.shields.io/badge/-${badgeSegment(link.value)}-${link.color}?style=for-the-badge${logo}`;
    return `  <a href="${link.url}"><img alt="${link.label}" src="${image}"></a>`;
  }).join("\n");
}

function renderFocus(focus) {
  return [
    "| Area | What I am exploring |",
    "| --- | --- |",
    ...focus.map((item) => `| **${escapeCell(item.name)}** | ${escapeCell(item.description)} |`)
  ].join("\n");
}

function renderProjects(projects) {
  return [
    "| Project | Focus | Why it matters |",
    "| --- | --- | --- |",
    ...projects.map((project) => {
      const homepage = project.homepage ? ` [Live](${project.homepage})` : "";
      return `| [**${escapeCell(project.name)}**](${project.url}) | ${escapeCell(project.focus)} | ${escapeCell(project.summary)}${homepage} |`;
    })
  ].join("\n");
}

function extractActivity(readme) {
  const startIndex = readme.indexOf(ACTIVITY_START);
  const endIndex = readme.indexOf(ACTIVITY_END);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return null;
  return readme.slice(startIndex + ACTIVITY_START.length, endIndex).trim();
}

async function readExistingActivity(readmePath) {
  try {
    const existing = await readFile(readmePath, "utf8");
    return extractActivity(existing);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function generateProfileReadme({ config, portraitPath, readmePath }) {
  const existingActivity = await readExistingActivity(readmePath);
  const activity = existingActivity || "_Recent public activity will appear here after the workflow runs._";
  const activitySection = config.activity.enabled
    ? `\n## Recent Activity\n\n${ACTIVITY_START}\n${activity}\n${ACTIVITY_END}\n`
    : "";
  const techStack = renderTechStack(config.techStack);
  const about = config.profile.about.join("\n\n");

  const readme = `<!-- Generated by GitHub Profile Agent Console. Edit profile.config.json, then run npm run generate. -->
<p align="center">
  <img src="./${portraitPath}" alt="${config.profile.name} - ${config.profile.headline}" width="220">
</p>

<p align="center">
${renderLinks(config.links)}
</p>

## About Me

${about}

## Current Focus

${renderFocus(config.focus)}

## Featured Work

${renderProjects(config.projects)}

## Research Direction

${config.research.narrative}

## Tech Stack

${techStack}
${activitySection}
---

<p align="center">
  ${config.footer}
</p>
`;

  await writeFile(resolve(readmePath), readme);
  return readme;
}
