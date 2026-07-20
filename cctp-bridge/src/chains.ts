/**
 * Blockchain & CCTP Configuration
 * All testnet chains with contract addresses and domain mappings
 */

import type { ChainConfig } from './types'

/**
 * CCTP Domain IDs for each blockchain
 * Source: Circle CCTP documentation
 */
export const DOMAINS = {
  arc: 26,
  sepolia: 0,
  solana: 5,
  base: 6,
  arbitrum: 3,
  polygon: 7,
} as const

/**
 * Chain Configurations - All testnet
 * Update RPC URLs with actual endpoints (some need API keys)
 */
export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  arc: {
    name: 'arc',
    displayName: 'Arc',
    rpcUrl: 'https://rpc.testnet.arc.network',
    chainId: '0x4CF3D2',
    usdc: '0x3600000000000000000000000000000000000000',
    tokenMessenger: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
    domain: DOMAINS.arc,
    decimals: 6,
    blockExplorer: 'https://testnet.arcscan.app',
  },

  sepolia: {
    name: 'sepolia',
    displayName: 'Ethereum Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    chainId: '0xAA36A7',
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    tokenMessenger: '0xd0c3da58b55b1237134ad61d91b6f00bdb4442eb',
    domain: DOMAINS.sepolia,
    decimals: 6,
    blockExplorer: 'https://sepolia.etherscan.io',
  },

  solana: {
    name: 'solana',
    displayName: 'Solana',
    rpcUrl: 'https://api.devnet.solana.com',
    chainId: 999,
    usdc: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Placeholder - Solana uses different token system
    tokenMessenger: '0x0000000000000000000000000000000000000000', // Placeholder
    domain: DOMAINS.solana,
    decimals: 6,
    blockExplorer: 'https://explorer.solana.com?cluster=devnet',
  },

  base: {
    name: 'base',
    displayName: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    chainId: '0x14A34',
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    tokenMessenger: '0x0a992d191deec32abe2f1bdb6c6b31cdf48616da',
    domain: DOMAINS.base,
    decimals: 6,
    blockExplorer: 'https://sepolia.basescan.org',
  },

  arbitrum: {
    name: 'arbitrum',
    displayName: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rpc.arbitrum.io/rpc',
    chainId: '0x66EEE',
    usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    tokenMessenger: '0x19330d10b9afbde3b6b307991146feb4883b65d7',
    domain: DOMAINS.arbitrum,
    decimals: 6,
    blockExplorer: 'https://sepolia.arbiscan.io',
  },

  polygon: {
    name: 'polygon',
    displayName: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    chainId: '0x13881',
    usdc: '0x9999f7Fea5938fD3b6EE7D6d4b7FFFab0EE55959',
    tokenMessenger: '0x9f3be5142f29fc8db5B4ee3cFFDA8e3249166588',
    domain: DOMAINS.polygon,
    decimals: 6,
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
}

/**
 * Get chain config by name
 */
export function getChainConfig(chainName: string): ChainConfig | null {
  return CHAIN_CONFIGS[chainName.toLowerCase()] || null
}

/**
 * Get chain domain by name
 */
export function getChainDomain(chainName: string): number | null {
  const config = getChainConfig(chainName)
  return config ? config.domain : null
}

/**
 * All supported chains
 */
export const SUPPORTED_CHAINS = Object.keys(CHAIN_CONFIGS)

/**
 * Display names for UI
 */
export const CHAIN_DISPLAY_NAMES: Record<string, string> = Object.entries(
  CHAIN_CONFIGS
).reduce(
  (acc, [key, config]) => {
    acc[key] = config.displayName
    return acc
  },
  {} as Record<string, string>
)

/**
 * Circle CCTP Sandbox API endpoints
 * Replace with production URLs for mainnet
 */
export const CIRCLE_API = {
  baseUrl: 'https://iris-api-sandbox.circle.com/v2',
  feeEndpoint: (sourceDomain: number, destDomain: number) =>
    `/burn/USDC/fees/${sourceDomain}/${destDomain}?forward=true`,
  messageEndpoint: (sourceDomain: number, txHash: string) =>
    `/messages/${sourceDomain}?transactionHash=${txHash}`,
}
