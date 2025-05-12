"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";
import { useWalletContext } from "@/components/WalletContext";
import Image from "next/image";

const tools = [
  { name: "Swap", href: "/swap" },
  { name: "Token Creator", href: "/token-creator" },
  { name: "Airdrop", href: "/airdrop" },
  // Add more tools here when available
];

export function Navigation() {
  const pathname = usePathname();
  const { connected, shortenedAddress, solBalance, viewOnSolscan } = useWalletContext();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="mb-2 sm:mb-0 flex items-center gap-2">
        <Image src="/tools.svg" width={28} height={28} alt="Tools" />
        <Link href="/" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 text-2xl tracking-tight">
          AeroFlux
        </Link>
      </div>
      
      <div className="flex space-x-1 mb-2 sm:mb-0 bg-slate-100 dark:bg-gray-800 p-1 rounded-lg">
        {tools.map((tool) => {
          const isActive = pathname.includes(tool.href);
          return (
            <Link
              key={tool.name}
              href={tool.href}
              className={cn(
                "px-2 py-1 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm"
                  : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
            >
              {tool.name}
            </Link>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2">
        {connected && (
          <div className="hidden md:flex items-center text-sm bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            <div className="flex flex-col">
              <div className="text-xs font-medium">{shortenedAddress} • {solBalance.toFixed(2)} SOL</div>
            </div>
          </div>
        )}
        <div className="border border-transparent hover:border-slate-900 dark:hover:border-slate-100 rounded overflow-hidden">
          <WalletMultiButton style={{ padding: '4px 8px', height: 'auto', fontSize: '14px', background: 'linear-gradient(to right, #7c3aed, #3b82f6)' }} />
        </div>
      </div>
    </div>
  );
} 