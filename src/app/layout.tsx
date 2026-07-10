import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"]
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Blauwhoed Ontwerpassistent",
  description: "Duurzaam ontwerp beslisoverzicht per projectfase."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${hankenGrotesk.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
