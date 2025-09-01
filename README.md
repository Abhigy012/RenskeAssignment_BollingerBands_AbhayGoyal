# Bollinger Bands Chart – findscan-bollinger

A production-ready Bollinger Bands indicator built with **React 19**, **Next.js 15**, **TypeScript**, **TailwindCSS v4**, and **KLineCharts**.

---

## 📂 Project Structure

bollinger-bands-chart/
├── app/
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx # Main page with controls and state management
├── components/
│ ├── BollingerSettings.tsx # Settings modal with Inputs/Style tabs
│ └── Chart.tsx # Chart wrapper with KLineCharts integration
├── indicators/
│ └── bollinger.ts # Bollinger Bands calculation logic
├── public/
│ └── data/
│ └── ohlcv.json # Demo OHLCV data (200+ candles)
├── package.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md

yaml
Copy code

---

## ⚡ Setup & Installation

The project is optimized with **Turbopack** for development and builds.

```bash
npm install
npm run dev
✨ Features
Inputs
Length: 20 (default)

Basic MA Type: SMA (fixed for this assignment)

Source: Close (configurable: Open/High/Low/Close)

StdDev Multiplier: 2 (default)

Offset: 0 (shifts bands by N bars)

Style Controls
Middle band: visibility, color, width, line style

Upper band: visibility, color, width, line style

Lower band: visibility, color, width, line style

Background fill: visibility, color, opacity

🧮 Technical Implementation
Calculation Method
Basis = SMA(source, length)

StdDev = Population standard deviation of last length values

Upper = Basis + (StdDev multiplier × StdDev)

Lower = Basis – (StdDev multiplier × StdDev)

Offset: Shifts the entire band series by specified bars

Core Libraries Used
Next.js: 15.5.2 (with Turbopack)

React: 19.1.0

KLineCharts: 10.0.0-alpha5

TypeScript: ^5

TailwindCSS: ^4

UI Component Libraries
Radix UI – Accessible UI components (Dialog, Select, Switch, Tabs)

Lucide React – Icons

React Colorful – Color picker component

clsx & tailwind-merge – Utility class management

🎮 Usage
Add Indicator: Click "Add Indicator" to display Bollinger Bands.

Settings: Click "Settings" to open the configuration panel.

Inputs Tab: Modify length, source, standard deviation multiplier, and offset.

Style Tab: Customize colors, visibility, line styles, and background fill.

Theme: Toggle between light and dark modes.

🛠 Development Challenges
Chart Integration Issues
Multiple registration attempts caused rendering conflicts.

Data format mismatch: KLineCharts expected an array of objects per bar.

Bands appeared in separate panes instead of overlaying on candles.

Settings changes didn’t properly refresh the indicator.

State Management Complexities
Unstable object references caused excessive re-initialization.

Over-reactive useEffect dependencies triggered unnecessary updates.

Dark/light mode required syncing Tailwind classes with chart API calls.

API Version Compatibility
Migration from older KLineCharts broke existing logic.

Changed return formats in indicator calc functions.

Cleanup required aggressive disposal of indicators.

UI/UX Refinements
TradingView-inspired settings panel with validation.

Responsive chart sizing and panel positioning.

Real-time updates without page refresh.

✅ Key Solutions Implemented
Stable Registration: Indicator registered once with useRef.

Proper Data Structure: Calc returns {basis, upper, lower} arrays.

Dynamic Styling: Styles updated via regenerateFigures callback.

Efficient Updates: Initialization and updates separated.

Background Fill: Custom polygon drawing between bands.

🚀 Performance
Smooth interaction on 200–1000 candles.

Instant updates on settings changes.

No jank during theme switching.

🌍 Browser Compatibility
Tested on modern browsers supporting ES6+.

Chart renders at 600px height with responsive width.

📌 Assignment Completion
✅ All mandatory inputs and style settings

✅ KLineCharts-only implementation

✅ Production-ready code quality

✅ TradingView-inspired UI

✅ Real-time parameter updates

✅ Dark/light theme support
