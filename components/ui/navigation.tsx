"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import { Badge } from "./badge";
import LaunchUI from "../logos/launch-ui";
import { ReactNode } from "react";

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode;
  badge?: string;
}

interface NavigationProps {
  menuItems?: MenuItem[];
  components?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
    badge?: string;
  }[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Herramientas",
      content: "default",
    },
    {
      title: "Calculadora CDT",
      href: "/cdt",
      isLink: true,
      badge: "Nuevo",
    },
    {
      title: "Bancos",
      content: "components",
    },
    {
      title: "Terminos y condiciones",
      isLink: true,
      href: "/terminos-y-condiciones",
    },
  ],
  components = [
    {
      title: "Lista de bancos",
      href: "/banks",
      description:
        "Lista de bancos y tasas de interés actualizadas hasta la fecha.",
    },
    {
      title: "Ultima actualización",
      href: "/",
      description:
        "La ultima actualización de tasas fue el 17/01/2026.",
    },
    {
      title: "Reportes de tasas",
      href: "/",
      description:
        "¿Alguna tasa no coincide? Reporta la discrepancia y ayudanos a mejorar.",
    }
  ],
  logo = <LaunchUI />,
  logoTitle = "rendi",
  logoDescription = "Haz rendir tu dinero :)",
  logoHref = "/",
  introItems = [
    {
      title: "Calculadora de rendimientos",
      href: "/",
      description:
        "Encuentra la mejor tasa de interés para tu dinero y hazlo rendir.",
    },
    {
      title: "Calculadora CDT",
      href: "/cdt",
      description: "Calcula el rendimiento de tu CDT en segundos.",
      badge: "Nuevo",
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <Link href={item.href || ""} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <div className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="bg-[#00d992]/10 text-[#00d992] border-none text-[10px] px-1.5 py-0 h-4 uppercase font-bold">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </NavigationMenuLink>
              </Link>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href={logoHref}
                          >
                            <img src="/logo.png" alt={logoTitle} className="h-8 w-8 " />
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {logoTitle}
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {logoDescription}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem key={i} href={intro.href} title={intro.title} badge={intro.badge}>
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  badge,
  ...props
}: React.ComponentProps<"a"> & { title: string; badge?: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href ?? ''}
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium flex items-center gap-2">
            {title}
            {badge && (
              <Badge variant="secondary" className="bg-[#00d992]/10 text-[#00d992] border-none text-[10px] px-1.5 py-0 h-4 uppercase font-bold">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
