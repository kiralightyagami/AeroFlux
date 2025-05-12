import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 tracking-tight">AeroFlux</h1>
        <p className="text-xl text-muted-foreground">A powerful suite of Solana tools</p>
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
        </div>
      </footer>
    </div>
  );
}
