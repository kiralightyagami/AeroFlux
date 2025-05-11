"use client";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";


export default function TokenCreator() {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);

    function createToken() {
        console.log(tokenName, tokenSymbol, tokenImage, tokenDecimals, tokenTotalSupply);
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