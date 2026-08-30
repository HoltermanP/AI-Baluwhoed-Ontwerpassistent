import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

// Blauwhoed.nl gebruikt Avenir; Nunito Sans is de vrij beschikbare tegenhanger.
const nunitoSans = Nunito_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"]
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
    <html lang="nl" className={nunitoSans.variable}>
      <body>{children}</body>
    </html>
  );
}
