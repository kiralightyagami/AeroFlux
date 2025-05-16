'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ClientOnlyWalletButton() {
  const [mounted, setMounted] = useState(false);

  // Only show the wallet button on the client to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same size to prevent layout shift
    return (
      <div className="border border-transparent hover:border-slate-900 dark:hover:border-slate-100 rounded overflow-hidden">
        <button 
          className="px-4 py-2 text-sm font-medium rounded"
          style={{ 
            padding: '4px 8px', 
            height: 'auto', 
            fontSize: '14px', 
            background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
            color: 'white'
          }}
        >
          Connect
        </button>
      </div>
    );
  }

  return (
    <div className="border border-transparent hover:border-slate-900 dark:hover:border-slate-100 rounded overflow-hidden">
      <WalletMultiButton style={{ 
        padding: '4px 8px', 
        height: 'auto', 
        fontSize: '14px', 
        background: 'linear-gradient(to right, #7c3aed, #3b82f6)' 
      }} />
    </div>
  );
} 