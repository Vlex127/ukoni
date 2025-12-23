import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SchedulerProvider from "@/components/scheduler-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ukoni - Discover Stories That Ignite Your Creativity",
  description: "A community of writers, developers, and creators sharing insights on technology, design, and digital well-being.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SchedulerProvider />
        {children}
      </body>
    </html>
  );
}