'use client'

import { useState } from 'react'

type StyleSettings = {
    basisVisible: boolean
    basisColor: string
    basisWidth: number
    basisStyle: string
    upperVisible: boolean
    upperColor: string
    upperWidth: number
    upperStyle: string
    lowerVisible: boolean
    lowerColor: string
    lowerWidth: number
    lowerStyle: string
    backgroundVisible: boolean
    backgroundColor: string
    backgroundOpacity: number
}

type Props = {
    onClose: () => void
    length: number
    setLength: (val: number) => void
    source: string
    setSource: (val: string) => void
    stdDev: number
    setStdDev: (val: number) => void
    offset: number
    setOffset: (val: number) => void
    styleSettings: StyleSettings
    setStyleSettings: (val: StyleSettings) => void
}

export default function BollingerSettings({
    onClose,
    length,
    setLength,
    source,
    setSource,
    stdDev,
    setStdDev,
    offset,
    setOffset,
    styleSettings,
    setStyleSettings
}: Props) {
    const [activeTab, setActiveTab] = useState('inputs')

    const handleStyleChange = (key: keyof StyleSettings, value: any) => {
        setStyleSettings({ ...styleSettings, [key]: value })
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bollinger Bands Settings
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    ✕
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700 mb-4">
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'inputs'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('inputs')}
                >
                    Inputs
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'style'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('style')}
                >
                    Style
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'inputs' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Length
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={length}
                            onChange={e => setLength(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Basic MA Type
                        </label>
                        <select
                            disabled
                            value="SMA"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500"
                        >
                            <option value="SMA">SMA</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Source
                        </label>
                        <select
                            value={source}
                            onChange={e => setSource(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="close">Close</option>
                            <option value="open">Open</option>
                            <option value="high">High</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            StdDev (multiplier)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={stdDev}
                            onChange={e => setStdDev(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Offset
                        </label>
                        <input
                            type="number"
                            value={offset}
                            onChange={e => setOffset(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-6">
                    {/* Basic/Basis Band */}
                    <div>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={styleSettings.basisVisible}
                                onChange={e => handleStyleChange('basisVisible', e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Basic (Middle Band)
                            </label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="color"
                                value={styleSettings.basisColor}
                                onChange={e => handleStyleChange('basisColor', e.target.value)}
                                className="w-full h-8"
                            />
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={styleSettings.basisWidth}
                                onChange={e => handleStyleChange('basisWidth', Number(e.target.value))}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <select
                                value={styleSettings.basisStyle}
                                onChange={e => handleStyleChange('basisStyle', e.target.value)}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>

                    {/* Upper Band */}
                    <div>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={styleSettings.upperVisible}
                                onChange={e => handleStyleChange('upperVisible', e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Upper Band
                            </label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="color"
                                value={styleSettings.upperColor}
                                onChange={e => handleStyleChange('upperColor', e.target.value)}
                                className="w-full h-8"
                            />
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={styleSettings.upperWidth}
                                onChange={e => handleStyleChange('upperWidth', Number(e.target.value))}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <select
                                value={styleSettings.upperStyle}
                                onChange={e => handleStyleChange('upperStyle', e.target.value)}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>

                    {/* Lower Band */}
                    <div>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={styleSettings.lowerVisible}
                                onChange={e => handleStyleChange('lowerVisible', e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Lower Band
                            </label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="color"
                                value={styleSettings.lowerColor}
                                onChange={e => handleStyleChange('lowerColor', e.target.value)}
                                className="w-full h-8"
                            />
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={styleSettings.lowerWidth}
                                onChange={e => handleStyleChange('lowerWidth', Number(e.target.value))}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <select
                                value={styleSettings.lowerStyle}
                                onChange={e => handleStyleChange('lowerStyle', e.target.value)}
                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>

                    {/* Background Fill */}
                    <div>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={styleSettings.backgroundVisible}
                                onChange={e => handleStyleChange('backgroundVisible', e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Background Fill
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="color"
                                value={styleSettings.backgroundColor}
                                onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                                className="w-full h-8"
                            />
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">
                                    Opacity: {styleSettings.backgroundOpacity}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={styleSettings.backgroundOpacity}
                                    onChange={e => handleStyleChange('backgroundOpacity', Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Done
                </button>
            </div>
        </div>
    )
}