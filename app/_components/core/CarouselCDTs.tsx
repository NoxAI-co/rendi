"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Banks } from "@/app/_DATA/Banks";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

interface CarouselCDTsProps {
  onSelectCDT: (rate: number, months: number) => void;
}

export function CarouselCDTs({ onSelectCDT }: CarouselCDTsProps) {
  const rawItems = Banks.flatMap(
    (bank) => bank.cdtOptions?.map((option) => ({ bank, option })) || []
  );
  // Duplicate enough times so the loop is seamless regardless of item count
  const cdtItems = [...rawItems, ...rawItems, ...rawItems, ...rawItems];

  return (
    <div className="relative mx-auto md:px-4 max-w-7xl overflow-hidden">
      <div className="hidden md:block pointer-events-none absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white dark:from-[#090d10] to-transparent z-10" />
      <div className="hidden md:block pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white dark:from-[#090d10] to-transparent z-10" />

      <Carousel
        plugins={[
          AutoScroll({
            active: true,
            speed: 0.8,
            stopOnMouseEnter:
              typeof window !== "undefined" && window.innerWidth >= 1024,
            stopOnInteraction: false,
            stopOnFocusIn: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-3 py-3">
          {cdtItems.map((item, index) => {
            const hero = item.bank.siteImages?.[0] ?? item.bank.image;
            const slug = encodeURIComponent(
              item.bank.name.toLowerCase().replace(/ /g, "-")
            );

            return (
              <CarouselItem key={index} className="pl-3 basis-[280px] md:basis-[300px]">
                <Link
                  href={`/bank/${slug}`}
                  className="group relative block h-[160px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-xl hover:border-[#00d992]/40 transition-all duration-300"
                >
                  {/* Hero image */}
                  <Image
                    src={hero}
                    alt={item.bank.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="300px"
                  />

                  {/* Progressive blur bottom */}
                  <ProgressiveBlur
                    position="bottom"
                    height="65%"
                    blurLevels={[0.5, 1, 2, 4, 8, 16, 32, 64]}
                  />

                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(9,13,16,0.92) 0%, rgba(9,13,16,0.6) 35%, rgba(9,13,16,0.1) 60%, rgba(9,13,16,0) 75%)",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 gap-2">
                    {/* Logo + name + months */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white/10 border border-white/20 shrink-0">
                        <Image
                          src={item.bank.image}
                          alt={item.bank.name}
                          fill
                          className="object-contain p-0.5 rounded-lg"
                        />
                      </div>
                      <p className="text-white font-semibold text-xs truncate drop-shadow flex-1">
                        {item.bank.name}
                      </p>
                      <span className="text-white/60 text-[9px] uppercase tracking-wider shrink-0">
                        {item.option.months} {item.option.months === 1 ? "mes" : "meses"}
                      </span>
                    </div>

                    {/* Rate + actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline gap-1 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex-1">
                        <span className="text-[#00d992] font-black text-xl leading-none">
                          {item.option.rate}%
                        </span>
                        <span className="text-white/60 text-[9px] uppercase tracking-wider">
                          EA
                        </span>
                      </div>

                      {/* Apply to calculator */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectCDT(item.option.rate, item.option.months);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white text-black text-[10px] font-bold hover:bg-[#00d992] transition-all shadow-md shrink-0"
                      >
                        <Zap className="w-3 h-3" />
                        Simular
                      </button>

                      {/* Go to bank */}
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
