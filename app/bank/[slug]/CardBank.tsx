"use client";

import { motion } from "framer-motion";
import { Banks, DepositosBajoMonto } from "../../_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateMonthlyNetRate } from "@/lib/finance-utils";

interface CardBankProps {
  slug: string;
}

export const DetailedCardBank = ({ slug }: CardBankProps) => {
  const allBanks = [...Banks, ...DepositosBajoMonto];

  // Find the bank that matches the normalized slug
  const bank = allBanks.find((bank) => bank.name.toLowerCase() === slug);

  const router = useRouter();

  // Add this check
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <motion.div
        className="absolute top-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md border border-border hover:bg-background/90 transition-all"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      </motion.div>

      <motion.div
        className="max-w-md w-full  rounded-2xl shadow-lg overflow-hidden border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for Apple-like feel
          delay: 0.1,
        }}
      >
        {/* Header with dark gradient */}
        <div className="relative h-48 backdrop-blur-md bg-white/50 dark:bg-black/30 ">
          <motion.div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={bank.image}
              alt={bank.name}
              width={100}
              height={100}
              className="rounded-lg object-cover shadow-md"
            />
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          className="backdrop-blur-md p-6 bg-background/100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Title section */}
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h1 className="text-2xl font-semibold text-foreground">
              {bank.name}
            </h1>
            {bank.type && (
              <span className="text-sm text-muted-foreground mt-1">
                {bank.type}
              </span>
            )}
          </motion.div>

          {/* Rate card - highlighted like featured content */}
          <motion.div
            className="bg-primary/10 rounded-xl p-5 mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(var(--primary), 0.15)",
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tasa EA</span>
              <div className="flex flex-col items-end">
                <motion.span
                  className="text-3xl font-bold text-primary"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {bank.tasaEA}%
                </motion.span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-primary/20 bg-primary/10 text-[10px] text-primary/90 mt-2">
                  <span className="uppercase tracking-wide text-primary/70">Neto mes</span>
                  <span className="font-semibold">
                    {calculateMonthlyNetRate(bank.tasaEA).toFixed(2)}%
                  </span>
                </span>
                {bank.act && (
                  <motion.span
                    className="text-xs text-green-500 flex items-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Actualizado
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Information list with iOS-style separators */}
          <motion.div
            className="rounded-xl overflow-hidden border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <motion.div
              className="flex justify-between items-center p-4 bg-card"
              whileHover={{ backgroundColor: "rgba(var(--card), 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-muted-foreground">ID Interno</span>
              <span className="font-medium text-foreground">{bank.id}</span>
            </motion.div>
            <div className="h-px bg-border"></div>
            <motion.div
              className="flex justify-between items-center p-4 bg-card"
              whileHover={{ backgroundColor: "rgba(var(--card), 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-muted-foreground">Tipo de producto</span>
              <span className="font-medium text-foreground">
                {bank.type || "Sin definir"}
              </span>
            </motion.div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            className="text-xs text-muted-foreground text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Esta información corresponde a las tasas vigentes al momento de la
            consulta.
          </motion.p>

        </motion.div>
      </motion.div>
    </div>
  );
};
