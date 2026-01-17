"use client";

import React from "react";
import Navbar from "../../_components/core/Header";
import { Footer } from "../../_components/core/Footer";
import { Banks } from "../../_DATA/Banks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, TrendingUp, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CDTList() {
    // Flatten all CDT options from all banks
    const allCDTs = Banks.flatMap(bank =>
        (bank.cdtOptions || []).map(option => ({
            bank,
            option
        }))
    ).sort((a, b) => b.option.rate - a.option.rate); // Sort by rate descending

    return (
        <div className="min-h-screen text-white flex flex-col items-center space-y-12">
            <Navbar />

            <div className="w-full px-4 xl:px-28 space-y-8 mt-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Link
                            href="/cdt"
                            className="text-neutral-400 hover:text-[#00d992] text-sm font-medium transition-colors flex items-center gap-1 w-fit"
                        >
                            <ChevronLeft size={16} />
                            Regresar a la calculadora
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#00d992]">
                            Todos los CDTs Registrados
                        </h1>
                        <p className="text-neutral-400">
                            Explora y compara todas las opciones de inversión a término fijo disponibles.
                        </p>
                    </div>

                    <Badge variant="outline" className="w-fit h-fit py-2 px-4 border-[#00d992]/30 text-[#00d992] bg-[#00d992]/5">
                        {allCDTs.length} Opciones encontradas
                    </Badge>
                </div>

                {/* List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allCDTs.map((item, index) => (
                        <motion.div
                            key={`${item.bank.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href="/cdt">
                                <Card className="bg-[#090d10] border-neutral-800 hover:border-[#00d992]/50 transition-all hover:scale-[1.02] duration-200 group overflow-hidden h-full flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Landmark size={60} />
                                    </div>

                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 p-1 shrink-0">
                                            <Image
                                                src={item.bank.image}
                                                alt={item.bank.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{item.bank.name}</CardTitle>
                                            <CardDescription className="text-xs uppercase tracking-wider">
                                                {item.option.months} MESES
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="mt-auto pt-4 border-t border-neutral-800/50">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-neutral-500 text-[10px] font-bold uppercase">Tasa Efectiva Anual</p>
                                                <div className="text-3xl font-black text-[#00d992]">
                                                    {item.option.rate}%
                                                </div>
                                            </div>
                                            <div className="bg-[#00d992]/10 text-[#00d992] p-2 rounded-lg group-hover:bg-[#00d992] group-hover:text-black transition-colors mb-1">
                                                <TrendingUp size={18} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
