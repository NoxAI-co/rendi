"use client";

import { motion } from "framer-motion";
import { Banks, DepositosBajoMonto } from "../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../_components/core/Header";
import { Footer } from "../_components/core/Footer";
import { ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";
import { calculateMonthlyNetRate } from "@/lib/finance-utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function BanksPage() {
  const allBanks = [...Banks, ...DepositosBajoMonto];

  return (
    <div className="min-h-screen text-white flex flex-col items-center space-y-10">
      <Navbar />

      <div className="w-full px-4 xl:px-28 space-y-8">
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

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allBanks
            .slice()
            .sort((a, b) => b.tasaEA - a.tasaEA)
            .map((bank) => (
              <motion.div key={bank.id} variants={itemVariants}>
                <Link
                  href={`/bank/${encodeURIComponent(bank.name.toLowerCase().replace(/ /g, "-"))}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl hover:border-[#00d992]/30 hover:bg-background/60 transition-all duration-200 shadow-lg h-full"
                >
                  {/* Ambient glow on hover */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#00d992]/0 group-hover:bg-[#00d992]/10 blur-2xl transition-all duration-300 pointer-events-none" />

                  {/* Top: logo + name */}
                  <div className="flex items-center gap-3 p-4 pb-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <Image
                        src={bank.image}
                        alt={bank.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-semibold text-sm leading-tight truncate">
                        {bank.name}
                      </p>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider mt-0.5 truncate">
                        {bank.type || "Entidad Financiera"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/5 mx-4" />

                  {/* Bottom: rates */}
                  <div className="flex items-end justify-between p-4 pt-3 mt-auto">
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Tasa EA
                      </p>
                      <p className="text-3xl font-black text-[#00d992] leading-none">
                        {bank.tasaEA}%
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-[#00d992]/20 bg-[#00d992]/10 text-[10px]">
                        <span className="uppercase tracking-wide text-[#00d992]/70">
                          Neto mes
                        </span>
                        <span className="font-semibold text-[#8bf5cf]">
                          {calculateMonthlyNetRate(bank.tasaEA).toFixed(2)}%
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="p-2 rounded-xl bg-[#00d992]/10 text-[#00d992] group-hover:bg-[#00d992] group-hover:text-black transition-all duration-200">
                        <TrendingUp size={16} />
                      </div>
                      {bank.act && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-500 font-medium">
                          <CheckCircle2 size={10} />
                          Actualizado
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
