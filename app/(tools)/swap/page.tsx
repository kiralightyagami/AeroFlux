"use client";
import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import bs58 from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { WalletInfo } from '@/components/ui/wallet-info';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
// console.log(RPC_URL);

export default function Swap() {
  // It is recommended that you use your own RPC endpoint.
  // This RPC endpoint is only for demonstration purposes so that this example will run.
  const connection = new Connection(RPC_URL);

  const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
  const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
  const BUSD_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

  const [amount, setAmount] = useState(0);
  const [slippage, setSlippage] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txLink, setTxLink] = useState("");
  const [outputToken, setOutputToken] = useState("usdc");

  const finalAmount = (amount * 1_000_000_000).toString();
  const finalSlippage = slippage.toString();

  const wallet = useWallet();
  
  const getOutputMint = () => {
    return outputToken === "usdc" ? USDC_MINT : USDT_MINT;
  };
  
  const getOutputSymbol = () => {
    return outputToken === "usdc" ? "USDC" : "USDT";
  };
  
  async function swap() {
    if (!amount || amount <= 0) {
      setTxStatus("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      setTxStatus("Fetching quote...");
      
      const outputMint = getOutputMint();
      
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${outputMint}&amount=${finalAmount}&slippageBps=${finalSlippage}`
      );
      const quoteResponse = response.data;
      // console.log(quoteResponse);
      
      setTxStatus("Creating swap transaction...");
      const { data: { swapTransaction } } = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse,
        userPublicKey: wallet.publicKey!.toString(),
      });
      // console.log(swapTransaction);

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      // console.log(transaction);

      setTxStatus("Sending transaction...");
      let response2 = await wallet.sendTransaction(transaction, connection);
      // console.log(response2);
      
      setTxStatus("Confirming transaction...");
      // get the latest block hash
      const latestBlockHash = await connection.getLatestBlockhash();

      // Execute the transaction
      const rawTransaction = transaction.serialize()
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
      });
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });
      
      const txUrl = `https://solscan.io/tx/${txid}`;
      console.log(txUrl);
      setTxLink(txUrl);
      setTxStatus("Transaction confirmed!");
    } catch (error: any) {
      console.error("Error during swap:", error);
      setTxStatus(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WalletInfo />
        </div>
        
        <div className="md:col-span-2">
          <Card className="max-w-md mx-auto border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Swap Tokens</CardTitle>
              <CardDescription>Exchange SOL for stablecoins with Jupiter aggregator</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="token-type">Select Output Token</Label>
                <RadioGroup
                  defaultValue="usdc"
                  value={outputToken}
                  onValueChange={setOutputToken}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2 hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="usdc" id="usdc" />
                    <Label htmlFor="usdc" className="cursor-pointer">USDC</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2 hover:border-blue-300 transition-colors">
                    <RadioGroupItem value="usdt" id="usdt" />
                    <Label htmlFor="usdt" className="cursor-pointer">USDT</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SOL)</Label>
                <Input 
                  id="amount"
                  placeholder="Enter amount" 
                  min={0.000000001} 
                  step={0.1}
                  type="number" 
                  value={amount || ""} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  className="border-blue-100 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Slippage Tolerance</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={slippage === 50 ? "gradient" : "outline"} 
                    onClick={() => setSlippage(50)}
                    className="flex-1"
                  >
                    0.5%
                  </Button>
                  <Button 
                    variant={slippage === 80 ? "gradient" : "outline"} 
                    onClick={() => setSlippage(80)}
                    className="flex-1"
                  >
                    0.8%
                  </Button>
                  <Button 
                    variant={slippage === 100 ? "gradient" : "outline"} 
                    onClick={() => setSlippage(100)}
                    className="flex-1"
                  >
                    1.0%
                  </Button>
                </div>
              </div>
              
              {txStatus && (
                <div className={`p-3 rounded text-sm ${txStatus.startsWith("Error") ? "bg-red-100 text-red-800" : txStatus === "Transaction confirmed!" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {txStatus}
                  {txLink && (
                    <a href={txLink} target="_blank" rel="noopener noreferrer" className="block mt-1 underline">
                      View transaction
                    </a>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={swap} 
                disabled={isLoading || !wallet.connected} 
                className="w-full"
                variant="gradient"
              >
                {isLoading ? "Processing..." : wallet.connected ? `Swap SOL → ${getOutputSymbol()}` : "Connect wallet to swap"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}