"use client";
import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import bs58 from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';


const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
console.log(RPC_URL);

  export default function Swap() {
    // It is recommended that you use your own RPC endpoint.
    // This RPC endpoint is only for demonstration purposes so that this example will run.
    const connection = new Connection(RPC_URL);


    const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
    const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const [amount, setAmount] = useState(0);

    const [slippage, setSlippage] = useState(50);

    const finalAmount = (amount * 1_000_000_000).toString();
    const finalSlippage = slippage.toString();

    const wallet = useWallet();
    
    async function swap() {
    const response = await (
        await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${USDC_MINT}&amount=${finalAmount}&slippageBps=${finalSlippage}`
        )
      );
      const quoteResponse = response.data;
      console.log(quoteResponse);

      
      const { data: { swapTransaction } } = await (
            await axios.post('https://quote-api.jup.ag/v6/swap', {
                quoteResponse,
                userPublicKey: wallet.publicKey!.toString(),
            })
        );
        console.log(swapTransaction);

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      console.log(transaction);

      let response2 = await wallet.sendTransaction(transaction, connection);
      console.log(response2);

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
     console.log(`https://solscan.io/tx/${txid}`);

    }
      



    return (
        <div className='flex flex-col items-center justify-center h-screen' >
            <div className="border hover:border-slate-900 rounded flex justify-between p-2">
                <WalletMultiButton style={{}} />
            </div>       
            <h1 className='text-4xl font-bold'>Swap</h1><br />

            <Input className='w-1/2' placeholder="Amount" min={1} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /><br />
            <div className='flex gap-2'>
            <h1>Slippage</h1>
            <Button onClick={() => setSlippage(80)}>80</Button>
            <Button onClick={() => setSlippage(100)}>100</Button>
            </div>
            <Button onClick={swap}>Swap</Button>
        </div>
    )       
}