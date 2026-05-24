import Image from "next/image";
import Link from "next/link";
import { LAST_UPDATE } from "@/lib/last-update";

export const Footer = () => {
  return (
    <footer className="w-full mt-16 px-4 pb-8">
      <div className="max-w-5xl mx-auto rounded-3xl border border-white/8 bg-background/40 backdrop-blur-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image src="/logo.png" alt="rendi" width={28} height={28} className="rounded-md" />
              <span className="font-bold text-foreground">rendi</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Optimiza tus ahorros y descubre cuánto puedes ganar con las mejores tasas en Colombia.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-[#00d992]/10 text-[#00d992] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d992]" />
              Actualizado: {LAST_UPDATE}
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Herramientas
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Calculadora de ahorros
              </Link>
              <Link href="/cdt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Calculadora CDT
              </Link>
              <Link href="/banks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ver todos los bancos
              </Link>
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
              Legal
            </h3>
            <Link href="/terminos-y-condiciones" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos y condiciones
            </Link>
          </div>

          {/* Creator */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Las tasas mostradas son referenciales. No constituyen asesoría financiera.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
