"use client";

import { useEffect, useId, useState } from "react";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

import CurrencyInput from "react-currency-input-field";
import { Banks, DepositosBajoMonto } from "./_DATA/Banks";
import { CarouselBanks } from "./_components/core/CarrouselBanks";
import DialogEa from "./_components/core/DialogEa";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Info, TriangleAlert, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Faq } from "./_components/core/Faq";
import { Badge } from "@/components/ui/badge";
import { DialogDetails } from "./_components/core/DialogDetails";
import DialogFormula from "./_components/core/DialogFormula";

import {
  calculateMonthlyNetRate,
  calculateSavingsReturns,
  formatCurrency,
} from "@/lib/finance-utils";
import { LAST_UPDATE } from "@/lib/last-update";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const id = useId();
  const [amount, setAmount] = useState("1000000");
  const [months, setMonths] = useState("1");
  const [isChecked, setChecked] = useState(false);
  const [displayedBanks, setDisplayedBanks] = useState(Banks);
  const [limit, setLimit] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const router = useRouter();

  const chartConfig = {
    balance: {
      label: "Saldo Total",
      color: "#00d992",
    },
    returns: {
      label: "Rendimiento",
      color: "#00d992",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (parseFloat(amount) >= 10482689) {
      setLimit(true);
      setDisplayedBanks(Banks);
    } else {
      setLimit(false);
      setDisplayedBanks(
        isChecked
          ? [...Banks, ...DepositosBajoMonto.map(({ act, ...rest }) => rest)]
          : Banks,
      );
    }
  }, [amount, isChecked]);

  // Calcular rendimientos
  const calculateReturns = () => {
    const P = parseFloat(amount);
    const t = parseInt(months);

    if (isNaN(P) || isNaN(t) || P <= 0 || t <= 0) return [];

    return displayedBanks.map((bank) => {
      const results = calculateSavingsReturns(P, t, bank.tasaEA);

      return {
        ...bank,
        deposit: formatCurrency(P),
        depositRaw: P,
        finalAmount: formatCurrency(results.finalAmount),
        finalAmountRaw: results.finalAmount,
        interests: formatCurrency(results.interests),
        interestsRaw: results.interests,
        retention: formatCurrency(results.retention),
        retentionRaw: results.retention,
        monthsRaw: t,

        finalAmountMonthlyRaw: results.finalAmountMonthly,
        interestsMonthlyRaw: results.interestsMonthly,
        monthlyRetention: results.retentionMonthly,
      };
    });
  };

  // Generar datos para gráficos
  useEffect(() => {
    if (!isFormFilled) {
      setChartData([]);
      setComparisonData([]);
      return;
    }

    const P = parseFloat(amount);
    const t = parseInt(months);
    const results = calculateReturns();

    // Gráfico de crecimiento (AreaChart)
    const growthData = [];
    const topBank = results[0]; // El mejor banco
    if (topBank) {
      for (let i = 0; i <= t; i++) {
        const monthResults = calculateSavingsReturns(P, i, topBank.tasaEA);
        growthData.push({
          month: `Mes ${i}`,
          balance: Math.round(monthResults.finalAmount),
        });
      }
    }
    setChartData(growthData);

    // Gráfico de comparación (BarChart) - Top 5
    const top5 = results.slice(0, 5).map((bank) => ({
      name: bank.name,
      returns: bank.interestsRaw,
    }));
    setComparisonData(top5);
  }, [amount, months, isChecked, displayedBanks]);

  const isFormFilled = amount && months;

  return (
    <div className="flex flex-col items-center space-y-12 pb-8">
      <div className="absolute top-0 flex justify-center w-full"></div>
      <div className="rounded-xl gap-4 grid place-items-center w-full text-center px-4">
        <article className="flex flex-col">
          <h1 className="w-fit rounded-lg text-[#00d992] text-3xl md:text-5xl font-bold">
            Haz rendir tu dinero
          </h1>
        </article>
        <p className="font-medium text-sm md:text-md px-4 py-2 rounded-full">
          En esta calculadora podrás aproximar tus rendimientos con las
          diferentes cuentas de ahorro y depósitos de bajo monto en Colombia.
        </p>
      </div>

      <div className="place-content-center place-items-center w-full overflow-hidden">
        <CarouselBanks />

        <div className="flex justify-center mt-4">
          <Link
            href="/banks"
            className="text-neutral-400 hover:text-[#00d992] text-sm font-medium transition-colors flex items-center gap-1 group"
          >
            Ver todos los bancos disponibles 
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>

      <section className="flex flex-col md:flex-row items-center  gap-4 text-center text-neutral-400">
        <span className="text-sm">
          Todas las tasas mostradas son en efectivo anual
        </span>
        <DialogEa />
      </section>

      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#00d992]/10 text-[#00d992]">
        <span className="w-1 h-1 rounded-full bg-[#00d992]"></span>
        Ultima actualización: {LAST_UPDATE}
      </span>

      <section className="w-full px-4 xl:px-28">
        <div className="relative overflow-hidden rounded-3xl border border-border">
          {/* Liquid glass ambient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/15 blur-3xl" />
            <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#00d992]/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          </div>

          <div className="relative grid gap-4 p-3 md:p-5 lg:grid-cols-[1fr_1.4fr]">
            {/* INPUTS PANEL */}
            <div className="bg-background/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-7 flex flex-col gap-5 shadow-lg">
              <div className="mx-auto">
                <DialogFormula />
              </div>

              <div className="space-y-2 w-full">
                <label className="text-foreground text-sm font-semibold">
                  Valor
                </label>
                <CurrencyInput
                  prefix="$"
                  placeholder=""
                  value={amount}
                  onValueChange={(value) => setAmount(value ?? "")}
                  intlConfig={{ locale: "es-CO", currency: "COP" }}
                  className="w-full p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-white/5 font-semibold text-foreground focus:ring-2 focus:ring-[#00d992]/40 outline-none text-md transition-all"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor={months} className="text-sm font-semibold">
                  Meses <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setMonths(value)}
                  defaultValue="1"
                >
                  <SelectTrigger
                    id={months}
                    className="w-full py-6 px-4 text-md font-semibold bg-background/60 backdrop-blur-sm border-white/5 rounded-xl"
                  >
                    <SelectValue placeholder="Meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mes</SelectItem>
                    <SelectItem value="2">2 meses</SelectItem>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="4">4 meses</SelectItem>
                    <SelectItem value="5">5 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="7">7 meses</SelectItem>
                    <SelectItem value="8">8 meses</SelectItem>
                    <SelectItem value="9">9 meses</SelectItem>
                    <SelectItem value="10">10 meses</SelectItem>
                    <SelectItem value="11">11 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col w-full items-start gap-2 rounded-xl border border-white/5 bg-background/40 backdrop-blur-sm p-4 transition-all has-[[data-state=checked]]:border-[#00d992]/30 has-[[data-state=checked]]:bg-[#00d992]/5">
                <div className="grid grow gap-2 w-full">
                  <article className="flex justify-between items-center">
                    <Label htmlFor={id} className="text-sm">
                      Incluir depositos de bajo monto
                    </Label>
                    <Switch
                      id={id}
                      aria-describedby={`${id}-description`}
                      checked={isChecked}
                      onCheckedChange={(checked) => setChecked(checked)}
                    />
                  </article>
                  <p
                    id={`${id}-description`}
                    className="text-xs text-muted-foreground"
                  >
                    Se incluirán los depósitos de bajo monto para el cálculo de
                    los resultados
                  </p>
                </div>
              </div>

              {isChecked && (
                <>
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm px-4 py-3 resultShowItem">
                    <div className="flex gap-3">
                      <Info
                        className="-mt-0.5 inline-flex text-blue-400 shrink-0"
                        size={24}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <div className="flex flex-col grow justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          El limite para los depositos de bajo monto es de
                          $10.482.689 pesos (210,50 UVT)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Si digitas un valor mayor a este, el sistema no
                          tendrá en cuenta los depositos de bajo monto.
                        </p>
                      </div>
                    </div>
                  </div>

                  {limit && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm px-4 py-3">
                      <div className="flex gap-3">
                        <TriangleAlert
                          className="mt-0.5 shrink-0 text-amber-500"
                          size={20}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <p className="text-sm text-foreground">
                          Se están excluyendo los depósitos de bajo monto
                          porque superaste el límite
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* RESULTS PANEL */}
            <div className="bg-background/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col max-h-[700px] shadow-lg">
              <div className="flex flex-col gap-4 pb-4">
                <h2 className="text-center text-xl md:text-2xl font-bold tracking-tight">
                  Resultados
                </h2>

                {/* Stats row — App Store style */}
                <div className="grid grid-cols-2 md:divide-x divide-border/50 rounded-xl border border-white/5 bg-background/40 backdrop-blur-sm overflow-hidden">
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center border-r border-border/50 md:border-r-0">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Depósito
                    </span>
                    <span className="text-sm md:text-base font-semibold text-[#00d992] mt-1 line-clamp-1">
                      {formatCurrency(parseFloat(amount))}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Plazo
                    </span>
                    <span className="text-sm md:text-base font-semibold text-[#00d992] mt-1">
                      {`${months || "0"} mes(es)`}
                    </span>
                  </div>
                </div>


              </div>

              <div className="flex flex-col gap-3 relative overflow-y-auto overflow-x-hidden pr-1">
                {isFormFilled ? (
                  calculateReturns()
                    .sort(
                      (a, b) => (b.interestsRaw || 0) - (a.interestsRaw || 0),
                    )
                    .map((bank, index) => (
                      <div
                        key={index}
                        onClick={() => router.push(`/bank/${encodeURIComponent(bank.name.toLowerCase().replace(/ /g, "-"))}`)}
                        className="bg-background/40 backdrop-blur-xl border border-white/5 hover:border-[#00d992]/30 hover:bg-background/60 transition-all p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
                      >
                        <article className="flex gap-4 items-center flex-1 min-w-0">
                          <Image
                            src={bank.image}
                            alt={bank.name}
                            width={50}
                            height={50}
                            className="rounded-xl shrink-0 border border-white/10"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex gap-1 items-center flex-wrap">
                              <h3 className="text-foreground text-lg font-medium">
                                {bank.name}
                              </h3>
                              <p className="text-muted-foreground text-xs">
                                ({bank.type || "Cuenta de ahorros"})
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-baseline mt-0.5">
                              <span className="text-xl text-[#00d992] font-bold tracking-tight">
                                {bank.finalAmount}
                              </span>
                              {parseFloat(
                                bank.retention.replace(/[^0-9.-]+/g, ""),
                              ) > 1 && (
                                <span className="text-red-400 text-xs">
                                  (RTE FTE: -{bank.retention})
                                </span>
                              )}
                            </div>
                            <p className="text-yellow-400/90 text-xs mt-0.5">
                              Tu dinero habrá crecido: {bank.interests}
                            </p>
                          </div>
                        </article>

                        <article
                          className="flex flex-col items-stretch gap-2 w-[130px] shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative group w-full">
                            <button
                              type="button"
                              className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-sm font-bold"
                            >
                              <span>{bank.tasaEA}%</span>
                              <Info size={13} className="opacity-60 shrink-0" />
                            </button>
                            <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-52 rounded-xl border border-border bg-background/95 backdrop-blur-md px-3 py-2.5 text-[11px] text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                Tasa EA
                              </p>
                              <p>
                                Neto mensual aprox:{" "}
                                <span className="font-semibold text-[#8bf5cf]">
                                  {calculateMonthlyNetRate(bank.tasaEA).toFixed(2)}%
                                </span>
                              </p>
                            </div>
                          </div>

                          <DialogDetails {...bank} />
                        </article>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Ingresa un monto y número de meses para calcular los
                    rendimientos
                    <div className="mt-4 flex justify-center items-center p-4 rounded-lg">
                      <Image
                        className="bg-background/40 backdrop-blur-xl border border-white/5 rounded-full p-4 hover:scale-110 transition-all"
                        src="/money-bag.png"
                        alt="Empty"
                        width={100}
                        height={200}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gráficos de Visualización */}
      {isFormFilled && chartData.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 w-full px-4 xl:px-28">
          {/* Gráfico de Comparación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-background/40 backdrop-blur-xl shadow-lg"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#00d992]/10 blur-3xl pointer-events-none" />
            <div className="relative p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="text-[#00d992]" size={16} />
                <h3 className="text-sm font-semibold text-foreground">
                  Comparación Top 5 Bancos
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Rendimientos netos de los mejores bancos
              </p>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="returns" fill="#00d992" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>

          {/* Gráfico de Crecimiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-background/40 backdrop-blur-xl shadow-lg"
          >
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#00d992]/10 blur-3xl pointer-events-none" />
            <div className="relative p-5 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-[#00d992]" size={16} />
                <h3 className="text-sm font-semibold text-foreground">
                  Proyección de Crecimiento
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Evolución del saldo con el mejor banco
              </p>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666" }}
                    interval={Math.floor(chartData.length / 5)}
                  />
                  <YAxis hide domain={["dataMin - 10000", "auto"]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#00d992"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalanceSavings)"
                  />
                  <defs>
                    <linearGradient
                      id="colorBalanceSavings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00d992" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00d992" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ChartContainer>
            </div>
          </motion.div>
        </section>
      )}

      <section className="p-6 md:px-28 w-full md:w-[70%]">
        <Faq />
      </section>
    </div>
  );
}
