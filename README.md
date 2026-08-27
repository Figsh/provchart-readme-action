# ProvChart README Action

Generate [ProvChart](https://chart.devtem.org) **SVG** charts in GitHub Actions and commit them for README/docs.

```yaml
- uses: fscss-ttr/provchart-readme-action@1.0.2
  with:
    api-key: ${{ secrets.PROVCHART_API_KEY }}
    config: .provchart/charts.json
    output-dir: docs/charts
```

Config entries = ProvChart `generate-svg` payloads plus optional `"file": "name.svg"`.

MIT · [chart.devtem.org](https://chart.devtem.org)
