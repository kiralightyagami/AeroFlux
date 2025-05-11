"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletInfo } from "@/components/ui/wallet-info";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWalletContext } from "@/components/WalletContext";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function AirdropTool() {
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [error, setError] = useState("");
  
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const { networkType, solBalance } = useWalletContext();
  
  const requestAirdrop = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (networkType !== WalletAdapterNetwork.Devnet) {
      setError("Airdrops are only available on Devnet. Please switch to Devnet from the Token Creator page.");
      return;
    }
    
    if (amount <= 0 || amount > 2) {
      setError("Please enter a valid amount between 0 and 2 SOL");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      setTxStatus("Requesting airdrop...");
      
      const lamports = amount * LAMPORTS_PER_SOL;
      const signature = await connection.requestAirdrop(publicKey, lamports);
      
      setTxStatus("Confirming transaction...");
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed: " + confirmation.value.err.toString());
      }
      
      setTxSignature(signature);
      setTxStatus("Airdrop successful!");
    } catch (err: any) {
      setError(err.message || "Failed to request airdrop");
      setTxStatus("");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WalletInfo />
        </div>
        
        <div className="md:col-span-2">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Solana Airdrop</CardTitle>
              <CardDescription>Request SOL tokens on Devnet for testing</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {networkType !== WalletAdapterNetwork.Devnet && (
                <Alert variant="destructive" className="bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertDescription>
                    Airdrops are only available on Devnet. Please switch to Devnet from the Token Creator page.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SOL)</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    disabled={isLoading || !connected || networkType !== WalletAdapterNetwork.Devnet}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
                    SOL
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Max 2 SOL per request on Devnet</p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {txStatus && (
                <div className={`p-3 rounded text-sm ${txStatus === "Airdrop successful!" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {txStatus}
                  {txSignature && (
                    <a 
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block mt-1 underline"
                    >
                      View transaction
                    </a>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={requestAirdrop} 
                disabled={isLoading || !connected || networkType !== WalletAdapterNetwork.Devnet}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Request Airdrop"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is an Airdrop?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  On Solana&apos;s Devnet, an airdrop is a way to receive free SOL tokens for testing purposes. 
                  These tokens have no real value and can only be used on the test network. 
                  This tool allows you to request SOL to your wallet so you can test applications without spending real money.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 