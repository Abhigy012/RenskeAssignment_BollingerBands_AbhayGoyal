# Bollinger Bands Chart - KLineCharts Implementation

A production-ready Bollinger Bands indicator built with React, Next.js, TypeScript, TailwindCSS, and KLineCharts.

## Project Structure

```
bollinger-bands-chart/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main page with controls and state management
├── components/
│   ├── BollingerSettings.tsx    # Settings modal with Inputs/Style tabs
│   └── Chart.tsx                # Chart wrapper with KLineCharts integration
├── indicators/
│   └── bollinger.ts             # Bollinger Bands calculation logic
├── public/
│   └── data/
│       └── ohlcv.json          # Demo OHLCV data (200+ candles)
├── package.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

## Setup & Installation

```bash
npm install
npm run dev
```

## Features

### Mandatory Settings (All Implemented)

**Inputs:**

- Length: 20 (default)
- Basic MA Type: SMA (fixed for this assignment)
- Source: Close (configurable: Open/High/Low/Close)
- StdDev Multiplier: 2 (default)
- Offset: 0 (shifts bands by N bars)

**Style Controls:**

- Basic (middle) band: visibility, color, width, line style
- Upper band: visibility, color, width, line style
- Lower band: visibility, color, width, line style
- Background fill: visibility, color, opacity

### Technical Implementation

**Calculation Method:**

- Basis = SMA(source, length)
- StdDev = Population standard deviation of last `length` values
- Upper = Basis + (StdDev multiplier × StdDev)
- Lower = Basis - (StdDev multiplier × StdDev)
- Offset: Shifts the entire band series by specified bars

**Libraries Used:**

- KLineCharts: v9.8.5
- React: ^18.2.0
- Next.js: ^14.0.0
- TypeScript: ^5.0.0
- TailwindCSS: ^3.3.0

## Usage

1. **Add Indicator**: Click "Add Indicator" to display Bollinger Bands
2. **Settings**: Click "Settings" to open the configuration panel
3. **Inputs Tab**: Modify length, source, standard deviation multiplier, and offset
4. **Style Tab**: Customize colors, visibility, line styles, and background fill
5. **Theme**: Toggle between light and dark modes

## Development Challenges Summary

During implementation, several key challenges were encountered and resolved:

### Chart Integration Issues

- **Indicator Registration**: Multiple registration attempts caused rendering conflicts
- **Data Format Mismatch**: KLineCharts expected array of objects per bar, not single object with arrays
- **Rendering Problems**: Bands appeared in separate panes instead of overlaying on candles
- **Update Mechanism**: Settings changes didn't properly refresh the indicator

### State Management Complexities

- **Re-render Cycles**: Unstable object references caused excessive chart re-initialization
- **Effect Dependencies**: Over-reactive useEffect dependencies triggered unnecessary updates
- **Theme Synchronization**: Dark/light mode required both Tailwind classes and chart API calls

### API Version Compatibility

- **Legacy Code Migration**: Older working code broke with newer KLineCharts versions
- **Method Signatures**: Changes in indicator calc function return format and figure definitions
- **Cleanup Strategies**: Indicator removal required aggressive cleanup approaches

### UI/UX Refinements

- **Settings Panel**: TradingView-inspired interface with proper input validation
- **Responsive Design**: Chart sizing and settings panel positioning
- **Visual Feedback**: Immediate updates on setting changes without page refresh

## Key Solutions Implemented

1. **Stable Registration**: Indicator registered once with useRef tracking
2. **Proper Data Structure**: calc function returns array of `{basis, upper, lower}` objects
3. **Dynamic Styling**: Figure styles updated through regenerateFigures callback
4. **Efficient Updates**: Separated initialization and update effects
5. **Background Fill**: Custom polygon drawing for area between upper/lower bands

## Performance

- Smooth interaction on 200-1000 candles
- Instantaneous settings updates
- No jank during theme switching or parameter changes

## Browser Compatibility

Tested on modern browsers supporting ES6+ features. Chart renders at 600px height with responsive width.

---

**Assignment completed within requirements:**
✅ All mandatory inputs and style settings  
✅ KLineCharts-only implementation  
✅ Production-ready code quality  
✅ TradingView-inspired UI  
✅ Real-time parameter updates  
✅ Dark/light theme support
