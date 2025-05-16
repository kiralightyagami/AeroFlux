// This file contains information about AeroFlux tools that will be used to
// enhance the AI assistant responses. In a production environment, you would
// likely use a more sophisticated approach such as a vector database for
// RAG (Retrieval Augmented Generation).

export const toolDescriptions = {
  swap: `
    AeroFlux Swap Tool:
    - Allows users to exchange one token for another on the Solana blockchain
    - Supports SOL and SPL tokens
    - Displays real-time price quotes and estimated slippage
    - Shows transaction fees and price impact
    - Requires a connected wallet with sufficient balance
    - Common issues: Insufficient SOL for gas fees, token approval required for first-time use
  `,
  
  tokenCreator: `
    AeroFlux Token Creator:
    - Create custom SPL tokens on Solana
    - Set properties like name, symbol, decimals, and total supply
    - Options for minting authority and freeze authority
    - Upload and link token metadata including images
    - Create token with or without metadata
    - Common issues: Insufficient SOL for creation, metadata upload failures
  `,
  
  airdrop: `
    AeroFlux Airdrop Tool:
    - Distribute tokens to multiple wallet addresses simultaneously
    - Upload CSV files with addresses and amounts
    - Preview and verify drop details before execution
    - Track airdrop status and history
    - Requires sufficient token balance and SOL for transaction fees
    - Common issues: CSV format errors, insufficient balance for large airdrops
  `,
  
  liquidityPool: `
    AeroFlux Liquidity Pool:
    - Create and manage liquidity pools for token pairs
    - Add liquidity to existing pools
    - Remove liquidity from your positions
    - View detailed analytics for your LP positions
    - Earn fees from trades that utilize your provided liquidity
    - Common issues: Price impact too high, insufficient balance
  `,
  
  general: `
    AeroFlux is a comprehensive Solana token launchpad and DeFi toolkit that allows users to create, swap, airdrop, and manage tokens on the Solana blockchain.
    
    Common wallet issues:
    - If wallet won't connect, try refreshing the page or reconnecting
    - Always keep sufficient SOL for transaction fees
    - Phantom, Solflare, and other Solana wallets are supported
    - Transaction approval appears in the wallet interface
    
    Navigation tips:
    - Use the top navigation bar to switch between tools
    - Each tool has its own detailed documentation accessible via the help icon
    - The AI assistant can provide real-time guidance for any tool
  `
};

export function getContextForPrompt(userPrompt: string): string {
  const lowerPrompt = userPrompt.toLowerCase();
  
  if (lowerPrompt.includes('swap') || lowerPrompt.includes('exchange') || lowerPrompt.includes('trade')) {
    return toolDescriptions.swap;
  }
  
  if (lowerPrompt.includes('token') || lowerPrompt.includes('create token') || lowerPrompt.includes('mint')) {
    return toolDescriptions.tokenCreator;
  }
  
  if (lowerPrompt.includes('airdrop') || lowerPrompt.includes('distribute') || lowerPrompt.includes('send tokens')) {
    return toolDescriptions.airdrop;
  }
  
  if (lowerPrompt.includes('liquidity') || lowerPrompt.includes('pool') || lowerPrompt.includes('lp')) {
    return toolDescriptions.liquidityPool;
  }
  
  // Default to general information
  return toolDescriptions.general;
} 