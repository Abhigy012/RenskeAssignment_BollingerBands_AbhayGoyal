# Bollinger Bands Chart — findscan-bollinger

A production-ready **Bollinger Bands** indicator built with **React 19**, **Next.js 15**, **TypeScript**, **TailwindCSS v4**, and **KLineCharts**.

---

## 🚀 Overview

This repository implements a polished, TradingView-inspired Bollinger Bands indicator that overlays directly on KLineCharts candles. It focuses on stability, performance, and an accessible UI using Radix components. The demo ships with 200+ OHLCV candles and supports live updates to inputs and styles.

**Stack**

* Next.js 15
* React 19
* TypeScript
* TailwindCSS v4
* KLineCharts 10.0.0-alpha5
* Radix UI, Lucide React, React Colorful
* clsx, tailwind-merge
* Turbopack for development

---

## 📁 Project Structure

```
bollinger-bands-chart/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         # Main page with controls and state management
├── components/
│   ├── BollingerSettings.tsx  # Settings modal with Inputs / Style tabs
│   └── Chart.tsx              # Chart wrapper with KLineCharts integration
├── indicators/
│   └── bollinger.ts     # Bollinger Bands calculation logic (exported calc)
├── public/
│   └── data/
│       └── ohlcv.json   # Demo OHLCV data (200+ candles)
├── package.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## ✨ Features

* Inputs:

  * Length (default: `20`)
  * MA type: **SMA** (fixed for this assignment)
  * Source: `Open` | `High` | `Low` | `Close` (default: `Close`)
  * StdDev Multiplier (default: `2`)
  * Offset (shift bands by N bars)
* Style controls:

  * Middle/Upper/Lower band visibility, color, width, line style
  * Background fill between upper & lower bands with opacity
* Theme: Light / Dark toggle
* Real-time updates without full page reload
* Responsive chart sizing with 600px default height
* Stable single-time registration of indicator with KLineCharts

---

## 🧮 Calculation (Implementation details)

The calculation conforms to the classic Bollinger Bands definition used in charting packages:

```
Basis  = SMA(source, length)
StdDev = populationStdDev(last length source values)
Upper  = Basis + (StdDevMultiplier * StdDev)
Lower  = Basis - (StdDevMultiplier * StdDev)
```

The `indicators/bollinger.ts` exports a `calcBollinger` function which accepts an array of numbers (the chosen `source` per candle) and indicator params, and returns an object shaped like:

```ts
{
  basis: Array<number | null>,
  upper: Array<number | null>,
  lower: Array<number | null>,
}
```

Nulls are used for the initial `length - 1` entries. The function also supports an `offset` parameter which shifts the entire series by `N` bars.

---

## 🧩 KLineCharts Integration Notes

Key implementation points:

* Register the indicator once using `useRef` to prevent multiple registrations on rerenders.
* KLineCharts expects an array of bar objects; ensure `ohlcv.json` is transformed into the shape required by the chart before initializing.
* Return values from the calc function must match the `Figure`/`Data` contracts expected by `KLineCharts` (arrays aligned with the candles array length).
* Use a custom polygon draw to render background fill between upper & lower bands.
* When settings change (colors, widths, visibility), call the chart's `regenerateFigures()` or the library equivalent rather than re-registering the indicator.
* Dispose indicators on unmount to avoid memory leaks and duplicate renders.

---

## 🛠 Setup & Development

> The project uses Turbopack for the dev server in Next.js 15.

```bash
# install
npm install

# dev (Turbopack)
npm run dev

# build
npm run build

# production start
npm run start
```

Scripts in `package.json` (typical):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## ⚙️ Configuration & Controls

The Settings modal (`components/BollingerSettings.tsx`) contains two tabs:

* **Inputs** — numeric inputs and selects with validation (min/max ranges). Changes are validated and applied immediately.
* **Style** — color pickers (React Colorful), toggles for visibility, line style presets (solid / dashed / dotted), and background fill controls (color + opacity).

All changes are stored in React state at `app/page.tsx` and passed to the `Chart` component as props. `Chart` applies these settings to the registered indicator via the chart API.

---

## ✅ Troubleshooting & Gotchas

* **Bands in separate panes**: Ensure the indicator is registered as an overlay (not a separate pane) and that all figure series use the same pane id as the main candle series.
* **Multiple registrations / duplicate drawings**: Register once (`useRef`) and use `regenerateFigures()` / `updateIndicator()` flows for updates.
* **Data shape mismatch**: KLineCharts requires `{time, open, high, low, close, volume}` per bar. Convert `ohlcv.json` accordingly.
* **Style updates not applied**: Apply style changes through the chart's API (e.g., `setStyle` or `regenerateFigures`) rather than re-instantiating the indicator.
* **Dark/light mode syncing**: Keep Tailwind root classes in sync with chart theme API calls.

---

## 🔧 Example — Using the `bollinger` indicator (pseudo)

```ts
// indicators/bollinger.ts
export function calcBollinger(values: number[], length = 20, multiplier = 2, offset = 0) {
  // returns { basis, upper, lower } aligned with input length
}

// components/Chart.tsx
// register once, then call chart.addIndicator or chart.registerIndicator
// apply style with chart.regenerateFigures({ styles })
```

---

## 📦 Included Demo Data

`public/data/ohlcv.json` contains 200+ candles for local development and verification. Use it to preview the indicator immediately after running `npm run dev`.

---

## ✅ Completion Checklist (what's implemented)

* All mandatory inputs and style settings
* KLineCharts-only implementation (no other chart libs)
* Production-ready code quality and cleanup flows
* TradingView-inspired settings panel with validation
* Real-time parameter updates without reload
* Light/dark theme support
* Background fill, offset support, and stable registration

---

## 📚 Contributing

If you'd like to contribute:

1. Fork the repo
2. Create a branch (`feature/xxx`)
3. Add tests / ensure linting passes
4. Submit a PR with a clear description of changes

---

## 📝 License

This project is MIT-licensed. See `LICENSE` for details.

---

## Contact

For implementation questions or help integrating in other projects, open an issue or reach out to the maintainer listed in `package.json`.
---
