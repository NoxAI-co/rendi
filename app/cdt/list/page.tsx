"use client";

import React from "react";
import { Banks } from "../../_DATA/Banks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// 3-col × 6-row bento — patrón completamente diferente al de banks
// pos 0 = banner full-width, luego alternancia de tall/wide/small
const positions: Array<{ col: string; row: string; size: "full" | "tall" | "wide" | "sm" }> = [
  { col: "1 / 4", row: "1 / 2", size: "full" }, // 0 — banner completo
  { col: "1 / 2", row: "2 / 4", size: "tall" }, // 1 — alto izquierda
  { col: "2 / 3", row: "2 / 3", size: "sm"   }, // 2
  { col: "3 / 4", row: "2 / 3", size: "sm"   }, // 3
  { col: "2 / 4", row: "3 / 4", size: "wide" }, // 4 — ancho derecha
  { col: "1 / 3", row: "4 / 5", size: "wide" }, // 5 — ancho izquierda
  { col: "3 / 4", row: "4 / 6", size: "tall" }, // 6 — alto derecha
  { col: "1 / 2", row: "5 / 6", size: "sm"   }, // 7
  { col: "2 / 3", row: "5 / 6", size: "sm"   }, // 8
  { col: "1 / 2", row: "6 / 7", size: "sm"   }, // 9
  { col: "2 / 4", row: "6 / 7", size: "wide" }, // 10 — ancho final
];

// full/tall usan siteImages[0], el resto siteImages[1]
const imgSlots = [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1];

