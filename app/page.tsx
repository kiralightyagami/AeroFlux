import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const tools = [
  {
    name: "Swap",
    description: "Swap tokens using Jupiter aggregator",
    href: "/swap",
    icon: "💱"
  },
  {
    name: "Token Creator",
    description: "Create your own SPL token on Solana",
    href: "/token-creator",
    icon: "🪙"
  },
  {
    name: "Airdrop",
    description: "Request SOL tokens on Devnet for testing",
    href: "/airdrop",
    icon: "🚰"
  },
  // Add more tools here as they become available
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">AeroFlux</h1>
        <p className="text-xl text-muted-foreground">A powerful suite of Solana tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.name} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <span className="text-2xl">{tool.icon}</span>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={tool.href} className="w-full">
                <Button className="w-full">Open {tool.name}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
