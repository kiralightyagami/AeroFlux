"use client";
import AppWalletProvider from "@/components/AppWalletProvider";
import { Navigation } from "@/components/ui/navigation";

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWalletProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AppWalletProvider>
  );
}