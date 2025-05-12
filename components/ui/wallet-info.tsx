"use client";

import { useWalletContext } from "@/components/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export function WalletInfo() {
  const { connected, shortenedAddress, solBalance, viewOnSolscan } = useWalletContext();

  if (!connected) {
    return (
      <Card className="mb-6 border-purple-200 dark:border-purple-900 shadow-lg dark:shadow-gray-900/20">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
          <div className="flex items-center gap-2">
            <Image src="/wallet.svg" width={24} height={24} alt="Wallet" />
            <CardTitle>Connect Wallet</CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">Please connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardFooter className="pt-4">
          <WalletMultiButton />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-purple-200 dark:border-purple-900 shadow-lg dark:shadow-gray-900/20">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
        <div className="flex items-center gap-2">
          <Image src="/wallet.svg" width={24} height={24} alt="Wallet" />
          <CardTitle>Your Wallet</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-400">Connected wallet information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Image src="/wallet.svg" width={16} height={16} alt="Wallet" />
            <span className="text-sm font-medium">Address:</span>
          </div>
          <a
            href={viewOnSolscan}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {shortenedAddress}
          </a>
        </div>
        <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Image src="/sol.svg" width={16} height={16} alt="SOL" />
            <span className="text-sm font-medium">Balance:</span>
          </div>
          <span className="text-sm">{solBalance.toFixed(4)} SOL</span>
        </div>
        {solBalance < 0.1 && (
          <Alert variant="destructive" className="mt-2 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900">
            <AlertDescription>
              Your balance is low. Please add more SOL to your wallet.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <a
          href={viewOnSolscan}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline w-full text-center flex items-center justify-center gap-2 p-2 rounded-md bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Image src="/wallet.svg" width={16} height={16} alt="Wallet" />
          <span>View on Solscan</span>
        </a>
      </CardFooter>
    </Card>
  );
} 