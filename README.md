# AeroFlux

<div align="center">
  <img src="public/aeroflux-logo.png" alt="AeroFlux Logo" width="200"/>
  <p><strong>A powerful suite of Solana tools for developers and users</strong></p>
</div>

## Overview

AeroFlux provides an intuitive and streamlined interface for interacting with the Solana blockchain. Whether you're a developer, trader, or blockchain enthusiast, our tools help you harness the power of Solana with ease.

Built with performance and user experience in mind, AeroFlux supports token swaps through Jupiter aggregator, custom SPL token creation, and convenient access to testnet resources for development.

## Features

### 🪙 Token Creator
Create your own SPL tokens on Solana with a simple interface:
- Customize token details (name, symbol, decimals)
- Set initial supply and mint authority
- Deploy to Devnet or Mainnet
- Full SPL token standard compliance

### 💱 Token Swap
Swap tokens using Jupiter aggregator:
- Best exchange rates with minimal slippage
- Support for SOL, USDC, USDT and other tokens
- Real-time price feeds
- Secure transaction execution

### 💸 Airdrop
Request SOL tokens on Devnet for testing:
- Simple interface for requesting test tokens
- Quick confirmation
- Perfect for development and testing

### 🤖 AI Assistant
Get real-time help with our Gemini-powered AI assistant:
- Ask questions about Solana and our tools
- Receive step-by-step guidance
- Code examples with syntax highlighting
- Rich markdown support

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/AeroFlux.git
cd AeroFlux
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your own values:
- For the AI Assistant functionality, get a Gemini API key from Google AI Studio

4. Run the development server
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Blockchain**: Solana Web3.js, SPL Token, Raydium SDK
- **Wallet**: Solana Wallet Adapter
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS, shadcn/ui components

## Deployment

Deploy AeroFlux on your preferred hosting platform:

1. Build the project
```bash
pnpm build
# or
npm run build
```

2. Start the production server
```bash
pnpm start
# or
npm run start
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Solana Foundation](https://solana.com)
- [Jupiter Aggregator](https://jup.ag)
- [Google Gemini API](https://ai.google.dev)

---

<div align="center">
  <p>Built for the Solana ecosystem with ❤️</p>
  <p>© 2025 AeroFlux</p>
</div>
