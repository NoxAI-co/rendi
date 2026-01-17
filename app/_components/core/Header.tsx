import Navigation from "@/components/ui/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logoSrc?: string;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
  logoAlt?: string;
  logoClassName?: string;
}

export default function Navbar({
  logoSrc = "/logo.png",
  logoAlt = "Logo",
  logoClassName = "h-8",
  name = "rendi",
  homeUrl = "/",
  mobileLinks = [
    { text: "Inicio", href: "/" },
    { text: "Calculadora CDT", href: "/cdt" },
    { text: "Bancos", href: "/" },
    { text: "Terminos y condiciones", href: "/terminos-y-condiciones" },
  ],
  actions = [
    {
      text: "Get Started",
      href: "/",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0  w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto flex items-center justify-between mt-4 px-4 bg-background/40 rounded-lg backdrop-blur-lg shadow-md border ">
        <NavbarComponent>
          <NavbarLeft>
            <Link
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              <img src={logoSrc} alt={logoAlt} className={logoClassName} />
              {name}
            </Link>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  asChild
                >
                  <Link href={action.href}>
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Link>
                </Button>
              ) : (
                <Link
                  key={index}
                  href={action.href}
                  className="hidden text-sm md:block"
                >
                  {action.text}
                </Link>
              )
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </Link>
                  {mobileLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
