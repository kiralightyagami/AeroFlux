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
import Image from 'next/image';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
// console.log(RPC_URL);

export default function Swap() {
  // It is recommended that you use your own RPC endpoint.
  // This RPC endpoint is only for demonstration purposes so that this example will run.
  const connection = new Connection(RPC_URL);

  const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
  const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');

  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [selectedStablecoin, setSelectedStablecoin] = useState<"usdc" | "usdt">("usdc");
  const [slippage, setSlippage] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txLink, setTxLink] = useState("");

  const wallet = useWallet();
  
  
  const getStablecoinMint = () => selectedStablecoin === "usdc" ? USDC_MINT : USDT_MINT;
  const getStablecoinSymbol = () => selectedStablecoin === "usdc" ? "USDC" : "USDT";
  const getStablecoinIcon = () => selectedStablecoin === "usdc" ? "/usdc.svg" : "/usdt.svg";
  
 
  const toggleStablecoin = () => {
    setSelectedStablecoin(prev => prev === "usdc" ? "usdt" : "usdc");
    
    setInputAmount("");
    setOutputAmount("");
  };
  
 
  const getInputToken = () => isReversed ? getStablecoinSymbol() : "SOL";
  const getOutputToken = () => isReversed ? "SOL" : getStablecoinSymbol();
  
  const getInputIcon = () => isReversed ? getStablecoinIcon() : "/sol.svg";
  const getOutputIcon = () => isReversed ? "/sol.svg" : getStablecoinIcon();
  
  const getInputMint = () => isReversed ? getStablecoinMint() : SOL_MINT;
  const getOutputMint = () => isReversed ? SOL_MINT : getStablecoinMint();
  
  
  const handleSwapDirection = () => {
    setIsReversed(!isReversed);
    
    setInputAmount("");
    setOutputAmount("");
  };
  
 
  const handleInputChange = (value: string) => {
    setInputAmount(value);
    
    
    if (value && !isNaN(parseFloat(value))) {
      
      let mockRate;
      if (isReversed) {
        mockRate = selectedStablecoin === "usdc" ? 0.05 : 0.048; 
      } else {
        mockRate = selectedStablecoin === "usdc" ? 20 : 21; 
      }
      setOutputAmount((parseFloat(value) * mockRate).toFixed(2));
    } else {
      setOutputAmount("");
    }
  };
  
  async function swap() {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setTxStatus("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      setTxStatus("Fetching quote...");
      
      const inputMint = getInputMint();
      const outputMint = getOutputMint();
      
      
      const decimals = isReversed ? 1_000_000 : 1_000_000_000;
      const finalAmount = (parseFloat(inputAmount) * decimals).toString();
      const finalSlippage = slippage.toString();
      
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${finalAmount}&slippageBps=${finalSlippage}`
      );
      const quoteResponse = response.data;
      
      setTxStatus("Creating swap transaction...");
      const { data: { swapTransaction } } = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse,
        userPublicKey: wallet.publicKey!.toString(),
      });

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      setTxStatus("Sending transaction...");
      let response2 = await wallet.sendTransaction(transaction, connection);
      
      setTxStatus("Confirming transaction...");
     
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
          <Card className="max-w-md mx-auto border-purple-200 dark:border-purple-900 shadow-lg dark:shadow-gray-900/20">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Swap Tokens</CardTitle>
              <CardDescription className="dark:text-gray-400">Exchange SOL for stablecoins with Jupiter aggregator</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* Stablecoin selector */}
              {!isReversed && (
                <div className="flex justify-end">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setSelectedStablecoin("usdc")}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-l-md ${
                        selectedStablecoin === "usdc" 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Image src="/usdc.svg" width={16} height={16} alt="USDC" className="mr-1" />
                      USDC
                    </button>
                    <button
                      onClick={() => setSelectedStablecoin("usdt")}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-r-md ${
                        selectedStablecoin === "usdt" 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Image src="/usdt.svg" width={16} height={16} alt="USDT" className="mr-1" />
                      USDT
                    </button>
                  </div>
                </div>
              )}
              
              {/* First token input */}
              <div className="relative rounded-full border border-gray-200 dark:border-gray-700 p-4 flex items-center bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full flex items-center">
                  <Image 
                    src={getInputIcon()} 
                    width={20} 
                    height={20} 
                    alt={getInputToken()} 
                    className="mr-2"
                  />
                  <span className="text-sm font-medium lowercase">{getInputToken()}</span>
                </div>
                <div className="ml-auto w-1/2 flex items-center justify-end">
                  <input
                    value={inputAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-right border-0 text-2xl p-0 focus:outline-none focus:ring-0 bg-transparent text-gray-600 dark:text-gray-300" 
                    placeholder="0.00"
                    type="number"
                  />
                </div>
                  </div>
              
              {/* Swap direction button */}
              <div className="flex justify-center -my-5 relative z-10 -mt-10">
                <button 
                  onClick={handleSwapDirection}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3 hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center shadow-md w-12 h-12"
                  aria-label="Swap direction"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10l5-5 5 5"/>
                    <path d="M7 14l5 5 5-5"/>
                  </svg>
                </button>
              </div>
              
              {/* Second token input */}
              <div className="relative rounded-full border border-gray-200 dark:border-gray-700 p-4 flex items-center bg-white dark:bg-gray-800">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full flex items-center">
                  <Image 
                    src={getOutputIcon()} 
                    width={20} 
                    height={20} 
                    alt={getOutputToken()} 
                    className="mr-2"
                  />
                  <span className="text-sm font-medium lowercase">{getOutputToken()}</span>
                </div>
                <div className="ml-auto w-1/2 text-right text-2xl text-gray-600 dark:text-gray-300">
                  {outputAmount || "0.00"}
                </div>
              </div>
              
              {/* Stablecoin selector for reversed mode */}
              {isReversed && (
                <div className="flex justify-end">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setSelectedStablecoin("usdc")}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-l-md ${
                        selectedStablecoin === "usdc" 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Image src="/usdc.svg" width={16} height={16} alt="USDC" className="mr-1" />
                      USDC
                    </button>
                    <button
                      onClick={() => setSelectedStablecoin("usdt")}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-r-md ${
                        selectedStablecoin === "usdt" 
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Image src="/usdt.svg" width={16} height={16} alt="USDT" className="mr-1" />
                      USDT
                    </button>
                  </div>
                </div>
              )}
              
              {/* Slippage tolerance */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">Slippage Tolerance</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={slippage === 50 ? "default" : "outline"} 
                    onClick={() => setSlippage(50)}
                    className={slippage === 50 ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "dark:border-gray-700 dark:text-gray-300"}
                  >
                    0.5%
                  </Button>
                  <Button 
                    variant={slippage === 80 ? "default" : "outline"} 
                    onClick={() => setSlippage(80)}
                    className={slippage === 80 ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "dark:border-gray-700 dark:text-gray-300"}
                  >
                    0.8%
                  </Button>
                  <Button 
                    variant={slippage === 100 ? "default" : "outline"} 
                    onClick={() => setSlippage(100)}
                    className={slippage === 100 ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "dark:border-gray-700 dark:text-gray-300"}
                  >
                    1.0%
                  </Button>
                </div>
              </div>
              
              {txStatus && (
                <div className={`p-3 rounded text-sm ${
                  txStatus.startsWith("Error") 
                    ? "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300" 
                    : txStatus === "Transaction confirmed!" 
                      ? "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300" 
                      : "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
                }`}>
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
                {isLoading ? "Processing..." : wallet.connected ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Swap {getInputToken()} → {getOutputToken()}</span>
                  </div>
                ) : "Connect wallet to swap"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}