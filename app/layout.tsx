import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Blobs } from "./_components/core/Blob";
import Navbar from "./_components/core/Header";
import { Footer } from "./_components/core/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rendi.eddyy.dev'),
  title: "rendi - Calculadora de Rendimientos",
  description:
    "Optimiza tus ahorros y descubre cuánto puedes ganar con las mejores tasas de ahorro en Colombia. Calcula tus rendimientos fácil y rápido.",
  keywords: [
    "calculadora de ahorro",
    "rendimientos bancarios",
    "tasas de interés en Colombia",
    "cuentas de ahorro",
    "depósitos a bajo monto",
    "mejor banco para ahorrar",
    "comparar tasas de interés",
    "rendimientos en Colombia",
    "mejores tasas de ahorro",
    "calcular ahorros bancolombia",
    "calcular ahorros davivienda",	
  ],
  robots: "index, follow",
  openGraph: {
    title: "rendi - Calculadora de Rendimientos en Colombia",
    description:
      "Optimiza tus ahorros y descubre cuánto puedes ganar con las mejores tasas de ahorro en Colombia.",
    url: "https://rendi.eddyy.dev/",
    siteName: "rendi",
    images: [
      {
        url: "/rendibg.png",
        width: 1200,
        height: 630,
        alt: "rendi - Calculadora de Rendimientos",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rendi - Calculadora de Rendimientos en Colombia",
    description:
      "Descubre cuánto puedes ganar con las mejores tasas de ahorro en Colombia.",
    images: ["/rendibg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col text-white">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Analytics />
          <Blobs />
        </ThemeProvider>
        <script type="text/javascript">
          {`
            (function(d, t) {
                var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
                v.onload = function() {
                  window.voiceflow.chat.load({
                    verify: { projectID: '67aa0103f1b2f4adafb9ec28' },
                    url: 'https://general-runtime.voiceflow.com',
                    versionID: 'production'
                  });
                }
                v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
            })(document, 'script');
          `}
        </script>
      </body>
    </html>
  );
}