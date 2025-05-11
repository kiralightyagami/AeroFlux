"use client";

import React, { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here

export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [networkType, setNetworkType] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
    const network = networkType;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
      () => [
        // manually add any legacy wallet adapters here
        new UnsafeBurnerWalletAdapter()
      ],
      [network],
    );
  
    const toggleNetwork = () => {
      setNetworkType(prevNetwork => 
        prevNetwork === WalletAdapterNetwork.Devnet 
          ? WalletAdapterNetwork.Mainnet 
          : WalletAdapterNetwork.Devnet
      );
    };

    return (
      <>
        <div className="fixed top-4 right-4 z-50 flex items-center bg-slate-800 rounded-lg p-2 text-white text-sm">
          <span className="mr-2">
            {networkType === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"}
          </span>
          <button 
            onClick={toggleNetwork}
            className="flex items-center rounded-full w-12 h-6 bg-slate-700 relative px-1"
          >
            <div className={`bg-blue-500 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
              networkType === WalletAdapterNetwork.Mainnet ? "translate-x-6" : ""
            }`} />
          </button>
        </div>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </>
    );
  }