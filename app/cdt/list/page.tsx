"use client";

import React from "react";
import Navbar from "../../_components/core/Header";
import { Footer } from "../../_components/core/Footer";
import { Banks } from "../../_DATA/Banks";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function CDTList() {
    const allCDTs = Banks.flatMap((bank) =>
        (bank.cdtOptions || []).map((option) => ({ bank, option }))
    ).sort((a, b) => b.option.rate - a.option.rate);

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
                            Explora y compara todas las opciones de inversión a término fijo disponibles.
                        </p>
                    </div>

                    <span className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-sm font-bold w-fit">
                        <span className="text-[10px] uppercase tracking-wider text-[#00d992]/80">Total</span>
                        {allCDTs.length} opciones
                    </span>
                </motion.div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {allCDTs.map((item, index) => (
                        <motion.div key={`${item.bank.id}-${index}`} variants={itemVariants}>
                            <Link
                                href={`/bank/${encodeURIComponent(item.bank.name.toLowerCase().replace(/ /g, "-"))}`}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl hover:border-[#00d992]/30 hover:bg-background/60 transition-all duration-200 shadow-lg h-full"
                            >
                                {/* Ambient glow on hover */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#00d992]/0 group-hover:bg-[#00d992]/10 blur-2xl transition-all duration-300 pointer-events-none" />

                                {/* Top: logo + name */}
                                <div className="flex items-center gap-3 p-4 pb-3">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                        <Image
                                            src={item.bank.image}
                                            alt={item.bank.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-foreground font-semibold text-sm leading-tight truncate">
                                            {item.bank.name}
                                        </p>
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider mt-0.5">
                                            {item.option.months} {item.option.months === 1 ? "mes" : "meses"}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/5 mx-4" />

                                {/* Bottom: rate */}
                                <div className="flex items-end justify-between p-4 pt-3 mt-auto">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                            Tasa EA
                                        </p>
                                        <p className="text-3xl font-black text-[#00d992] leading-none">
                                            {item.option.rate}%
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-[#00d992]/10 text-[#00d992] group-hover:bg-[#00d992] group-hover:text-black transition-all duration-200 mb-1">
                                        <TrendingUp size={16} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

   
        </div>
    );
}
