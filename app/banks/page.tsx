"use client";

import { motion } from "framer-motion";
import { Banks, DepositosBajoMonto } from "../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { calculateMonthlyNetRate } from "@/lib/finance-utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useMemo } from "react";

// Posiciones explícitas en un grid de 4 columnas × 5 filas
// Notación CSS: "colStart / colEnd" y "rowStart / rowEnd"
// imgIdx: which siteImages slot to use for that position
const positions = [
  { col: "1 / 3", row: "1 / 3", large: true,  imgIdx: 0 }, // 0 — 2×2 hero
  { col: "3 / 4", row: "1 / 2", large: false, imgIdx: 1 }, // 1 — 1×1
  { col: "4 / 5", row: "1 / 3", large: false, imgIdx: 0 }, // 2 — 1×2 alto
  { col: "3 / 4", row: "2 / 3", large: false, imgIdx: 1 }, // 3 — 1×1
  { col: "1 / 2", row: "3 / 4", large: false, imgIdx: 1 }, // 4 — 1×1
  { col: "2 / 4", row: "3 / 5", large: true,  imgIdx: 0 }, // 5 — 2×2 centro
  { col: "4 / 5", row: "3 / 4", large: false, imgIdx: 1 }, // 6 — 1×1
  { col: "1 / 2", row: "4 / 5", large: false, imgIdx: 0 }, // 7 — 1×1
  { col: "4 / 5", row: "4 / 5", large: false, imgIdx: 1 }, // 8 — 1×1
  { col: "1 / 3", row: "5 / 6", large: false, imgIdx: 1 }, // 9 — 2×1 ancho
  { col: "3 / 5", row: "5 / 6", large: false, imgIdx: 0 }, // 10 — 2×1 ancho
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Construye el array con posiciones fijas para Nubank (pos 5) y RappiPay (pos 2)
function buildBanksOrder(all: typeof Banks): typeof Banks {
  const nubank   = all.find((b) => b.name === "Nubank");
  const rappipay = all.find((b) => b.name === "RappiPay");
  const rest     = shuffle(all.filter((b) => b.name !== "Nubank" && b.name !== "RappiPay"));

  // Slot 2 → RappiPay, Slot 5 → Nubank; los demás se llenan con el resto en orden
  const result: (typeof Banks[number] | undefined)[] = Array(11).fill(undefined);
  if (rappipay) result[2] = rappipay;
  if (nubank)   result[5] = nubank;

  let ri = 0;
  for (let i = 0; i < result.length; i++) {
    if (!result[i] && ri < rest.length) {
      result[i] = rest[ri++];
    }
  }

  return result.filter(Boolean) as typeof Banks;
}

export default function BanksPage() {
  const allBanks = useMemo(
    () => buildBanksOrder([...Banks, ...DepositosBajoMonto]),
    []
  );

  return (    <div className="flex flex-col space-y-8 pb-8 px-4 xl:px-40 2xl:px-64 pt-6 mx-auto w-full">

      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all text-sm text-foreground w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#00d992] tracking-tight">
            Entidades Financieras
          </h1>
          <p className="text-muted-foreground text-sm">
            Explora y compara las mejores tasas de interés en Colombia.
          </p>
        </div>

        <span className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-sm font-bold w-fit">
          <span className="text-[10px] uppercase tracking-wider text-[#00d992]/80">Total</span>
          {allBanks.length} entidades
        </span>
      </motion.div>

      {/* Desktop bento grid — explicit positions */}
      <motion.div
        className="hidden md:grid gap-3"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(5, 160px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {allBanks.map((bank, index) => {
          const pos = positions[index] ?? { col: "auto", row: "auto", large: false, imgIdx: 0 };
          const forcedImg = (bank.name === "Nubank" || bank.name === "RappiPay") ? 0 : pos.imgIdx;
          const hero = bank.siteImages?.[forcedImg] ?? bank.siteImages?.[0] ?? bank.image;
          const slug = encodeURIComponent(bank.name.toLowerCase().replace(/ /g, "-"));
          const monthlyNet = calculateMonthlyNetRate(bank.tasaEA).toFixed(2);

          return (
            <motion.div
              key={bank.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              style={{ gridColumn: pos.col, gridRow: pos.row }}
            >
              <BentoCard
                bank={bank}
                hero={hero}
                slug={slug}
                monthlyNet={monthlyNet}
                large={pos.large}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile simple 2-col grid */}
      <motion.div
        className="grid md:hidden grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {allBanks.map((bank, index) => {
          const isLarge = positions[index]?.large ?? false;
          const imgIdx = (bank.name === "Nubank" || bank.name === "RappiPay") ? 0 : (positions[index]?.imgIdx ?? 0);
          const hero = bank.siteImages?.[imgIdx] ?? bank.siteImages?.[0] ?? bank.image;
          const slug = encodeURIComponent(bank.name.toLowerCase().replace(/ /g, "-"));
          const monthlyNet = calculateMonthlyNetRate(bank.tasaEA).toFixed(2);

          return (
            <div
              key={bank.id}
              className={isLarge ? "col-span-2 h-[220px]" : "col-span-1 h-[160px]"}
            >
              <BentoCard
                bank={bank}
                hero={hero}
                slug={slug}
                monthlyNet={monthlyNet}
                large={isLarge}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

interface BentoCardProps {
  bank: { name: string; image: string; tasaEA: number; act?: boolean; type?: string };
  hero: string;
  slug: string;
  monthlyNet: string;
  large: boolean;
}

function BentoCard({ bank, hero, slug, monthlyNet, large }: BentoCardProps) {
  return (
    <Link
      href={`/bank/${slug}`}
      className="group relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:border-[#00d992]/40 transition-all duration-300"
    >
      {/* Hero image */}
      <Image
        src={hero}
        alt={bank.name}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      />

      {/* Progressive blur */}
      <ProgressiveBlur
        position="bottom"
        height={large ? "45%" : "65%"}
        blurLevels={[0.5, 1, 2, 4, 8, 16, 32, 64]}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(9,13,16,0.92) 0%, rgba(9,13,16,0.45) 30%, rgba(9,13,16,0) 60%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 gap-1.5">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white/10 border border-white/20 shrink-0">
            <Image src={bank.image} alt={bank.name} fill className="object-contain p-0.5" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <p className="text-white font-semibold text-xs leading-tight truncate drop-shadow">
              {bank.name}
            </p>
            {bank.act && <CheckCircle2 className="w-3 h-3 text-[#00d992] shrink-0" />}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-baseline gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <span className={`text-[#00d992] font-black leading-none ${large ? "text-2xl" : "text-sm"}`}>
              {bank.tasaEA}%
            </span>
            <span className="text-white/60 text-[9px] uppercase tracking-wider">EA</span>
          </div>
          <div className="flex items-baseline gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-[#8bf5cf] font-bold text-xs leading-none">{monthlyNet}%</span>
            <span className="text-white/60 text-[9px] uppercase tracking-wider">mes</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
