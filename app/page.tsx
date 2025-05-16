"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Github, Twitter, Linkedin, Sparkles, MessageSquare, Code, FileCode } from "lucide-react";
import { useEffect, useState } from "react";

type ToolType = {
  name: string;
  description: string;
  href: string;
  icon: string;
  buttonVariant: "gradient" | "gradientGreen" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

const tools: ToolType[] = [
  {
    name: "Swap",
    description: "Swap tokens using Jupiter aggregator",
    href: "/swap",
    icon: "💱",
    buttonVariant: "gradient"
  },
  {
    name: "Token Creator",
    description: "Create your own SPL token on Solana",
    href: "/token-creator",
    icon: "🪙",
    buttonVariant: "gradient"
  },
  {
    name: "Airdrop",
    description: "Request SOL tokens on Devnet for testing",
    href: "/airdrop",
    icon: "💸",
    buttonVariant: "gradient"
  },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenAssistant = (e: React.MouseEvent) => {
    e.preventDefault();
    
   
    
    // Method 1
    const assistantButton = document.querySelector('[id="ai-button"]') || 
                          document.querySelector('[aria-label="Open AI assistant"]') ||
                          document.querySelector('[aria-label="AI assistant"]') ||
                          document.querySelector('[class*="ai-assistant"]') ||
                          document.querySelector('[class*="ai-button"]');
    
    if (assistantButton instanceof HTMLElement) {
      assistantButton.click();
      return;
    }
    
    // Method 2
    const floatingButtons = document.querySelectorAll('button');
    const bottomRightButtons = Array.from(floatingButtons).filter(button => {
      const rect = button.getBoundingClientRect();
      const isBottomRight = rect.bottom > window.innerHeight - 100 && rect.right > window.innerWidth - 100;
      return isBottomRight;
    });
    
    if (bottomRightButtons.length > 0) {
      bottomRightButtons[0].click();
      return;
    }
    
    //If no button found
    alert("Could not automatically open the AI Assistant. Please look for an AI button at the bottom right of your screen.");
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative">
        <div className="absolute top-0 right-0 flex space-x-3">
          <a href="https://github.com/kiralightyagami/AeroFlux" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Github size={24} />
          </a>
          <a href="https://x.com/ShrivasAsvin" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Twitter size={24} />
          </a>
          <a href="https://www.linkedin.com/in/asvin-shrivas/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Linkedin size={24} />
          </a>
        </div>
        <div className="text-center mb-10 pt-10">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 tracking-tight">AeroFlux</h1>
          <p className="text-xl text-muted-foreground">A powerful suite of Solana tools</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map((tool) => (
          <Card key={tool.name} className="hover:shadow-md transition-shadow border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <span className="text-2xl">{tool.icon}</span>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-6">
              <Link href={tool.href} className="w-full">
                <Button className="w-full" variant={tool.buttonVariant}>
                  Open {tool.name}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-gray-950 text-white rounded-lg p-8 my-16">
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-500">AI-Powered Assistance</h2>
        <p className="text-center mb-10">
          Get real-time help with our Gemini-powered AI assistant. Ask questions about Solana, get help
          with tools, and receive step-by-step guidance.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-time Streaming Responses</h3>
                <p className="text-gray-300">Watch as the AI crafts responses in real-time, making interactions feel natural and immediate.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MessageSquare className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Rich Markdown Support</h3>
                <p className="text-gray-300">Receive beautifully formatted responses with support for code blocks, tables, lists, and more.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Code className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Code Syntax Highlighting</h3>
                <p className="text-gray-300">Get code examples with proper syntax highlighting to help you implement solutions quickly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileCode className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Context-Aware Assistance</h3>
                <p className="text-gray-300">The assistant understands AeroFlux tools and provides contextually relevant help.</p>
              </div>
            </div>
            
            {isMounted ? (
              <Link href="/#" className="w-full">
                <Button 
                  className="mt-4 w-full" 
                  variant="gradient" 
                  onClick={handleOpenAssistant}
                >
                  Try AI Assistant
                </Button>
              </Link>
            ) : (
              <Button 
                className="mt-4 w-full" 
                variant="gradient"
              >
                Try AI Assistant
              </Button>
            )}
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-400">AeroFlux AI Assistant</h3>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg mb-4">
              <p className="text-gray-300 mb-2">How do I create a custom token on Solana?</p>
            </div>
            
            <div className="p-4 bg-gray-800 bg-opacity-60 rounded-lg">
              <p className="mb-2">To create a custom token on Solana using AeroFlux:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2 text-gray-300">
                <li>Navigate to the Token Creator tool</li>
                <li>Connect your wallet</li>
                <li>Fill in token details (name, symbol, decimals)</li>
                <li>Set your initial supply</li>
                <li>Click "Create Token" to deploy it to the blockchain</li>
              </ol>
              <p className="mt-2">The token will be created and added to your wallet automatically. You can then manage it like any other SPL token!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight">About AeroFlux</h2>
        <div className="text-muted-foreground">
          <p className="mb-4">
            AeroFlux provides an intuitive and streamlined interface for interacting with the Solana blockchain. 
            Whether you're a developer, trader, or blockchain enthusiast, our tools help you harness the power 
            of Solana with ease.
          </p>
          <p>
            Built with performance and user experience in mind, AeroFlux supports token swaps through Jupiter aggregator, 
            custom SPL token creation, and convenient access to testnet resources for development.
          </p>
        </div>
      </div>
      
      <footer className="mt-20 pt-10 border-t">
        <h2 className="text-2xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 tracking-tight">How Our Tools Work</h2>
        
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="mr-2">💱</span> Swap
            </h3>
            <p className="text-muted-foreground">
              The Swap tool leverages Jupiter aggregator to find the best exchange rates for your token swaps. 
              Connect your wallet, select the tokens you want to swap (SOL to USDC or USDT), enter the amount, 
              and execute the transaction with minimal slippage and fees.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="mr-2">🪙</span> Token Creator
            </h3>
            <p className="text-muted-foreground">
              The Token Creator simplifies the process of launching SPL tokens on Solana. Define your token's name, 
              symbol, decimals, and total supply. You can toggle between Devnet (for testing) and Mainnet when you're 
              ready to deploy. The tool handles all the complex blockchain interactions for you.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="mr-2">💸</span> Airdrop
            </h3>
            <p className="text-muted-foreground">
              The Airdrop tool allows developers to request test SOL tokens on Devnet. Simply connect your wallet, 
              specify the amount of SOL you need (within limits), and submit your request. These tokens are perfect 
              for testing your applications without spending real funds.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AeroFlux. Built for the Solana ecosystem.</p>
          <p className="mt-2">Created by — Asvin Shrivas</p>
        </div>
      </footer>
    </div>
  );
}
