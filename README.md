# ProvChart README Action
Generate vector **SVG** charts using the ProvChart API inside GitHub Actions, automatically committing them to your repository for live README and documentation embeds.
## Quick Start
### 1. Add API Key Secret
Create a repository secret named PROVCHART_API_KEY under **Settings \rightarrow Secrets and variables \rightarrow Actions**.
### 2. Create Configuration File
Create .provchart/charts.json in your repository root:
```json
[
  {
    "file": "demo.svg",
    "type": "area",
    "theme": "midnight",
    "width": 480,
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
        "points": [15, 80, 38, 59, 5, 35, 79]
      }
    ]
  }
]

```
### 3. Add Workflow
Create .github/workflows/charts.yml:
```yaml
name: Generate ProvChart README SVGs

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-charts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate SVGs
        uses: fscss-ttr/provchart-readme-action@v1.0.3
        with:
          api-key: ${{ secrets.PROVCHART_API_KEY }}
          config: .provchart/charts.json
          output-dir: docs/charts

      - name: Commit updated charts
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update generated ProvChart SVGs"
          file_pattern: "docs/charts/*.svg"

```
## Action Inputs
| Input | Description | Required | Default |
|---|---|---|---|
| api-key | Your ProvChart API Key (X-API-Key). | **Yes** | — |
| config | Path to JSON config file (single chart or array). | No | .provchart/charts.json |
| output-dir | Directory where SVG files are saved. | No | docs/charts |
| api-base | ProvChart API base endpoint URL. | No | [https://provchart-api.devtem.org](https://provchart-api.devtem.org) |
## Action Outputs
| Output | Description |
|---|---|
| files | Newline-separated list of generated SVG file paths. |
## Usage in README
Embed the auto-generated SVG image directly in your markdown:
```markdown
![System Metrics](docs/charts/demo.svg)

```
---

MIT © fscss-ttr, DevTemple

