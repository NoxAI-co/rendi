"use client";

import { useId, useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import Navbar from "../_components/core/Header";
import { Footer } from "../_components/core/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Landmark, TrendingUp, Wallet, PieChart as PieChartIcon } from "lucide-react";
import { calculateCDTReturns, formatCurrency } from "@/lib/finance-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Banks } from "../_DATA/Banks";
import Image from "next/image";
import { CarouselCDTs } from "../_components/core/CarouselCDTs";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
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
    const [amount, setAmount] = useState("5000000");
    const [months, setMonths] = useState("6");
    const [rate, setRate] = useState("12");
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
            </section>

            <section className="grid gap-6 md:grid-cols-2 w-full px-4 xl:px-28">
                {/* Panel de Entradas */}
                <Card className="bg-neutral-900 border-neutral-800 border-2">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Wallet className="text-[#00d992]" size={20} />
                            Datos de Inversión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-md font-semibold">Monto a Invertir</Label>
                            <CurrencyInput
                                prefix="$"
                                value={amount}
                                onValueChange={(value) => setAmount(value ?? "")}
                                intlConfig={{ locale: "es-CO", currency: "COP" }}
                                className="w-full p-3 rounded-lg bg-[#090d10] font-semibold text-white focus:ring-2 focus:ring-emerald-500 outline-none border border-neutral-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-md font-semibold">Plazo (Meses)</Label>
                                <Input
                                    type="number"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    className="bg-[#090d10] border-neutral-800 py-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-md font-semibold">Tasa EA (%)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className="bg-[#090d10] border-neutral-800 py-6"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-200">
                            <Info className="shrink-0" size={18} />
                            <p>
                                Los CDT en Colombia aplican una Retención en la Fuente fija del 4% sobre los intereses ganados.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Panel de Resultados */}
                <div className="space-y-6">
                    {results ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <Card className="bg-[#090d10] border-[#00d992]/30 border-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TrendingUp size={80} />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-neutral-400 text-sm font-medium uppercase tracking-wider">
                                        Valor Final Neto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl md:text-5xl font-black text-[#00d992]">
                                        {formatCurrency(results.finalAmount)}
                                    </div>
                                    <Badge variant="outline" className="mt-4 border-[#00d992] text-[#00d992]">
                                        Rendimiento Estimado
                                    </Badge>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-neutral-900 border-neutral-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-neutral-400 text-xs uppercase">Interés Bruto</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl font-bold">{formatCurrency(results.interests)}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-neutral-900 border-neutral-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-red-400 text-xs uppercase">Retención (4%)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl font-bold">- {formatCurrency(results.retention)}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="bg-neutral-900 border-neutral-800">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Landmark className="text-neutral-500" size={18} />
                                            <span className="text-neutral-400">Rendimiento Mensual Promedio</span>
                                        </div>
                                        <span className="text-lg font-bold text-[#00d992]">
                                            {formatCurrency(results.interestsMonthly - results.retentionMonthly)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : null}

                    {/* Gráfico de Crecimiento */}
                    {chartData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-neutral-900 border-neutral-800">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="text-[#00d992]" size={18} />
                                        Proyección de Crecimiento
                                    </CardTitle>
                                    <CardDescription>Visualiza cómo crece tu dinero mes a mes</CardDescription>
                                </CardHeader>
                                <CardContent className="px-2">
                                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                        <AreaChart
                                            data={chartData}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#888' }}
                                                interval={Math.floor(chartData.length / 5)}
                                            />
                                            <YAxis
                                                hide
                                                domain={['dataMin - 10000', 'auto']}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Area
                                                type="monotone"
                                                dataKey="balance"
                                                stroke="#00d992"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorBalance)"
                                            />
                                            <defs>
                                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00d992" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#00d992" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Gráfico de Desglose */}
                    {pieData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-neutral-900 border-neutral-800">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <PieChartIcon className="text-[#00d992]" size={18} />
                                        Composición de la Inversión
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ChartContainer>
                                    <div className="flex justify-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-white" />
                                            <span className="text-xs text-neutral-400">Capital</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#00d992]" />
                                            <span className="text-xs text-neutral-400">Interés</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="text-xs text-neutral-400">Retención</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                </div>
            </section>

            <Footer />
        </div>
    );
}
