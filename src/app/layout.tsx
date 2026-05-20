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

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <link rel="apple-touch-icon" href="/logo1.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased min-h-screen w-full flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
    </html>
  );
}
