import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import MarkerComponent from "@/components/MarkerComponent";
import {SpeedInsights} from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Constructeur MCD/MLD",
  description: "Crée et conçu parceque j'en avais besoin tout simplement",
  authors: [{name: "Dorian Jullian--Cambon"}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <MarkerComponent />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
