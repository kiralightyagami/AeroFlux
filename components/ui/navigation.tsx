"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";
import { useWalletContext } from "@/components/WalletContext";

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
    <div className="flex flex-col sm:flex-row justify-between items-center w-full py-4 px-6 bg-white border-b">
      <div className="mb-4 sm:mb-0">
        <Link href="/" className="text-xl font-bold">
          AeroFlux
        </Link>
      </div>
      
      <div className="flex space-x-1 mb-4 sm:mb-0 bg-slate-100 p-1 rounded-lg">
        {tools.map((tool) => {
          const isActive = pathname.includes(tool.href);
          return (
            <Link
              key={tool.name}
              href={tool.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
              )}
            >
              {tool.name}
            </Link>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4">
        {connected && (
          <div className="hidden md:flex items-center gap-2 text-sm bg-slate-100 px-3 py-2 rounded-md">
            <div className="flex flex-col">
              <div className="font-medium">Address: {shortenedAddress}</div>
              <div className="text-xs">Balance: {solBalance.toFixed(4)} SOL</div>
              <a 
                href={viewOnSolscan}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View on Solscan
              </a>
            </div>
          </div>
        )}
        <div className="border hover:border-slate-900 rounded">
          <WalletMultiButton style={{}} />
        </div>
      </div>
    </div>
  );
} 