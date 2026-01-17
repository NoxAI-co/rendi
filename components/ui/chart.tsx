"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { [key: string]: { label: string; color?: string; icon?: React.ComponentType } }
export type ChartConfig = {
    [k: string]: {
        label: React.ReactNode
        icon?: React.ComponentType
        color?: string
    }
}

type ChartContextProps = {
    config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)
    if (!context) {
        throw new Error("useChart must be used within a ChartContainer.")
    }
    return context
}

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig
        children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
    }
>(({ id, className, config, children, ...props }, ref) => {
    const chartId = React.useId()
    const idPrefix = id || chartId.replace(/:/g, "")

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                ref={ref}
                data-chart={idPrefix}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-area]:opacity-80 [&_.recharts-dot]:fill-background [&_.recharts-grid-line]:stroke-border/50 [&_.recharts-label]:fill-foreground [&_.recharts-sector]:stroke-background [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ChartStyle id={idPrefix} config={config} />
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([_, config]) => config.color
    )

    if (!colorConfig.length) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(config)
                    .map(([key, config]) => {
                        if (!config.color) return ""
                        return `
              [data-chart=${id}] {
                --color-${key}: ${config.color};
              }
            `
                    })
                    .join("\n"),
            }}
        />
    )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
        hideLabel?: boolean
        hideIndicator?: boolean
        indicator?: "line" | "dot" | "dashed"
        nameKey?: string
        labelKey?: string
    }
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
            ...props
        }: any,
        ref
    ) => {
        const { config } = useChart()

        const tooltipLabel = React.useMemo(() => {
            if (hideLabel || !payload?.length) {
                return null
            }

            const [item] = payload
            const key = `${labelKey || item.dataKey || item.name || "value"}`
            const itemConfig = getPayloadConfigFromCustomConfig(config, item, key)
            const value =
                !labelKey && typeof label === "string"
                    ? config[label as keyof typeof config]?.label || label
                    : itemConfig?.label

            if (labelFormatter) {
                return (
                    <div className={cn("font-medium", labelClassName)}>
                        {labelFormatter(value, payload)}
                    </div>
                )
            }

            if (!value) {
                return null
            }

            return <div className={cn("font-medium", labelClassName)}>{value}</div>
        }, [
            label,
            labelFormatter,
            payload,
            hideLabel,
            labelClassName,
            config,
            labelKey,
        ])

        if (!active || !payload?.length) {
            return null
        }

        const nestLabel = payload.length === 1 && indicator !== "dot"

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {!nestLabel ? tooltipLabel : null}
                <div className="grid gap-1.5">
                    {payload.map((item: any, index: number) => {
                        const key = `${nameKey || item.name || item.dataKey || "value"}`
                        const itemConfig = getPayloadConfigFromCustomConfig(config, item, key)
                        const indicatorColor = color || item.payload.fill || item.color

                        return (
                            <div
                                key={item.dataKey}
                                className={cn(
                                    "flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {itemConfig?.icon ? (
                                    <itemConfig.icon />
                                ) : (
                                    !hideIndicator && (
                                        <div
                                            className={cn(
                                                "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                                                {
                                                    "h-2.5 w-2.5": indicator === "dot",
                                                    "w-1": indicator === "line",
                                                    "w-0 border-[1.5px] border-dashed bg-transparent":
                                                        indicator === "dashed",
                                                    "my-0.5": nestLabel && indicator === "line",
                                                }
                                            )}
                                            style={
                                                {
                                                    "--color-bg": indicatorColor,
                                                    "--color-border": indicatorColor,
                                                } as React.CSSProperties
                                            }
                                        />
                                    )
                                )}
                                <div
                                    className={cn(
                                        "flex flex-1 justify-between leading-none",
                                        nestLabel ? "items-end" : "items-center"
                                    )}
                                >
                                    <div className="grid gap-1.5">
                                        {nestLabel ? tooltipLabel : null}
                                        <span className="text-muted-foreground">
                                            {itemConfig?.label || item.name}
                                        </span>
                                    </div>
                                    {item.value && (
                                        <span className="font-mono font-medium tabular-nums text-foreground">
                                            {item.value.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
        hideIcon?: boolean
        nameKey?: string
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart()

    if (!payload?.length) {
        return null
    }

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className
            )}
        >
            {payload.map((item) => {
                const key = `${nameKey || item.dataKey || "value"}`
                const itemConfig = getPayloadConfigFromCustomConfig(config, item, key)

                return (
                    <div
                        key={item.value}
                        className={cn(
                            "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                        )}
                    >
                        {itemConfig?.icon && !hideIcon ? (
                            <itemConfig.icon />
                        ) : (
                            <div
                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />
                        )}
                        {itemConfig?.label}
                    </div>
                )
            })}
        </div>
    )
})
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromCustomConfig(
    config: ChartConfig,
    payload: unknown,
    key: string
) {
    if (typeof payload !== "object" || payload === null) {
        return undefined
    }

    const payloadPayload =
        "payload" in payload &&
            typeof payload.payload === "object" &&
            payload.payload !== null
            ? payload.payload
            : undefined

    let configLabelKey: string = key

    if (
        key in payload &&
        typeof payload[key as keyof typeof payload] === "string"
    ) {
        configLabelKey = payload[key as keyof typeof payload] as string
    } else if (
        payloadPayload &&
        key in payloadPayload &&
        typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
    ) {
        configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
    }

    return configLabelKey in config
        ? config[configLabelKey]
        : config[key as keyof typeof config]
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
}
