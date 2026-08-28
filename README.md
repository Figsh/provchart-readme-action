# ProvChart README Action

Generate vector **SVG** charts with the [ProvChart](https://chart.devtem.org) API inside **GitHub Actions**, then commit them for live README and docs embeds.

No Chart.js. No screenshot bots. Pure SVG from JSON.

| | |
|---|---|
| **Action** | `fscss-ttr/provchart-readme-action` |
| **Sample repo (fork & test)** | [Figsh/provchart-charts](https://github.com/Figsh/provchart-charts/) |
| **API** | [chart.devtem.org](https://chart.devtem.org) |
| **License** | MIT |

---

## Try in 2 minutes (recommended)

1. **Fork** [github.com/Figsh/provchart-charts](https://github.com/Figsh/provchart-charts/)
2. Add a repository secret: **`PROVCHART_API_KEY`**  
   (Dashboard → [Developer API](https://chart.devtem.org/dashboard))
3. **Actions** → run **Test ProvChart Action** (workflow_dispatch)
4. SVGs land under `docs/charts/` and are committed automatically

That repo already has `.provchart/charts.json`, the workflow, and README embeds.

---

## Quick start (your own repo)

### 1. API key secret

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
|------|--------|
| `PROVCHART_API_KEY` | Your ProvChart API key |

### 2. Config — `.provchart/charts.json`

```json
[
  {
    "file": "demo.svg",
    "type": "area",
    "theme": "midnight",
    "width": 640,
    "height": 320,
    "axisX": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "series": [
      {
        "name": "API Requests",
        "color": "#8b7bff",
        "points": [20, 85, 40, 60, 10, 40, 95]
      },
      {
        "name": "Successful Responses",
        "color": "#34d399",
        "points": [15, 80, 38, 46, 6, 35, 79]
      }
    ]
  },
  {
    "file": "health-gauge.svg",
    "type": "gauge",
    "theme": "midnight",
    "width": 220,
    "height": 220,
    "label": "Health",
    "series": [
      { "name": "CPU", "value": 72, "color": "#ff5e7d" },
      { "name": "RAM", "value": 54, "color": "#4fd8c4" },
      { "name": "Disk", "value": 38, "color": "#8b7bff" }
    ]
  }
]
```

Each entry is a `POST /api/v1/generate-svg` payload plus optional `"file": "name.svg"`.  
Full multi-chart sample: [Figsh/provchart-charts](https://github.com/Figsh/provchart-charts/blob/main/.provchart/charts.json).

### 3. Workflow — `.github/workflows/charts.yml`

```yaml
name: Generate ProvChart README SVGs

on:
  push:
    paths:
      - ".provchart/**"
      - ".github/workflows/charts.yml"
  workflow_dispatch:
  # schedule:
  #   - cron: "0 6 * * 1"

permissions:
  contents: write

jobs:
  build-charts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate SVGs
        uses: fscss-ttr/provchart-readme-action@v1.0.4
        with:
          api-key: ${{ secrets.PROVCHART_API_KEY }}
          config: .provchart/charts.json
          output-dir: docs/charts

      - name: Commit generated charts
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update ProvChart SVGs"
          file_pattern: "docs/charts/*.svg"
```

Use the latest release tag from the action repo if newer than `v1.0.4`.

### 4. Embed in README

```markdown
![API week](./docs/charts/demo.svg)

![Health](./docs/charts/health-gauge.svg)
```

---

## Action inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api-key` | yes | — | ProvChart API key (`X-API-Key`) |
| `config` | no | `.provchart/charts.json` | Path to JSON (object or array) |
| `output-dir` | no | `docs/charts` | Where to write `.svg` files |
| `api-base` | no | `https://provchart-api.devtem.org` | API base URL |

---

## Config tips

- **Gauge size:** `width` / `height` **220** is a good README size (not too large).
- **Quota:** each chart = one generation (HTML and SVG share the monthly pool).
- **Themes:** e.g. `midnight`, `dark`, `light` (whatever your API supports).
- **Types:** `line`, `area`, `bar`, `stackedbar`, `hbar`, `scatter`, `combo`, `gauge`, …

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Missing api-key` | Repository secret `PROVCHART_API_KEY` + `with: api-key: ${{ secrets.PROVCHART_API_KEY }}` |
| `HTTP 403` + `Just a moment...` | Cloudflare Bot Fight / challenge on the API host — skip bots for `/api/*` |
| `INVALID_API_KEY` / plan errors | Check key and plan in the [dashboard](https://chart.devtem.org/dashboard) |
| `Invalid format` on `GITHUB_OUTPUT` | Use action **≥ v1.0.4** (multiline output fix) |

---

## Related

- [ProvChart](https://chart.devtem.org) — builder & docs  
- [Sample charts repo](https://github.com/Figsh/provchart-charts/) — fork to test  
- [provchart-mcp](https://github.com/fscss-ttr/provchart-mcp) — agent / MCP tools (under development)  
- [provchart-runtime](https://github.com/fscss-ttr/provchart-runtime) — optional HTML interactivity  

---

## License

MIT
