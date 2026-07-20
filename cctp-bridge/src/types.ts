/**
 * helpThem CCTP Bridge Types
 * Shared types for Circle CCTP multi-chain support
 */

export interface ChainConfig {
  name: string
  displayName: string
  rpcUrl: string
  chainId: `0x${string}` | number
  usdc: `0x${string}`
  tokenMessenger: `0x${string}`
  domain: number
  decimals: number
  blockExplorer?: string
}

export interface BurnParams {
  amount: bigint
  sourceDomain: number
  destinationDomain: number
  recipient: `0x${string}`
  maxFee: bigint
  minFinalityThreshold?: number
}

export interface FeeEstimate {
  minimumFee: bigint
  amount?: bigint
}

export interface CircleMessage {
  id: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  transactionHash: string
  forwardTxHash?: string
  destinationChain?: string
}

export interface BurnTransaction {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  amount: bigint
  recipient: `0x${string}`
  sourceDomain: number
  destinationDomain: number
}

export interface PollingResult {
  status: 'complete' | 'pending' | 'failed' | 'timeout'
  message?: CircleMessage
  error?: string
  attempts: number
}
