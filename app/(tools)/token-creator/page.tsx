"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { pack } from "@solana/spl-token-metadata";
import { Connection, Keypair, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  createAssociatedTokenAccountInstruction, 
  createInitializeInstruction, 
  createInitializeMetadataPointerInstruction, 
  createInitializeMintInstruction,
  createMintToInstruction, 
  getAssociatedTokenAddressSync, 
  getMinimumBalanceForRentExemptMint,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TYPE_SIZE,
  LENGTH_SIZE
} from "@solana/spl-token";

export default function TokenCreator() {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const wallet = useWallet();
    const {connection} = useConnection();

    async function createToken() {
        
        
        console.log(tokenName, tokenSymbol, tokenImage, tokenDecimals, tokenTotalSupply);
        
        
        
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
        let response = await wallet.sendTransaction(transaction, connection);
        console.log(response);

        const associatedToken = getAssociatedTokenAddressSync(
            keypair.publicKey,
            wallet.publicKey!,
            false,
            TOKEN_2022_PROGRAM_ID,
        );
        
        console.log(associatedToken.toBase58());
        
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
        
        const transaction3 = new Transaction().add(
            createMintToInstruction(keypair.publicKey, associatedToken, wallet.publicKey!, 1000000000, [], TOKEN_2022_PROGRAM_ID)
        );
        
        await wallet.sendTransaction(transaction3, connection);
    }
    
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="border hover:border-slate-900 rounded flex justify-between p-2">
                <WalletMultiButton style={{}} />
            </div>
            <h1 className="text-4xl font-bold">Token Creator</h1><br />
            
            <Input type="text" placeholder="Token Name"  className="w-1/2" onChange={(e) => setTokenName(e.target.value)}/><br />
            <Input type="text" placeholder="Token Symbol"  className="w-1/2" onChange={(e) => setTokenSymbol(e.target.value)}/><br />
            <Input type="text" placeholder="Image URL"  className="w-1/2" onChange={(e) => setTokenImage(e.target.value)}/><br />
            <Input type="text" placeholder="Token Decimals"  className="w-1/2" onChange={(e) => setTokenDecimals(Number(e.target.value))}/><br />
            <Input type="text" placeholder="Token Total Supply"  className="w-1/2" onChange={(e) => setTokenTotalSupply(Number(e.target.value))}/><br />
            <div className="flex flex-row gap-2">
                <Button onClick={createToken}>Create Token</Button>
            </div>
        </div>
    )
}