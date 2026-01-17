"use client";

import { motion } from "framer-motion";
import { Banks, DepositosBajoMonto } from "../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../_components/core/Header";
import { Footer } from "../_components/core/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, TrendingUp, ChevronLeft } from "lucide-react";

export default function BanksPage() {
  const allBanks = [...Banks, ...DepositosBajoMonto];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Apple-like easing
      },
    },
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center space-y-12">
      <Navbar />

      <div className="w-full px-4 xl:px-28 space-y-8 mt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/"
              className="text-neutral-400 hover:text-[#00d992] text-sm font-medium transition-colors flex items-center gap-1 w-fit"
            >
              <ChevronLeft size={16} />
              Regresar al inicio
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00d992]">
              Entidades Financieras
            </h1>
            <p className="text-neutral-400">
              Explora y compara las mejores tasas de interés en el mercado financiero colombiano.
            </p>
          </div>

          <Badge variant="outline" className="w-fit h-fit py-2 px-4 border-[#00d992]/30 text-[#00d992] bg-[#00d992]/5">
            {allBanks.length} Entidades registradas
          </Badge>
        </div>

        {/* List Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allBanks.map((bank, index) => (
            <motion.div
              key={bank.id}
              variants={itemVariants}
            >
              <Link href={`/bank/${bank.name.toLowerCase()}`}>
                <Card className="bg-[#090d10] border-neutral-800 hover:border-[#00d992]/50 transition-all hover:scale-[1.02] duration-200 group overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Landmark size={60} />
                  </div>

                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 p-1 shrink-0">
                      <Image
                        src={bank.image}
                        alt={bank.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wider">
                        {bank.type || "Entidad Financiera"}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto pt-4 border-t border-neutral-800/50">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-neutral-500 text-[10px] font-bold uppercase">Tasa Efectiva Anual</p>
                        <div className={`text-3xl font-black ${bank.act ? 'text-[#00d992]' : 'text-neutral-300'}`}>
                          {bank.tasaEA}%
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg transition-colors mb-1 ${bank.act ? 'bg-[#00d992]/10 text-[#00d992] group-hover:bg-[#00d992] group-hover:text-black' : 'bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700'}`}>
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    {bank.act && (
                      <div className="mt-3 flex items-center gap-1.5 text-[#00d992] text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d992] animate-pulse" />
                        Actualizado
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
