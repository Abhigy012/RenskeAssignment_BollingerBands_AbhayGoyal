'use client'

import { useEffect, useRef, useState } from 'react'
import { init, dispose, registerIndicator } from 'klinecharts'
import calculate from "../indicators/bollinger"

type Settings = {
    length: number
    source: string
    stdDev: number
    offset: number
    dark: boolean
}

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

const IND_NAME = 'Bollinger Bands'

export default function Chart({
    settings,
    styleSettings,
    showIndicator
}: {
    settings: Settings
    styleSettings: StyleSettings
    showIndicator: boolean
}) {
    const [chartData, setChartData] = useState<any[] | null>(null)
    const chartRef = useRef<any | null>(null)
    const registeredRef = useRef(false)

    const mapLineStyle = (styleStr: string) => {
        if (styleStr === 'dashed') return { style: 'dashed', dashedValue: [6, 4] }
        if (styleStr === 'dotted') return { style: 'dashed', dashedValue: [2, 4] }
        return { style: 'solid', dashedValue: [] }
    }

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Register indicator once
    useEffect(() => {
        if (!registeredRef.current) {
            try {
                registerIndicator({
                    name: IND_NAME,
                    shortName: 'BB',
                    series: 'price',
                    calcParams: [20, 'close', 2, 0],
                    calc: (kLineDataList: any[], indicator: any) => {
                        const params = indicator?.calcParams || [20, 'close', 2, 0]
                        const [length, source, stdDev, offset] = params
                        return calculate(kLineDataList, { length, source, stdDev, offset })
                    },
                    figures: [
                        {
                            key: 'basis',
                            type: 'line',
                            title: 'Basis',
                            styles: {
                                color: '#2962FF',
                                size: 2
                            }
                        },
                        {
                            key: 'upper',
                            type: 'line',
                            title: 'Upper',
                            styles: {
                                color: '#FF6D00',
                                size: 1
                            }
                        },
                        {
                            key: 'lower',
                            type: 'line',
                            title: 'Lower',
                            styles: {
                                color: '#2962FF',
                                size: 1
                            }
                        },
                        {
                            key: 'background',
                            type: 'polygon',
                            title: 'Background',
                            styles: {
                                color: 'rgba(41, 98, 255, 0.1)',
                                borderColor: 'transparent'
                            },
                            draw: ({ ctx, data, from, to, styles }) => {
                                if (!data || data.length === 0) return

                                ctx.fillStyle = styles.color
                                ctx.beginPath()

                                // Draw upper line
                                let started = false
                                for (let i = from; i < to; i++) {
                                    const item = data[i]
                                    if (item && item.upper !== undefined) {
                                        const x = item.x
                                        const y = item.upper
                                        if (!started) {
                                            ctx.moveTo(x, y)
                                            started = true
                                        } else {
                                            ctx.lineTo(x, y)
                                        }
                                    }
                                }

                                // Draw lower line in reverse
                                for (let i = to - 1; i >= from; i--) {
                                    const item = data[i]
                                    if (item && item.lower !== undefined) {
                                        ctx.lineTo(item.x, item.lower)
                                    }
                                }

                                ctx.closePath()
                                ctx.fill()
                            }
                        }
                    ],
                    regenerateFigures: (params: any) => {
                        const [length, source, stdDev, offset] = params

                        return [
                            {
                                key: 'basis',
                                type: 'line',
                                title: 'Basis',
                                styles: () => {
                                    const mapped = mapLineStyle(styleSettings.basisStyle)
                                    return {
                                        ...mapped,
                                        color: styleSettings.basisVisible ? styleSettings.basisColor : 'transparent',
                                        size: styleSettings.basisWidth
                                    }
                                }
                            },
                            {
                                key: 'upper',
                                type: 'line',
                                title: 'Upper',
                                styles: () => {
                                    const mapped = mapLineStyle(styleSettings.upperStyle)
                                    return {
                                        ...mapped,
                                        color: styleSettings.upperVisible ? styleSettings.upperColor : 'transparent',
                                        size: styleSettings.upperWidth
                                    }
                                }
                            },
                            {
                                key: 'lower',
                                type: 'line',
                                title: 'Lower',
                                styles: () => {
                                    const mapped = mapLineStyle(styleSettings.lowerStyle)
                                    return {
                                        ...mapped,
                                        color: styleSettings.lowerVisible ? styleSettings.lowerColor : 'transparent',
                                        size: styleSettings.lowerWidth
                                    }
                                }
                            },
                            {
                                key: 'background',
                                type: 'polygon',
                                title: 'Background',
                                styles: () => ({
                                    color: styleSettings.backgroundVisible
                                        ? hexToRgba(styleSettings.backgroundColor, styleSettings.backgroundOpacity / 100)
                                        : 'transparent',
                                    borderColor: 'transparent'
                                }),
                                draw: ({ ctx, data, from, to, styles }) => {
                                    if (!data || data.length === 0 || !styleSettings.backgroundVisible) return

                                    ctx.fillStyle = styles.color
                                    ctx.beginPath()

                                    // Draw upper line
                                    let started = false
                                    for (let i = from; i < to; i++) {
                                        const item = data[i]
                                        if (item && item.upper !== undefined) {
                                            const x = item.x
                                            const y = item.upper
                                            if (!started) {
                                                ctx.moveTo(x, y)
                                                started = true
                                            } else {
                                                ctx.lineTo(x, y)
                                            }
                                        }
                                    }

                                    // Draw lower line in reverse
                                    for (let i = to - 1; i >= from; i--) {
                                        const item = data[i]
                                        if (item && item.lower !== undefined) {
                                            ctx.lineTo(item.x, item.lower)
                                        }
                                    }

                                    ctx.closePath()
                                    ctx.fill()
                                }
                            }
                        ]
                    }
                })
                registeredRef.current = true
                console.log('[CHART] Bollinger Bands indicator registered')
            } catch (e) {
                console.error('[CHART] Failed to register indicator:', e)
            }
        }
    }, [])

    // Load chart data
    useEffect(() => {
        fetch('/data/ohlcv.json')
            .then(r => r.json())
            .then(data => {
                const formatted = data.ohlcv_data.map((v: any) => ({
                    open: v.open,
                    high: v.high,
                    low: v.low,
                    close: v.close,
                    volume: v.Volume,
                    timestamp: new Date(v.timestamp).getTime()
                }))
                setChartData(formatted)
            })
            .catch(err => console.error('Failed to load chart data:', err))
    }, [])

    // Initialize chart
    useEffect(() => {
        if (!chartData) return

        if (chartRef.current) {
            dispose('k-line-chart')
        }

        chartRef.current = init('k-line-chart')
        chartRef.current.setStyles(settings.dark ? 'dark' : 'light')
        chartRef.current.applyNewData(chartData)

        console.log('[CHART] Chart initialized with', chartData.length, 'data points')
    }, [chartData, settings.dark])

    // Handle indicator
    useEffect(() => {
        const chart = chartRef.current
        if (!chart || !chartData || !registeredRef.current) return

        // Remove existing indicators
        const existingIndicators = chart.getIndicators?.() || []
        existingIndicators.forEach((indicator: any) => {
            if (indicator.name === IND_NAME) {
                chart.removeIndicator({ id: indicator.id })
            }
        })

        if (showIndicator) {
            const indicatorId = chart.createIndicator({
                name: IND_NAME,
                calcParams: [settings.length, settings.source, settings.stdDev, settings.offset]
            })

            if (indicatorId) {
                console.log('[CHART] Bollinger Bands indicator created with ID:', indicatorId)
            }
        }
    }, [
        showIndicator,
        settings.length,
        settings.source,
        settings.stdDev,
        settings.offset,
        JSON.stringify(styleSettings)
    ])

    // Cleanup
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                dispose('k-line-chart')
            }
        }
    }, [])

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div id="k-line-chart" className="w-full h-[600px]" />
        </div>
    )
}