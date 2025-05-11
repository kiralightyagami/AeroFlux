"use client";
import AppWalletProvider from "@/components/AppWalletProvider";

export default function TokenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      
        <AppWalletProvider>{children}</AppWalletProvider>
      
  );
}