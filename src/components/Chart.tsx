'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { init, dispose, registerIndicator } from 'klinecharts'
import calculate from '../indicators/bollinger'

type Source = 'open' | 'high' | 'low' | 'close'

export type Settings = {
    length: number
    source: Source
    stdDev: number
    offset: number
    dark: boolean
}

export type StyleSettings = {
    basisVisible: boolean
    basisColor: string
    basisWidth: number
    basisStyle: 'solid' | 'dashed' | 'dotted'
    upperVisible: boolean
    upperColor: string
    upperWidth: number
    upperStyle: 'solid' | 'dashed' | 'dotted'
    lowerVisible: boolean
    lowerColor: string
    lowerWidth: number
    lowerStyle: 'solid' | 'dashed' | 'dotted'
    backgroundVisible: boolean
    backgroundColor: string
    backgroundOpacity: number
}

const IND_NAME = 'Bollinger Bands'

interface ChartAPI {
    setStyles: (theme: 'dark' | 'light') => void
    applyNewData: (data: unknown[]) => void
    getIndicators?: () => Array<{ id: string; name: string }>
    removeIndicator?: (opts: { id: string }) => void
    createIndicator?: (opts: { name: string; calcParams?: unknown[] }) => string | null
    dispose?: (id?: string) => void
}

