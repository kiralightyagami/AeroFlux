"use client";

import React, { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletContextProvider } from "./WalletContext";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import ClientOnly from "./ClientOnly";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [networkType, setNetworkType] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(networkType), [networkType]);
  
  const wallets = useMemo(
    () => [
      // manually add any legacy wallet adapters here
      new UnsafeBurnerWalletAdapter()
    ],
    [],
  );

  const toggleNetwork = () => {
    setNetworkType(prevNetwork => 
      prevNetwork === WalletAdapterNetwork.Devnet 
        ? WalletAdapterNetwork.Mainnet 
        : WalletAdapterNetwork.Devnet
    );
  };

  return (
    <ClientOnly>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletContextProvider networkType={networkType} toggleNetwork={toggleNetwork} endpoint={endpoint}>
              {children}
            </WalletContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClientOnly>
  );
}