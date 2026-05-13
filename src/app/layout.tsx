import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Pho Gear - Bàn phím cơ cao cấp",
  description: "Cửa hàng chuyên cung cấp bàn phím cơ, keycap và switch chất lượng cao.",
  icons: {
    icon: "/favicon.ico",
  }
};

import { I18nProvider } from "@/components/providers/I18nProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