export default function CDTList() {
  const router = useRouter();
  const allCDTs = Banks.flatMap((bank) =>
    (bank.cdtOptions || []).map((option) => ({ bank, option }))
  ).sort((a, b) => b.option.rate - a.option.rate);

  return (
    <div className="flex flex-col space-y-8 pb-8 px-4 xl:px-28 pt-6  max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <Link
            href="/cdt"
            className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all text-sm text-foreground w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Calculadora CDT
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#00d992] tracking-tight">
            Todos los CDTs
          </h1>
          <p className="text-muted-foreground text-sm">
            Explora y compara todas las opciones de inversión a término fijo.
          </p>
        </div>

        <span className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-sm font-bold w-fit">
          <span className="text-[10px] uppercase tracking-wider text-[#00d992]/80">Total</span>
          {allCDTs.length} opciones
        </span>
      </motion.div>

      {/* Desktop bento — 3 columnas */}
      <motion.div
        className="hidden md:grid gap-3"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(6, 140px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {allCDTs.map((item, index) => {
          const pos = positions[index] ?? { col: "auto", row: "auto", size: "sm" as const };
          const imgIdx = imgSlots[index] ?? 0;
          const hero = item.bank.siteImages?.[imgIdx] ?? item.bank.siteImages?.[0] ?? item.bank.image;
          const slug = encodeURIComponent(item.bank.name.toLowerCase().replace(/ /g, "-"));

          return (
            <motion.div
              key={`${item.bank.id}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ gridColumn: pos.col, gridRow: pos.row }}
            >
              <CDTCard
                item={item}
                hero={hero}
                slug={slug}
                size={pos.size}
                onCalculate={() =>
                  router.push(`/cdt?rate=${item.option.rate}&months=${item.option.months}`)
                }
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile — 2 columnas simples */}
      <div className="grid md:hidden grid-cols-2 gap-3">
        {allCDTs.map((item, index) => {
          const size = positions[index]?.size ?? "sm";
          const imgIdx = imgSlots[index] ?? 0;
          const hero = item.bank.siteImages?.[imgIdx] ?? item.bank.siteImages?.[0] ?? item.bank.image;
          const slug = encodeURIComponent(item.bank.name.toLowerCase().replace(/ /g, "-"));
          const isWide = size === "full" || size === "wide";

          return (
            <div
              key={`${item.bank.id}-${index}-m`}
              className={isWide ? "col-span-2 h-[140px]" : "col-span-1 h-[140px]"}
            >
              <CDTCard
                item={item}
                hero={hero}
                slug={slug}
                size={isWide ? "wide" : "sm"}
                onCalculate={() =>
                  router.push(`/cdt?rate=${item.option.rate}&months=${item.option.months}`)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CDTCardProps {
  item: { bank: { name: string; image: string }; option: { rate: number; months: number } };
  hero: string;
  slug: string;
  size: "full" | "tall" | "wide" | "sm";
  onCalculate: () => void;
}

function CDTCard({ item, hero, slug, size, onCalculate }: CDTCardProps) {
  if (size === "full") {
    return (
      <Link
        href={`/bank/${slug}`}
        className="group relative flex w-full h-full rounded-2xl overflow-hidden border border-white/8 shadow-lg hover:border-[#00d992]/40 hover:shadow-2xl transition-all duration-300"
      >
        {/* Imagen de fondo con blur medio */}
        <Image
          src={hero}
          alt={item.bank.name}
          fill
          unoptimized
          className="object-cover scale-110 blur-sm opacity-20"
          sizes="80vw"
        />
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex w-full items-center gap-6 p-5">
          {/* Logo grande */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shrink-0 shadow-xl">
            <Image src={item.bank.image} alt={item.bank.name} fill className="object-contain p-1 rounded-2xl" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-foreground font-bold text-base leading-tight">{item.bank.name}</p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {item.option.months} {item.option.months === 1 ? "mes" : "meses"} · CDT
            </p>
          </div>

          {/* Tasa hero */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-[#00d992] font-black text-6xl leading-none tracking-tight">{item.option.rate}</span>
            <div className="flex flex-col">
              <span className="text-[#00d992]/80 font-black text-2xl leading-none">%</span>
              <span className="text-muted-foreground text-[9px] uppercase tracking-wider">EA</span>
            </div>
          </div>

          {/* Botón */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCalculate(); }}
            className="shrink-0 px-4 py-2 rounded-full bg-[#00d992] text-black text-xs font-bold hover:bg-[#00d992]/85 transition-all shadow-lg"
          >
            Calcular
          </button>
        </div>
      </Link>
    );
  }

  if (size === "tall") {
    return (
      <Link
        href={`/bank/${slug}`}
        className="group relative flex flex-col w-full h-full rounded-2xl overflow-hidden border border-white/8 shadow-lg hover:border-[#00d992]/40 hover:shadow-2xl transition-all duration-300"
      >
        {/* Imagen de fondo con blur medio */}
        <Image
          src={hero}
          alt={item.bank.name}
          fill
          unoptimized
          className="object-cover scale-110 blur-sm opacity-20"
          sizes="25vw"
        />
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full p-4 gap-2">
          {/* Top: logo grande + nombre */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shrink-0 shadow-lg">
              <Image src={item.bank.image} alt={item.bank.name} fill className="object-contain p-1 rounded-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground font-bold text-sm leading-tight truncate">{item.bank.name}</p>
              <span className="text-muted-foreground text-[9px] uppercase tracking-wider">
                {item.option.months} {item.option.months === 1 ? "mes" : "meses"}
              </span>
            </div>
          </div>

          {/* Center: tasa hero */}
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Tasa EA</span>
            <div className="flex items-start">
              <span className="text-[#00d992] font-black text-6xl leading-none tracking-tight">{item.option.rate}</span>
              <span className="text-[#00d992] font-black text-3xl leading-none mt-1">%</span>
            </div>
          </div>

          {/* Bottom: botón */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCalculate(); }}
            className="w-full py-2 rounded-xl bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-xs font-bold hover:bg-[#00d992] hover:text-black transition-all"
          >
            Calcular →
          </button>
        </div>
      </Link>
    );
  }

  if (size === "wide") {
    // Card ancha: logo + nombre a la izquierda, tasa grande a la derecha
    return (
      <Link
        href={`/bank/${slug}`}
        className="group relative flex items-center w-full h-full rounded-2xl overflow-hidden border border-white/8 bg-background/40 backdrop-blur-xl shadow-lg hover:border-[#00d992]/40 hover:shadow-2xl transition-all duration-300 px-4 gap-4"
      >
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#00d992]/8 blur-2xl pointer-events-none group-hover:bg-[#00d992]/15 transition-all" />

        {/* Logo */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
          <Image src={item.bank.image} alt={item.bank.name} fill className="object-contain p-0.5 rounded-2xl" />
        </div>

        {/* Nombre + meses */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-foreground font-semibold text-sm truncate">{item.bank.name}</p>
          <p className="text-muted-foreground text-[10px] uppercase tracking-wider">
            {item.option.months} {item.option.months === 1 ? "mes" : "meses"}
          </p>
        </div>

        {/* Tasa */}
        <div className="flex items-baseline gap-0.5 shrink-0">
          <span className="text-[#00d992] font-black text-4xl leading-none tracking-tight">{item.option.rate}</span>
          <span className="text-[#00d992]/80 font-black text-xl leading-none">%</span>
        </div>

        {/* Botón */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCalculate(); }}
          className="shrink-0 px-3 py-1.5 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-[10px] font-bold hover:bg-[#00d992] hover:text-black transition-all"
        >
          Calcular
        </button>
      </Link>
    );
  }

  // sm — card pequeña compacta
  return (
    <Link
      href={`/bank/${slug}`}
      className="group relative flex flex-col justify-between w-full h-full rounded-2xl overflow-hidden border border-white/8 bg-background/40 backdrop-blur-xl shadow-lg hover:border-[#00d992]/40 hover:shadow-2xl transition-all duration-300 p-3"
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#00d992]/8 blur-xl pointer-events-none group-hover:bg-[#00d992]/18 transition-all" />

      {/* Logo + nombre */}
      <div className="flex items-center gap-1.5">
        <div className="relative w-6 h-6 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
          <Image src={item.bank.image} alt={item.bank.name} fill className="object-contain p-0.5" />
        </div>
        <p className="text-foreground font-medium text-xs truncate flex-1">{item.bank.name}</p>
      </div>

      {/* Tasa */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-[#00d992] font-black text-3xl leading-none tracking-tight">{item.option.rate}</span>
        <span className="text-[#00d992]/80 font-black text-lg leading-none">%</span>
      </div>

      {/* Meses + botón */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-muted-foreground text-[9px] uppercase tracking-wider">
          {item.option.months} {item.option.months === 1 ? "mes" : "meses"}
        </span>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCalculate(); }}
          className="px-2 py-0.5 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-[9px] font-bold hover:bg-[#00d992] hover:text-black transition-all"
        >
          →
        </button>
      </div>
    </Link>
  );
}
