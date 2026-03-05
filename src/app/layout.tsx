import type { Metadata, Viewport } from "next";
import { Roboto_Condensed, Montserrat, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-roboto-condensed",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Real Dough Pizza Co. — Sales CRM",
  description: "Sales dashboard for Real Dough Pizza Co.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#26225d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${robotoCondensed.variable} ${montserrat.variable} ${barlow.variable} ${barlowCondensed.variable} antialiased`}
      >
        <main className="pb-20 min-h-screen bg-cream">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
