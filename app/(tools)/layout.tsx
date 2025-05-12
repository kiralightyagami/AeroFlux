"use client";
import AppWalletProvider from "@/components/AppWalletProvider";
import { Navigation } from "@/components/ui/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWalletProvider>
      <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
      </ThemeProvider>
    </AppWalletProvider>
  );
}