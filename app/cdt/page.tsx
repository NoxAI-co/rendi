"use client";

import { useId, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CurrencyInput from "react-currency-input-field";
import Navbar from "../_components/core/Header";
import { Footer } from "../_components/core/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Landmark, TrendingUp, Wallet, PieChart as PieChartIcon } from "lucide-react";
import { calculateCDTReturns, formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { Banks } from "../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import { CarouselCDTs } from "../_components/core/CarouselCDTs";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Pie,
    PieChart,
    Cell
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";

export default function CDTCalculator() {
    const id = useId();
    const searchParams = useSearchParams();
    const [amount, setAmount] = useState("5000000");
    const [months, setMonths] = useState(() => searchParams.get("months") ?? "6");
    const [rate, setRate] = useState(() => searchParams.get("rate") ?? "12");
    const [results, setResults] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);

    const chartConfig = {
        balance: {
            label: "Saldo Total",
            color: "#00d992",
        },
        capital: {
            label: "Capital",
            color: "#ffffff",
        },
        interest: {
            label: "Interés Neto",
            color: "#00d992",
        },
        retention: {
            label: "Retención",
            color: "#ef4444",
        },
    } satisfies ChartConfig;

    useEffect(() => {
        const P = parseFloat(amount);
        const m = parseInt(months);
        const r = parseFloat(rate);

        if (!isNaN(P) && !isNaN(m) && !isNaN(r) && P > 0 && m > 0 && r > 0) {
            const res = calculateCDTReturns(P, m, r);
            setResults(res);

            // Generar datos para el gráfico de crecimiento
            const data = [];
            const EA = r / 100;
            for (let i = 0; i <= m; i++) {
                const days = i * 30;
                const interestsGross = P * (Math.pow(1 + EA, days / 365) - 1);
                const retention = interestsGross * 0.04;
                data.push({
                    month: `Mes ${i}`,
                    balance: Math.round(P + interestsGross - retention),
                });
            }
            setChartData(data);

            // Generar datos para el gráfico de torta
            setPieData([
                { name: "Capital", value: P, fill: "#ffffff" },
                { name: "interest", value: res.interests - res.retention, fill: "#00d992" },
                { name: "retention", value: res.retention, fill: "#ef4444" },
            ]);
        } else {
            setResults(null);
            setChartData([]);
            setPieData([]);
        }
    }, [amount, months, rate]);

    const handlePresetSelect = (presetRate: number, presetMonths: number) => {
        setRate(presetRate.toString());
        setMonths(presetMonths.toString());
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center space-y-12">
            <Navbar />

            <div className="rounded-xl gap-4 grid place-items-center w-full text-center px-4 mt-8">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col"
                >
                    <h1 className="w-fit rounded-lg text-[#00d992] text-3xl md:text-5xl font-bold mx-auto">
                        Calculadora de CDT
                    </h1>
                    <p className="font-medium text-sm md:text-md px-4 py-4 rounded-full text-neutral-400">
                        Proyecta tus ahorros a término fijo con precisión bancaria y legal.
                    </p>
                </motion.article>
            </div>

            {/* Sección CDTs Famosos */}
            <section className="w-full px-4 xl:px-28 space-y-4">

                <CarouselCDTs onSelectCDT={handlePresetSelect} />

                <div className="flex justify-center mt-4">
                    <Link
                        href="/cdt/list"
                        className="text-neutral-400 hover:text-[#00d992] text-sm font-medium transition-colors flex items-center gap-1 group"
                    >
                        Ver todos los cdts registrados
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </section>

            <section className="w-full px-4 xl:px-28">
                <div className="relative overflow-hidden rounded-3xl border border-border">
                    {/* Liquid glass ambient background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/15 blur-3xl" />
                        <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/10 blur-3xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
                    </div>

                    <div className="relative grid gap-4 p-3 md:p-5 lg:grid-cols-2">
                        {/* INPUTS PANEL */}
                        <div className="bg-background/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-7 flex flex-col gap-5 shadow-lg">
                            <div className="flex items-center gap-2">
                                <Wallet className="text-[#00d992]" size={18} />
                                <h2 className="text-lg font-semibold tracking-tight">Datos de Inversión</h2>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Monto a Invertir</Label>
                                <CurrencyInput
                                    prefix="$"
                                    value={amount}
                                    onValueChange={(value) => setAmount(value ?? "")}
                                    intlConfig={{ locale: "es-CO", currency: "COP" }}
                                    className="w-full p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-white/5 font-semibold text-foreground focus:ring-2 focus:ring-[#00d992]/40 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Plazo (Meses)</Label>
                                    <Input
                                        type="number"
                                        value={months}
                                        onChange={(e) => setMonths(e.target.value)}
                                        className="bg-background/60 backdrop-blur-sm border-white/5 rounded-xl py-6 focus:ring-2 focus:ring-[#00d992]/40"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Tasa EA (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        className="bg-background/60 backdrop-blur-sm border-white/5 rounded-xl py-6 focus:ring-2 focus:ring-[#00d992]/40"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm px-4 py-3 flex gap-3 text-sm">
                                <Info className="shrink-0 text-blue-400 mt-0.5" size={16} />
                                <p className="text-muted-foreground">
                                    Los CDT en Colombia aplican una Retención en la Fuente fija del <span className="text-foreground font-medium">4%</span> sobre los intereses ganados.
                                </p>
                            </div>
                        </div>

                        {/* RESULTS PANEL */}
                        <div className="flex flex-col gap-4 self-start">
                            {results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-4"
                                >
                                    {/* Hero result */}
                                    <div className="relative overflow-hidden rounded-2xl border border-[#00d992]/20 bg-background/40 backdrop-blur-xl shadow-lg p-6">
                                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#00d992]/10 blur-2xl pointer-events-none" />
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                                            Valor Final Neto
                                        </p>
                                        <p className="text-4xl md:text-5xl font-black text-[#00d992] tracking-tight">
                                            {formatCurrency(results.finalAmount)}
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[10px] text-[#00d992] font-semibold uppercase tracking-wider">
                                            Rendimiento estimado
                                        </span>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 divide-x divide-border/50 rounded-2xl border border-white/5 bg-background/40 backdrop-blur-sm overflow-hidden">
                                        <div className="flex flex-col items-center justify-center px-3 py-4 text-center">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Interés bruto</span>
                                            <span className="text-sm font-semibold text-foreground mt-1.5 line-clamp-1">{formatCurrency(results.interests)}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-3 py-4 text-center">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Retención 4%</span>
                                            <span className="text-sm font-semibold text-red-400 mt-1.5 line-clamp-1">-{formatCurrency(results.retention)}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-3 py-4 text-center">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Mensual neto</span>
                                            <span className="text-sm font-semibold text-[#00d992] mt-1.5 line-clamp-1">{formatCurrency(results.interestsMonthly - results.retentionMonthly)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Gráfico de Crecimiento */}
                            {chartData.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative overflow-hidden rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl shadow-lg"
                                >
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#00d992]/10 blur-2xl pointer-events-none" />
                                    <div className="relative p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingUp className="text-[#00d992]" size={16} />
                                            <h3 className="text-sm font-semibold">Proyección de Crecimiento</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-4">Visualiza cómo crece tu dinero mes a mes</p>
                                        <ChartContainer config={chartConfig} className="h-[220px] w-full">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666" }} interval={Math.floor(chartData.length / 5)} />
                                                <YAxis hide domain={["dataMin - 10000", "auto"]} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Area type="monotone" dataKey="balance" stroke="#00d992" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                                                <defs>
                                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#00d992" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#00d992" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                            </AreaChart>
                                        </ChartContainer>
                                    </div>
                                </motion.div>
                            )}

                            {/* Gráfico de Desglose */}
                            {pieData.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative overflow-hidden rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl shadow-lg p-5"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <PieChartIcon className="text-[#00d992]" size={16} />
                                        <h3 className="text-sm font-semibold">Composición de la Inversión</h3>
                                    </div>
                                    <ChartContainer config={chartConfig} className="h-[180px] w-full">
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4}>
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="flex justify-center gap-6 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                            <span className="text-xs text-muted-foreground">Capital</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#00d992]" />
                                            <span className="text-xs text-muted-foreground">Interés</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <span className="text-xs text-muted-foreground">Retención</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
