import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Banks } from "@/app/_DATA/Banks";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

interface CarouselCDTsProps {
    onSelectCDT: (rate: number, months: number) => void;
}

export function CarouselCDTs({ onSelectCDT }: CarouselCDTsProps) {
    // Flatten banks with multiple CDT options into individual items
    const cdtItems = Banks.flatMap(bank =>
        bank.cdtOptions?.map(option => ({
            bank,
            option
        })) || []
    );

    return (
        <div className="relative mx-auto md:px-4 max-w-7xl overflow-hidden">
            {/* Gradientes para mejorar la visibilidad */}
            <div className="hidden md:block pointer-events-none absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white dark:from-[#090d10] to-transparent z-10" />
            <div className="hidden md:block pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white dark:from-[#090d10] to-transparent z-10" />

            <Carousel
                plugins={[
                    AutoScroll({
                        active: true,
                        speed: 1,
                        stopOnMouseEnter:
                            typeof window !== "undefined" && window.innerWidth >= 1024,
                        stopOnInteraction: false,
                        stopOnFocusIn: false,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="flex snap-x scroll-pl-4">
                    {cdtItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="w-full sm:basis-1/1 md:basis-1/2 lg:basis-1/3"
                        >
                            <Card
                                className="transition-all hover:shadow-lg hover:scale-[1.03] duration-200 cursor-pointer hover:border-[#00d992]"
                                onClick={() => onSelectCDT(item.option.rate, item.option.months)}
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 p-1">
                                            <Image
                                                src={item.bank.image}
                                                alt={item.bank.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <div>
                                            <article className="flex items-center gap-2">
                                                <span className="text-lg font-bold whitespace-nowrap truncate">
                                                    {item.bank.name}
                                                </span>
                                            </article>
                                            <p className="text-neutral-400 text-sm">
                                                {item.option.months} meses • {item.option.rate}% E.A.
                                            </p>

                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#00d992]/10 text-[#00d992] dark:bg-[#00d992]/20 dark:text-[#00d992] mt-1">
                                                CDT Famoso
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-[#00d992]/10 text-[#00d992] p-2 rounded-lg hover:bg-[#00d992] hover:text-black transition-colors">
                                        <TrendingUp size={18} />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
