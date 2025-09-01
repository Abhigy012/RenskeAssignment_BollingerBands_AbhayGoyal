'use client'

import Chart from "@/components/Chart"
import BollingerSettings from "@/components/BollingerSettings"
import { useState } from "react"

export default function Home() {
  const [length, setLength] = useState(20)
  const [source, setSource] = useState("close")
  const [stdDev, setStdDev] = useState(2)
  const [offset, setOffset] = useState(0)
  const [dark, setDark] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [styleSettings, setStyleSettings] = useState({
    basisVisible: true,
    basisColor: '#2962FF',
    basisWidth: 2,
    basisStyle: 'solid',
    upperVisible: true,
    upperColor: '#FF6D00',
    upperWidth: 1,
    upperStyle: 'solid',
    lowerVisible: true,
    lowerColor: '#2962FF',
    lowerWidth: 1,
    lowerStyle: 'solid',
    backgroundVisible: true,
    backgroundColor: '#2962FF',
    backgroundOpacity: 10
  })

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Bollinger Bands Chart
          </h1>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={() => setShowIndicator(!showIndicator)}
              className={`px-4 py-2 text-white rounded ${showIndicator
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {showIndicator ? "Remove Indicator" : "Add Indicator"}
            </button>

            {showIndicator && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Settings
              </button>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <Chart
                settings={{ length, source, stdDev, offset, dark }}
                styleSettings={styleSettings}
                showIndicator={showIndicator}
              />
            </div>

            {showSettings && (
              <div className="flex-shrink-0">
                <BollingerSettings
                  onClose={() => setShowSettings(false)}
                  length={length}
                  setLength={setLength}
                  source={source}
                  setSource={setSource}
                  stdDev={stdDev}
                  setStdDev={setStdDev}
                  offset={offset}
                  setOffset={setOffset}
                  styleSettings={styleSettings}
                  setStyleSettings={setStyleSettings}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}