"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  shortenedAddress: string;
  solBalance: number;
  viewOnSolscan: string;
  networkType: WalletAdapterNetwork;
  toggleNetwork: () => void;
  endpoint: string;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  connected: false,
  shortenedAddress: "",
  solBalance: 0,
  viewOnSolscan: "",
  networkType: WalletAdapterNetwork.Devnet,
  toggleNetwork: () => {},
  endpoint: "",
});

export const useWalletContext = () => useContext(WalletContext);

interface WalletContextProviderProps {
  children: ReactNode;
  networkType: WalletAdapterNetwork;
  toggleNetwork: () => void;
  endpoint: string;
}

export function WalletContextProvider({ 
  children,
  networkType,
  toggleNetwork,
  endpoint
}: WalletContextProviderProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState<number>(0);

  const shortenedAddress = useMemo(() => {
    if (!publicKey) return "";
    const address = publicKey.toString();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  const viewOnSolscan = useMemo(() => {
    if (!publicKey) return "";
    const baseUrl = networkType === WalletAdapterNetwork.Mainnet 
      ? "https://solscan.io/account/" 
      : "https://solscan.io/account/";
    return `${baseUrl}${publicKey.toString()}`;
  }, [publicKey, networkType]);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      if (!publicKey || !connection) return;

      try {
        const balance = await connection.getBalance(publicKey);
        if (isMounted) {
          setSolBalance(balance / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error("Error fetching SOL balance:", error);
      }
    };

    if (connected && publicKey) {
      fetchBalance();
      // Set up interval to refresh balance
      const intervalId = setInterval(fetchBalance, 30000); // 30 seconds
      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [connection, publicKey, connected]);

  const value = useMemo(() => ({
    publicKey: publicKey ? publicKey.toString() : null,
    connected,
    shortenedAddress,
    solBalance,
    viewOnSolscan,
    networkType,
    toggleNetwork,
    endpoint,
  }), [publicKey, connected, shortenedAddress, solBalance, viewOnSolscan, networkType, endpoint]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 