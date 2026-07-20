# helpThem - Arc Testnet USDC Rescue Platform

A multi-chain rescue layer for wallets stuck with USDC on Arc blockchain. Burn USDC on Arc and automatically mint on any supported destination chain via Circle's CCTP forwarding service.

## 🎯 What It Does

helpThem solves a common Web3 problem: **a wallet has USDC on Arc but needs gas on another chain** (Ethereum, Solana, Base, Arbitrum, Polygon).

**The Flow:**
1. User generates a rescue link with their wallet address and destination chain
2. Helper connects MetaMask to Arc network
3. Helper approves USDC and initiates a burn transaction
4. Circle's CCTP bridge routes the burn to the destination chain
5. USDC is automatically minted to the recipient's address
6. Recipient now has gas to continue building ✨

## 🚀 Live Demo

**Testnet:** https://helptem-mvp.vercel.app

- **Landing Page**: Generate rescue links and manage rescues
- **Rescue Page**: Live burn/mint interface for Arc → multi-chain
- **Supported Chains**: Ethereum Sepolia, Solana, Base, Arbitrum, Polygon (testnet)

## 📋 Prerequisites

- MetaMask wallet with testnet tokens (USDC on Arc)
- Arc network configured in MetaMask (chain ID: 0x4CF3D2)
- Browser with Web3 support (ethers.js via CDN)

## 🛠️ Development Setup

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/helptem.git
cd helptem

# Install cctp-bridge dependencies
cd cctp-bridge
npm install

# Build TypeScript utilities
npm run build

# Return to root
cd ..

# Serve locally (use any HTTP server)
npx http-server
# or
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Project Structure

```
helptem/
├── index.html              # Landing page with rescue link generator
├── rescue.html             # Live rescue interface (burn/mint flow)
├── vercel.json             # Vercel deployment config
├── .gitignore              # Git ignore file
└── cctp-bridge/            # TypeScript utility library
    ├── src/
    │   ├── index.ts        # Main exports (fee estimation, polling, helpers)
    │   ├── chains.ts       # Chain configs & contract addresses
    │   └── types.ts        # TypeScript interfaces
    ├── dist/               # Compiled JavaScript (generated)
    ├── tsconfig.json       # TypeScript configuration
    └── package.json        # Dependencies (viem, ethers, typescript)
```

## 🔗 Smart Contracts & APIs

### Testnet Contracts

#### Arc Testnet
- **USDC**: `0x3600000000000000000000000000000000000000`
- **TokenMessenger V2**: `0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA`
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: https://testnet.arcscan.app

#### Ethereum Sepolia
- **USDC**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **TokenMessenger**: `0xd0c3da58b55b1237134ad61d91b6f00bdb4442eb`
- **RPC**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io

#### Base Sepolia
- **USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **TokenMessenger**: `0x0a992d191deec32abe2f1bdb6c6b31cdf48616da`
- **RPC**: https://sepolia.base.org

#### Arbitrum Sepolia
- **USDC**: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`
- **TokenMessenger**: `0x19330d10b9afbde3b6b307991146feb4883b65d7`
- **RPC**: https://sepolia-rpc.arbitrum.io/rpc

#### Polygon Mumbai
- **USDC**: `0x9999f7Fea5938fD3b6EE7D6d4b7FFFab0EE55959`
- **TokenMessenger**: `0x9f3be5142f29fc8db5B4ee3cFFDA8e3249166588`
- **RPC**: https://rpc-mumbai.maticvigil.com

### Circle CCTP API

**Sandbox Endpoints:**
- Fee Estimation: `GET /v2/burn/USDC/fees/{sourceDomain}/{destDomain}?forward=true`
- Message Status: `GET /v2/messages/{sourceDomain}?transactionHash={hash}`
- Base URL: `https://iris-api-sandbox.circle.com`

**CCTP Domain IDs:**
- Arc: 26
- Ethereum: 0
- Solana: 5
- Base: 6
- Arbitrum: 3
- Polygon: 7

## 🧪 Testing Checklist

### Manual Testing on Testnet

1. **Test Landing Page**
   - [ ] Wallet input validation
   - [ ] Chain selection (all 5 chains work)
   - [ ] Generate rescue link button
   - [ ] Copy link functionality

2. **Test Rescue Page**
   - [ ] MetaMask connection
   - [ ] Arc network auto-switch
   - [ ] USDC approval
   - [ ] Burn transaction success
   - [ ] Fee estimation from Circle API
   - [ ] Transaction logging
   - [ ] Polling for mint completion
   - [ ] Recipient receives USDC on destination
   - [ ] Error handling (invalid address, low amount, network errors)

3. **Test All Chains**
   - [ ] Arc → Sepolia
   - [ ] Arc → Base
   - [ ] Arc → Arbitrum
   - [ ] Arc → Polygon
   - [ ] Arc → Solana (if available)

## 📦 Deployment

### Vercel (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Or push to GitHub and link for auto-deploy
git push origin main
```

Vercel configuration is in `vercel.json`:
- Builds cctp-bridge TypeScript utilities
- Serves static HTML files
- Security headers configured
- API rewrite for Circle endpoints

### GitHub Pages

```bash
# Build
cd cctp-bridge && npm run build && cd ..

# Push to GitHub
git push origin main

# Enable Pages in repository settings
# Point to / (root)
```

### Custom Server

```bash
# Build dependencies
cd cctp-bridge && npm run build && cd ..

# Serve with any HTTP server
npx http-server
# or
python -m http.server 8000
# or
node -e "require('http').createServer((_, res) => res.end(require('fs').readFileSync('./index.html'))).listen(3000)"
```

## 🔐 Security Considerations

### Current MVP
- ✅ Client-side only (no private key exposure)
- ✅ MetaMask handling all transaction signing
- ✅ USDC approval limited to amount + fee
- ⚠️ No backend authentication
- ⚠️ No rate limiting

### Before Mainnet
- [ ] Add backend API for transaction validation
- [ ] Implement rate limiting
- [ ] Add CSRF protection if needed
- [ ] Audit smart contract interactions
- [ ] Security review of Circle CCTP integration
- [ ] Add user feedback/spam reporting

## 📊 Environment Variables

### For Vercel Deployment

```
CIRCLE_API_URL=https://iris-api-sandbox.circle.com/v2
NEXT_PUBLIC_ARC_RPC=https://rpc.testnet.arc.network
```

Set in Vercel project settings under Environment Variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🗺️ Roadmap

### MVP (Current)
- ✅ Multi-chain rescue (5 chains on testnet)
- ✅ Live rescue interface
- ✅ Circle CCTP integration
- ✅ Vercel deployment ready

### Phase 2 (After Launch)
- [ ] Wallet dashboard (rescue history)
- [ ] Gas calculator per chain
- [ ] Thank you card generation
- [ ] Emergency QR code
- [ ] Mainnet support
- [ ] Mobile app

### Phase 3 (Long-term)
- [ ] Additional chains (Optimism, Polygon Mainnet, zkSync)
- [ ] Waitlist backend
- [ ] User authentication
- [ ] Analytics dashboard

## 📝 License

MIT License - see LICENSE file for details

## 🙋 Support

- **Docs**: https://docs.helptem.xyz (coming soon)
- **Discord**: https://discord.gg/helptem (coming soon)
- **Twitter**: @helpThem_xyz
- **Issues**: GitHub issues page

## 🙏 Acknowledgments

- Circle for CCTP bridge infrastructure
- Arc team for testnet support
- ethers.js for Web3 integration
- Vercel for deployment platform

---

**Built with ❤️ by the helpThem team**

Last updated: 2026-07-21 | Testnet Version 1.0.0
