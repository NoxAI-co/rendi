"use client";

import { useEffect, useId, useState } from "react";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

import CurrencyInput from "react-currency-input-field";
import { Banks, DepositosBajoMonto } from "./_DATA/Banks";
import { CarouselBanks } from "./_components/core/CarrouselBanks";
import DialogEa from "./_components/core/DialogEa";
import Navbar from "./_components/core/Header";
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
import { Faq } from "./_components/core/Faq";
import { Footer } from "./_components/core/Footer";
import { Badge } from "@/components/ui/badge";
import { DialogDetails } from "./_components/core/DialogDetails";
import DialogFormula from "./_components/core/DialogFormula";

import { calculateSavingsReturns, formatCurrency } from "@/lib/finance-utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="min-h-screen text-white flex flex-col items-center space-y-12">
      <Navbar />
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
        Ultima actualización: 17/01/2026
      </span>

      <section className="grid gap-2 md:gap-0 md:flex w-full px-2 xl:px-28">
        {/* Inputs */}

        <div className="bg-neutral-900 flex flex-col p-4 md:p-8 gap-6 rounded-2xl md:w-1/2 place-content-center overflow-auto">
          <div className="mx-auto">
            <DialogFormula />
          </div>

          <div className="space-y-2 w-full">
            <label className="text-white text-md font-semibold text-left">
              Valor
            </label>
            <CurrencyInput
              prefix="$"
              placeholder=""
              value={amount}
              onValueChange={(value) => setAmount(value ?? "")}
              intlConfig={{ locale: "es-CO", currency: "COP" }}
              className="w-full p-3 rounded-lg bg-[#090d10] font-semibold text-white focus:ring-2 focus:ring-emerald-500 outline-none text-md"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor={months} className="text-md">
              Meses <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => setMonths(value)}
              defaultValue="1"
            >
              <SelectTrigger
                id={months}
                className="w-full py-6 px-4 text-md font-semibold"
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

          <div className="flex flex-col w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
            {/* <Switch
              id={id}
              checked={isChecked}
              onCheckedChange={(checked) => setChecked(checked)}
              className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2"
              aria-describedby={`${id}-description`}
            /> */}

            <div className="grid grow gap-2 w-full">
              <article className="flex justify-between items-center">
                <Label htmlFor={id}>Incluir depositos de bajo monto</Label>
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
                Se incluirán los depósitos de bajo monto para el cálculo de los
                resultados
              </p>
            </div>
          </div>

          {isChecked ? (
            <>
              <div className="rounded-lg border border-border px-4 py-3 resultShowItem">
                <div className="flex gap-3">
                  <Info
                    className="-mt-0.5 inline-flex text-blue-500"
                    size={28}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col grow justify-between gap-4">
                    <p className="text-normal font-medium">
                      El limite para los depositos de bajo monto es de
                      $10.482.689 pesos (210,50 UVT)
                    </p>

                    <p className="text-sm text-neutral-400">
                      Si digitas un valor mayor a este, el sistema no tendrá en
                      cuenta los depositos de bajo monto.
                    </p>
                  </div>
                </div>
              </div>

              {limit ? (
                <div className="rounded-lg border border-amber-500/50 px-4 py-3">
                  <div className="flex gap-3 ">
                    <TriangleAlert
                      className="mt-0.5 shrink-0 opacity-60 text-amber-600"
                      size={22}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <div className="flex grow justify-between gap-3">
                      <p className="text-sm">
                        Se están excluyendo los depósitos de bajo monto porque
                        superaste el límite
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p></p>
          )}
        </div>

        {/* Resultados */}
        <div className="flex flex-col p-2 md:p-6 border border-neutral-900 rounded-2xl w-full bg-[#090d10] max-h-[700px] overflow-auto">
          <div className="py-4 flex flex-col gap-4">
            <h1 className="text-center text-2xl font-bold">Resultados</h1>
            <div className="flex flex-row gap-4 text-sm md:text-normal">
              <div className="flex-grow flex px-4 py-2 gap-2 flex-col bg-[#122322] text-[#00d992] rounded-md transition-all hover:scale-[1.02] duration-120">
                <h3 className="font-medium">Deposito</h3>
                <span className="font-semibold">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>
              <div className="flex-grow flex px-4 py-2 gap-2 flex-col bg-[#122322] text-[#00d992] rounded-md transition-all hover:scale-[1.02] duration-120">
                <h3 className="font-medium">Meses</h3>
                <span className="font-semibold">
                  {`${months || "0"} mes(es)`}{" "}
                </span>
              </div>
            </div>
            <div className="w-full flex justify-center mt-2 md:hidden">
              <Badge className="gap-1 mx-auto">
                <Zap
                  className="-ms-0.5 opacity-60"
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Has scroll en los resultados para ver más
              </Badge>
            </div>
          </div>

          <div className="flex flex-col relative overflow-y-auto overflow-x-hidden">
            {isFormFilled ? (
              calculateReturns()
                .sort((a, b) => (b.interestsRaw || 0) - (a.interestsRaw || 0))
                .map((bank, index) => (
                  <div
                    key={index}
                    className="bg-[#0a0a0a] border border-neutral-800 p-4 rounded-lg shadow-md mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 "
                  >
                    <article className="flex gap-4 items-center">
                      <Image
                        src={bank.image}
                        alt={bank.name}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      <div className="flex flex-col">
                        <div className="flex gap-1 items-center">
                          <h2 className="text-white text-lg font-medium">
                            {bank.name}
                          </h2>
                          <p className="text-neutral-400 text-sm">
                            ({bank.type || "Cuenta de ahorros"})
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xl text-[#00d992] font-bold">
                            {bank.finalAmount}
                          </span>
                          {parseFloat(
                            bank.retention.replace(/[^0-9.-]+/g, ""),
                          ) > 1 && (
                            <span className="text-red-400 text-sm">
                              (RTE FTE: -{bank.retention})
                            </span>
                          )}
                        </div>
                        <p className="text-yellow-400 text-sm">
                          Tu dinero habrá crecido: {bank.interests}
                        </p>
                      </div>
                    </article>

                    <article className="flex flex-col gap-2">
                      <article className="bg-[#122322] w-full text-[#00d992] px-4 py-2 rounded-md text-sm font-bold text-center self-start md:self-auto">
                        {bank.tasaEA}%
                      </article>

                      <DialogDetails {...bank} />
                    </article>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-500">
                Ingresa un monto y número de meses para calcular los
                rendimientos
                <div className="mt-4 flex justify-center items-center p-4 rounded-lg">
                  <Image
                    className="bg-neutral-900 rounded-full p-4 hover:scale-110 transition-all"
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
      </section>

      {/* Gráficos de Visualización */}
      {isFormFilled && chartData.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2 w-full px-4 xl:px-28">
          {/* Gráfico de Comparación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="text-[#00d992]" size={18} />
                  Comparación Top 5 Bancos
                </CardTitle>
                <CardDescription>
                  Rendimientos netos de los mejores bancos
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#333"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888" }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis hide domain={["auto", "auto"]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="returns"
                      fill="#00d992"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráfico de Crecimiento */}
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
                <CardDescription>
                  Evolución del saldo con el mejor banco
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#333"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888" }}
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
                        <stop
                          offset="5%"
                          stopColor="#00d992"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00d992"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      )}

      <section className="p-6 md:px-28 w-full md:w-[70%]">
        <Faq />
      </section>
      <Footer />
    </div>
  );
}
