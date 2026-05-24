"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/banks", label: "Bancos" },
  { href: "/cdt", label: "Calculadora CDT", badge: "Nuevo" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 h-12 rounded-2xl bg-background/50 backdrop-blur-xl border border-white/8 shadow-lg">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="rendi" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-foreground tracking-tight">rendi</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all",
                  pathname === link.href
                    ? "bg-[#00d992]/15 text-[#00d992] font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
                {link.badge && (
                  <Badge className="bg-[#00d992]/15 text-[#00d992] border-none text-[9px] px-1.5 py-0 h-4 uppercase font-bold">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-72 bg-background/95 backdrop-blur-xl border-l border-white/8 shadow-2xl flex flex-col p-6 gap-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Image src="/logo.png" alt="rendi" width={24} height={24} className="rounded-md" />
                <span className="font-bold text-foreground">rendi</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-all",
                    pathname === link.href
                      ? "bg-[#00d992]/15 text-[#00d992] font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <Badge className="bg-[#00d992]/15 text-[#00d992] border-none text-[9px] px-1.5 py-0 h-4 uppercase font-bold">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-auto">
              <Link
                href="/terminos-y-condiciones"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