export default function Chart({
    settings,
    styleSettings,
    showIndicator,
}: {
    settings: Settings
    styleSettings: StyleSettings
    showIndicator: boolean
}) {
    const [chartData, setChartData] = useState<Array<Record<string, unknown>> | null>(null)

    const chartRef = useRef<ChartAPI | null>(null)
    const registeredRef = useRef(false)
    const styleRef = useRef<StyleSettings>(styleSettings)

    useEffect(() => {
        styleRef.current = styleSettings
    }, [styleSettings])

    const mapLineStyle = (styleStr: StyleSettings['basisStyle']) =>
        styleStr === 'dashed'
            ? { style: 'dashed', dashedValue: [6, 4] as number[] }
            : styleStr === 'dotted'
                ? { style: 'dashed', dashedValue: [2, 4] as number[] }
                : { style: 'solid', dashedValue: [] as number[] }

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    useEffect(() => {
        if (registeredRef.current) return

        try {
            registerIndicator({
                name: IND_NAME,
                shortName: 'BB',
                series: 'price',
                calcParams: [20, 'close', 2, 0],
                calc: (kLineDataList: unknown[], indicator: { calcParams?: unknown[] }) => {
                    const params = (indicator?.calcParams as unknown[]) ?? [20, 'close', 2, 0]
                    const length = Number(params[0]) || 20
                    const source = String(params[1] ?? 'close') as Source
                    const stdDev = Number(params[2]) || 2
                    const offset = Number(params[3]) || 0
                    return calculate(kLineDataList, { length, source, stdDev, offset })
                },
                figures: [
                    {
                        key: 'basis',
                        type: 'line',
                        title: 'Basis',
                        styles: {
                            color: '#2962FF',
                            size: 2,
                        },
                    },
                    {
                        key: 'upper',
                        type: 'line',
                        title: 'Upper',
                        styles: {
                            color: '#FF6D00',
                            size: 1,
                        },
                    },
                    {
                        key: 'lower',
                        type: 'line',
                        title: 'Lower',
                        styles: {
                            color: '#2962FF',
                            size: 1,
                        },
                    },
                    {
                        key: 'background',
                        type: 'polygon',
                        title: 'Background',
                        styles: {
                            color: 'rgba(41, 98, 255, 0.1)',
                            borderColor: 'transparent',
                        },
                        draw: ({ ctx, data, from, to, styles }: { ctx: CanvasRenderingContext2D; data: any[]; from: number; to: number; styles: { color: string } }) => {
                            if (!data || data.length === 0) return
                            ctx.fillStyle = styles.color
                            ctx.beginPath()

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

                            for (let i = to - 1; i >= from; i--) {
                                const item = data[i]
                                if (item && item.lower !== undefined) {
                                    ctx.lineTo(item.x, item.lower)
                                }
                            }

                            ctx.closePath()
                            ctx.fill()
                        },
                    },
                ],
                regenerateFigures: (params: unknown[]) => {
                    const stylesNow = styleRef.current

                    return [
                        {
                            key: 'basis',
                            type: 'line',
                            title: 'Basis',
                            styles: () => {
                                const mapped = mapLineStyle(stylesNow.basisStyle)
                                return {
                                    ...mapped,
                                    color: stylesNow.basisVisible ? stylesNow.basisColor : 'transparent',
                                    size: stylesNow.basisWidth,
                                }
                            },
                        },
                        {
                            key: 'upper',
                            type: 'line',
                            title: 'Upper',
                            styles: () => {
                                const mapped = mapLineStyle(stylesNow.upperStyle)
                                return {
                                    ...mapped,
                                    color: stylesNow.upperVisible ? stylesNow.upperColor : 'transparent',
                                    size: stylesNow.upperWidth,
                                }
                            },
                        },
                        {
                            key: 'lower',
                            type: 'line',
                            title: 'Lower',
                            styles: () => {
                                const mapped = mapLineStyle(stylesNow.lowerStyle)
                                return {
                                    ...mapped,
                                    color: stylesNow.lowerVisible ? stylesNow.lowerColor : 'transparent',
                                    size: stylesNow.lowerWidth,
                                }
                            },
                        },
                        {
                            key: 'background',
                            type: 'polygon',
                            title: 'Background',
                            styles: () => ({
                                color: stylesNow.backgroundVisible
                                    ? hexToRgba(stylesNow.backgroundColor, stylesNow.backgroundOpacity / 100)
                                    : 'transparent',
                                borderColor: 'transparent',
                            }),
                            draw: ({ ctx, data, from, to }: { ctx: CanvasRenderingContext2D; data: any[]; from: number; to: number }) => {
                                if (!data || data.length === 0 || !styleRef.current.backgroundVisible) return

                                ctx.fillStyle = hexToRgba(styleRef.current.backgroundColor, styleRef.current.backgroundOpacity / 100)
                                ctx.beginPath()

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

                                for (let i = to - 1; i >= from; i--) {
                                    const item = data[i]
                                    if (item && item.lower !== undefined) {
                                        ctx.lineTo(item.x, item.lower)
                                    }
                                }

                                ctx.closePath()
                                ctx.fill()
                            },
                        },
                    ]
                },
            })

            registeredRef.current = true
            console.log('[CHART] Bollinger Bands indicator registered')
        } catch (err) {
            console.error('[CHART] Failed to register indicator:', err)
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        fetch('/data/ohlcv.json')
            .then((r) => r.json())
            .then((raw) => {
                if (cancelled) return
                const parsed = raw as { ohlcv_data?: unknown[] }

                if (!parsed?.ohlcv_data || !Array.isArray(parsed.ohlcv_data)) {
                    throw new Error('Invalid OHLCV data shape')
                }

                const formatted = parsed.ohlcv_data.map((v) => {
                    const item = v as {
                        open: number
                        high: number
                        low: number
                        close: number
                        Volume: number
                        timestamp: string | number
                    }
                    return {
                        open: item.open,
                        high: item.high,
                        low: item.low,
                        close: item.close,
                        volume: item.Volume,
                        timestamp: new Date(item.timestamp).getTime(),
                    }
                })
                setChartData(formatted)
                console.log('[CHART] loaded data points:', formatted.length)
            })
            .catch((err) => {
                console.error('Failed to load chart data:', err)
            })

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!chartData) return

        if (chartRef.current && typeof dispose === 'function') {
            dispose('k-line-chart')
        }

        const chart = init('k-line-chart') as unknown as ChartAPI
        chartRef.current = chart

        if (chartRef.current && typeof chartRef.current.setStyles === 'function') {
            chartRef.current.setStyles(settings.dark ? 'dark' : 'light')
        }

        if (chartRef.current && typeof chartRef.current.applyNewData === 'function') {
            chartRef.current.applyNewData(chartData)
        }

        console.log('[CHART] Chart initialized with', chartData.length, 'data points')
    }, [chartData, settings.dark])

    const styleKey = useMemo(() => JSON.stringify(styleSettings), [styleSettings])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart || !chartData || !registeredRef.current) return

        const existing = chart.getIndicators?.() ?? []
        existing.forEach((indicator) => {
            if (indicator?.name === IND_NAME && typeof chart.removeIndicator === 'function') {
                chart.removeIndicator({ id: indicator.id })
            }
        })

        if (showIndicator && typeof chart.createIndicator === 'function') {
            const id = chart.createIndicator({
                name: IND_NAME,
                calcParams: [settings.length, settings.source, settings.stdDev, settings.offset],
            })
            console.log('[CHART] Bollinger Bands indicator created with ID:', id)
        }
    }, [showIndicator, settings.length, settings.source, settings.stdDev, settings.offset, styleKey, chartData])

    useEffect(() => {
        return () => {
            if (chartRef.current && typeof dispose === 'function') {
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
