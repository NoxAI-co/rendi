"use client";

import { motion } from "framer-motion";
import { Banks, DepositosBajoMonto } from "../../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateMonthlyNetRate } from "@/lib/finance-utils";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useCallback } from "react";

interface CardBankProps {
  slug: string;
}

export const DetailedCardBank = ({ slug }: CardBankProps) => {
  const allBanks = [...Banks, ...DepositosBajoMonto];
  const bank = allBanks.find((bank) => bank.name.toLowerCase() === slug);

  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({ startDelay: 1000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!bank) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Banco no encontrado</h1>
        <p>No pudimos encontrar información para el banco solicitado.</p>
        <Link href="/" className="mt-6 text-primary hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const monthlyNet = calculateMonthlyNetRate(bank.tasaEA).toFixed(2);
  const heroImage = bank.siteImages?.[0];
  const screenshots = bank.siteImages ?? [];

  return (
    <div className="min-h-screen w-full px-4 py-8 lg:py-12">
      <motion.div
        className="max-w-5xl mx-auto mb-6 flex items-center justify-between gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md border border-border hover:bg-background transition-all text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        {bank.website && (
          <a
            href={bank.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
          >
            Visitar sitio
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </motion.div>

      {/* HERO — App Store style */}
      <motion.section
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover scale-110 blur-md opacity-80"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 p-8 md:p-12 min-h-[260px] md:min-h-[300px]">
          <Image
            src={bank.image}
            alt={bank.name}
            width={140}
            height={140}
            className="rounded-3xl object-cover shadow-2xl border border-white/10 shrink-0"
          />
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {bank.name}
            </h1>
            <p className="text-muted-foreground text-base">
              {bank.type ?? "Cuenta de ahorros"}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              {bank.act && (
                <span className="inline-flex items-center gap-1.5 text-xs text-green-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Actualizado
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* STATS — App Store metadata row */}
      <motion.section
        className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 md:divide-x divide-border rounded-2xl border border-border bg-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <StatItem label="Tasa EA" value={`${bank.tasaEA}%`} />
        <StatItem label="Neto mensual" value={`${monthlyNet}%`} />
        <StatItem label="Tipo" value={bank.type ?? "—"} />
      </motion.section>

      {/* SCREENSHOTS — auto-scroll carousel */}
      {screenshots.length > 0 && (
        <motion.section
          className="max-w-5xl mx-auto mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Vista previa</h2>
            {screenshots.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all text-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-4">
              {screenshots.map((src, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[320px] md:w-[380px] aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-lg bg-card"
                >
                  <Image
                    src={src}
                    alt={`${bank.name} captura ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 768px) 380px, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* CDT OPTIONS */}
      {bank.cdtOptions && bank.cdtOptions.length > 0 && (
        <motion.section
          className="max-w-5xl mx-auto mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            CDTs disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bank.cdtOptions.map((cdt, i) => (
              <Link
                key={i}
                href={`/cdt?rate=${cdt.rate}&months=${cdt.months}`}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl text-center hover:border-[#00d992]/30 hover:bg-background/60 transition-all group"
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {cdt.months} {cdt.months === 1 ? "mes" : "meses"}
                </span>
                <span className="text-3xl font-black text-[#00d992] leading-none">
                  {cdt.rate}%
                </span>
                <span className="text-[10px] text-muted-foreground group-hover:text-[#00d992]/70 transition-colors">
                  Calcular →
                </span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      <motion.p
        className="max-w-5xl mx-auto text-xs text-muted-foreground text-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Esta información corresponde a las tasas vigentes al momento de la
        consulta.
      </motion.p>
    </div>
  );
};

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 text-center border-t border-border first:border-t-0 md:border-t-0">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm md:text-base font-semibold text-foreground mt-1.5 line-clamp-1">
        {value}
      </span>
    </div>
  );
}
