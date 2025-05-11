"use client";

import { useWalletContext } from "@/components/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletInfo() {
  const { connected, shortenedAddress, solBalance, viewOnSolscan } = useWalletContext();

  if (!connected) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Please connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardFooter>
          <WalletMultiButton />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
        <CardDescription>Connected wallet information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Address:</span>
          <a
            href={viewOnSolscan}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {shortenedAddress}
          </a>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Balance:</span>
          <span className="text-sm">{solBalance.toFixed(4)} SOL</span>
        </div>
        {solBalance < 0.1 && (
          <Alert variant="destructive" className="mt-2 bg-red-50 text-red-800 border border-red-200">
            <AlertDescription>
              Your balance is low. Please add more SOL to your wallet.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <a
          href={viewOnSolscan}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline w-full text-center"
        >
          View on Solscan
        </a>
      </CardFooter>
    </Card>
  );
} 