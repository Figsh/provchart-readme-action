import fs from "node:fs";
import path from "node:path";

const apiKey =
  process.env.INPUT_API_KEY ||
  process.env.PROVCHART_API_KEY ||
  "";
const configPath = process.env.INPUT_CONFIG || ".provchart/charts.json";
const outputDir = process.env.INPUT_OUTPUT_DIR || "docs/charts";
const apiBase = (
  process.env.INPUT_API_BASE || "https://provchart-api.devtem.org"
).replace(/\/$/, "");

function fail(msg) {
  console.error(`::error::${msg}`);
  process.exit(1);
}

function setOutput(name, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `${name}=${value}\n`);
  }
}

function loadConfigs(file) {
  if (!fs.existsSync(file)) fail(`Config not found: ${file}`);
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = Array.isArray(raw) ? raw : [raw];
  if (!list.length) fail("Config is empty");
  return list;
}

function slug(name, fallback) {
  const s = String(name || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || fallback;
}

async function generateSvg(payload) {
async function generateSvg(payload) {
  const res = await fetch(`${apiBase}/api/v1/generate-svg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  if (!res.ok || data.success === false) {
    const detail =
      data.error ||
      data.code ||
      data.message ||
      text.slice(0, 400) ||
      "(empty body)";
    throw new Error(`HTTP ${res.status} — ${detail}`);
  }
  if (!data.svg) {
    throw new Error(`HTTP ${res.status} — no svg in response: ${text.slice(0, 300)}`);
  }
  return data.svg;
}

async function main() {
  if (!apiKey) fail("Missing api-key / PROVCHART_API_KEY");

  const configs = loadConfigs(configPath);
  fs.mkdirSync(outputDir, { recursive: true });

  const written = [];

  for (let i = 0; i < configs.length; i++) {
    const entry = configs[i];
    // Allow { file, ...payload } or pure payload + auto name
    const { file, filename, ...payload } = entry;
    const outName =
      file ||
      filename ||
      `${slug(payload.type, "chart")}-${i + 1}.svg`;
    const outPath = path.join(outputDir, outName.endsWith(".svg") ? outName : `${outName}.svg`);

    console.log(`Generating ${outPath} ( ${payload.type || "chart"})…`);
    try {
      const svg = await generateSvg(payload);
      fs.writeFileSync(outPath, svg, "utf8");
      written.push(outPath);
      console.log(`Wrote ${outPath}`);
    } catch (err) {
      fail(`${outPath}: ${err.message}`);
    }
  }

  setOutput("files", written.join("\n"));
  console.log(`Done. ${written.length} file(s).`);
}

main().catch((err) => fail(err.message || String(err)));
