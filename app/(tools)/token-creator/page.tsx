"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { pack } from "@solana/spl-token-metadata";
import { Keypair, SystemProgram, Transaction,  } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  createAssociatedTokenAccountInstruction, 
  createInitializeInstruction, 
  createInitializeMetadataPointerInstruction, 
  createInitializeMintInstruction,
  createMintToInstruction, 
  getAssociatedTokenAddressSync, 
  
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
 
  TYPE_SIZE,
  LENGTH_SIZE
} from "@solana/spl-token";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WalletInfo } from "@/components/ui/wallet-info";
import { useWalletContext } from "@/components/WalletContext";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Image from "next/image";
//token creator page
export default function TokenCreator() {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [txStatus, setTxStatus] = useState("");
    const [txLink, setTxLink] = useState("");
    
    const wallet = useWallet();
    const {connection} = useConnection();
    const { networkType, toggleNetwork } = useWalletContext();

    async function createToken() {
        if (!tokenName || !tokenSymbol) {
            setTxStatus("Token name and symbol are required");
            return;
        }
        
        try {
            setIsLoading(true);
            setTxStatus("Generating token...");
        
            // console.log(tokenName, tokenSymbol, tokenImage, tokenDecimals, tokenTotalSupply);
        
        const keypair = Keypair.generate();
        const metadata = {
            mint: keypair.publicKey,
            name: tokenName,
            symbol: tokenSymbol,
            uri: tokenImage,
            additionalMetadata: [],
        }
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            setTxStatus("Creating token on blockchain...");
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey!,
                newAccountPubkey: keypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                keypair.publicKey,
                wallet.publicKey!,
                keypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
            createInitializeMintInstruction(keypair.publicKey, tokenDecimals, wallet.publicKey!, wallet.publicKey!, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: keypair.publicKey,
                metadata: keypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey!,
                updateAuthority: wallet.publicKey!,
            }),
        );

        const recentBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey!;
        transaction.partialSign(keypair);
            
            setTxStatus("Sending transaction...");
        let response = await wallet.sendTransaction(transaction, connection);
            // console.log(response);

            setTxStatus("Creating token account...");
        const associatedToken = getAssociatedTokenAddressSync(
            keypair.publicKey,
            wallet.publicKey!,
            false,
            TOKEN_2022_PROGRAM_ID,
        );
        
            // console.log(associatedToken.toBase58());
        
        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey!,
                associatedToken,
                wallet.publicKey!,
                keypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );
        
        await wallet.sendTransaction(transaction2, connection);
        
            setTxStatus("Minting initial supply...");
        const transaction3 = new Transaction().add(
            createMintToInstruction(keypair.publicKey, associatedToken, wallet.publicKey!, 1000000000, [], TOKEN_2022_PROGRAM_ID)
        );
        
        await wallet.sendTransaction(transaction3, connection);
            
            const txUrl = `https://solscan.io/token/${keypair.publicKey.toString()}`;
            setTxLink(txUrl);
            setTxStatus("Token created successfully!");
        } catch (error: any) {
            console.error("Error creating token:", error);
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
                    
                    <Card className="mb-6 border-purple-200 dark:border-purple-900 shadow-lg dark:shadow-gray-900/20">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
                            <div className="flex items-center gap-2">
                                <Image 
                                    src={networkType === WalletAdapterNetwork.Devnet ? "/devnet.svg" : "/mainnet.svg"} 
                                    width={24} 
                                    height={24} 
                                    alt={networkType === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"} 
                                />
                            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Network Settings</CardTitle>
                            </div>
                            <CardDescription className="dark:text-gray-400">Select the network to create tokens on</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Image 
                                            src={networkType === WalletAdapterNetwork.Devnet ? "/devnet.svg" : "/mainnet.svg"} 
                                            width={20} 
                                            height={20} 
                                            alt={networkType === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"} 
                                        />
                                <span className="font-medium">
                                    Current Network: {networkType === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"}
                                </span>
                                    </div>
                                </div>
                                <Button 
                                    onClick={toggleNetwork}
                                    variant={networkType === WalletAdapterNetwork.Devnet ? "gradient" : "gradientGreen"}
                                    className="flex items-center justify-center gap-2 w-full"
                                >
                                    <Image 
                                        src={networkType === WalletAdapterNetwork.Devnet ? "/mainnet.svg" : "/devnet.svg"} 
                                        width={18} 
                                        height={18} 
                                        alt={networkType === WalletAdapterNetwork.Devnet ? "Mainnet" : "Devnet"} 
                                    />
                                    Switch to {networkType === WalletAdapterNetwork.Devnet ? "Mainnet" : "Devnet"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="md:col-span-2">
                    <Card className="max-w-md mx-auto border-purple-200 dark:border-purple-900 shadow-lg dark:shadow-gray-900/20">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
                            <div className="flex items-center gap-2">
                                <Image src="/wallet.svg" width={24} height={24} alt="Wallet" />
                            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Token Creator</CardTitle>
                            </div>
                            <CardDescription className="dark:text-gray-400">Create your own SPL token on Solana {networkType === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="tokenName">Token Name</Label>
                                <Input 
                                    id="tokenName" 
                                    type="text" 
                                    placeholder="e.g., My Awesome Token" 
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                    className="border-blue-100 focus:border-blue-300 dark:border-blue-900 dark:focus:border-blue-700 dark:bg-gray-800"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                                <Input 
                                    id="tokenSymbol" 
                                    type="text" 
                                    placeholder="e.g., MAT" 
                                    value={tokenSymbol}
                                    onChange={(e) => setTokenSymbol(e.target.value)}
                                    className="border-blue-100 focus:border-blue-300 dark:border-blue-900 dark:focus:border-blue-700 dark:bg-gray-800"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="tokenImage">Image URL</Label>
                                <Input 
                                    id="tokenImage" 
                                    type="text" 
                                    placeholder="e.g., https://example.com/image.png" 
                                    value={tokenImage}
                                    onChange={(e) => setTokenImage(e.target.value)}
                                    className="border-blue-100 focus:border-blue-300 dark:border-blue-900 dark:focus:border-blue-700 dark:bg-gray-800"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="tokenDecimals">Decimals</Label>
                                <Input 
                                    id="tokenDecimals" 
                                    type="number" 
                                    placeholder="9" 
                                    min={0}
                                    max={9}
                                    value={tokenDecimals || ""}
                                    onChange={(e) => setTokenDecimals(Number(e.target.value))}
                                    className="border-blue-100 focus:border-blue-300 dark:border-blue-900 dark:focus:border-blue-700 dark:bg-gray-800"
                                />
                            </div>
                            
                            {txStatus && (
                                <div className={`p-3 rounded text-sm ${
                                    txStatus.startsWith("Error") 
                                        ? "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300" 
                                        : txStatus === "Token created successfully!" 
                                            ? "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300" 
                                            : "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
                                }`}>
                                    {txStatus}
                                    {txLink && (
                                        <a href={txLink} target="_blank" rel="noopener noreferrer" className="block mt-1 underline">
                                            View token
                                        </a>
                                    )}
            </div>
                            )}
                        </CardContent>
                        
                        <CardFooter>
                            <Button 
                                onClick={createToken} 
                                disabled={isLoading || !wallet.connected}
                                className="w-full"
                                variant="gradient"
                            >
                                {isLoading ? (
                                    "Creating token..."
                                ) : wallet.connected ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Image src="/wallet.svg" width={20} height={20} alt="Wallet" />
                                        <span>Create Token</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Image src="/wallet.svg" width={20} height={20} alt="Wallet" />
                                        <span>Connect wallet to create token</span>
                                    </div>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}