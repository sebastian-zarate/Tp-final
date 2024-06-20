import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import localfont from "next/font/local"

const inter = Inter({ subsets: ["latin"] });

const stoothgart = localfont 
(
  {
    src:[
      {
        path: "../../public/fonts/the-stoothgart-regular.ttf",
         
      }
    ],
    variable: "--font-stoothgart",     
  }
)
export const metadata: Metadata = {
  title: "Las alocadas aventuras de Juan el Vikingo",
  description: "Generated by create next app",
};
/*  */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${stoothgart.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
