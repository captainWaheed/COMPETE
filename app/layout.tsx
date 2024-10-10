"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if the current route is under "/admin" to skip the root layout
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Only apply the Layout component if it's not an admin route */}
          {!isAdminRoute ? <Layout>{children}</Layout> : children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
