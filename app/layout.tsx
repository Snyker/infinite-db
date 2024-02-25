import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
    <Script onLoad={() => {
      //@ts-ignore
      window.markerConfig = {
        project: '65db7ba2523f9b37290ae77f',
        source: 'snippet'
      };
      //@ts-ignore
      !function(e,r,a){if(!e.__Marker){e.__Marker={};var t=[],n={__cs:t};["show","hide","isVisible","capture","cancelCapture","unload","reload","isExtensionInstalled","setReporter","setCustomData","on","off"].forEach(function(e){n[e]=function(){var r=Array.prototype.slice.call(arguments);r.unshift(e),t.push(r)}}),e.Marker=n;var s=r.createElement("script");s.async=1,s.src="https://edge.marker.io/latest/shim.js";var i=r.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}}(window,document);
    }}>
        </Script>
    <body className={inter.className}>{children}</body>
    </html>
  );
}
