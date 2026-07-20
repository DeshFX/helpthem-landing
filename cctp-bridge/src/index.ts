/**
 * helpThem CCTP Bridge Utilities
 * High-level abstractions for Circle CCTP operations
 * 
 * Supports burning USDC on Arc and minting on any destination chain
 */

import type { BurnParams, FeeEstimate, PollingResult } from './types'
import { CIRCLE_API } from './chains'

/**
 * Build the forward hook data for Arc CCTP forwarding
 * This tells Circle to forward the mint to the destination automatically
 */
export function buildForwardHookData(): `0x${string}` {
  return '0x636374702d666f72776172640000000000000000000000000000000000000000'
}

/**
 * Convert Ethereum address to bytes32 format for CCTP
 * Required for mintRecipient parameter in depositForBurnWithHook
 */
export function addressToBytes32(address: `0x${string}`): `0x${string}` {
  // Pad address with zeros on the left to make it 32 bytes
  return ('0x000000000000000000000000' + address.slice(2).toLowerCase()) as `0x${string}`
}

/**
 * Estimate CCTP bridge fees for a burn transaction
 * Fetches from Circle's fee API
 * 
 * @param sourceDomain - CCTP domain of source chain (e.g., 26 for Arc)
 * @param destDomain - CCTP domain of destination chain (e.g., 0 for Sepolia)
 * @returns Fee estimate in 6-decimal units (same as USDC)
 */
export async function estimateFee(
  sourceDomain: number,
  destDomain: number
): Promise<FeeEstimate> {
  const endpoint = CIRCLE_API.feeEndpoint(sourceDomain, destDomain)
  const url = CIRCLE_API.baseUrl + endpoint

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Circle API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const entry = Array.isArray(data) ? data[0] : data

  if (!entry?.minimumFee) {
    throw new Error('No fee data in Circle response')
  }

  return {
    minimumFee: BigInt(Math.ceil(Number(entry.minimumFee))),
    amount: entry.amount ? BigInt(entry.amount) : undefined,
  }
}

/**
 * Build parameters for the depositForBurnWithHook smart contract call
 * 
 * This is the low-level transaction data needed for viem/ethers to call
 * the TokenMessenger contract on Arc
 */
export function buildBurnParams(options: {
  amount: bigint
  sourceDomain: number
  destDomain: number
  recipient: `0x${string}`
  maxFee: bigint
}): BurnParams {
  return {
    amount: options.amount,
    sourceDomain: options.sourceDomain,
    destinationDomain: options.destDomain,
    recipient: options.recipient,
    maxFee: options.maxFee,
    minFinalityThreshold: 1000,
  }
}

/**
 * Poll Circle API to check if a burn has been processed and minted
 * on the destination chain
 * 
 * @param sourceDomain - CCTP domain (e.g., 26 for Arc)
 * @param burnTxHash - Transaction hash of the burn transaction
 * @param maxAttempts - Maximum number of polling attempts (default 40, ~3-4 min)
 * @param delayMs - Delay between polls in milliseconds (default 5000)
 * @returns Polling result with final status and mint details
 */
export async function pollForMint(
  sourceDomain: number,
  burnTxHash: string,
  maxAttempts: number = 40,
  delayMs: number = 5000
): Promise<PollingResult> {
  const endpoint = CIRCLE_API.messageEndpoint(sourceDomain, burnTxHash)
  const url = CIRCLE_API.baseUrl + endpoint

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          // Message not found yet, keep polling
          await delay(delayMs)
          continue
        }
        throw new Error(`Circle API error: ${response.status}`)
      }

      const data = await response.json()
      const message = data?.messages?.[0]

      if (!message) {
        await delay(delayMs)
        continue
      }

      // Check status
      if (message.status === 'complete') {
        return {
          status: 'complete',
          message: {
            id: message.id || '',
            status: 'complete',
            transactionHash: burnTxHash,
            forwardTxHash: message.forwardTxHash,
            destinationChain: message.destinationChain,
          },
          attempts: attempts + 1,
        }
      }

      if (message.status === 'failed') {
        return {
          status: 'failed',
          error: 'Mint failed on destination chain',
          attempts: attempts + 1,
        }
      }

      // Still pending
      await delay(delayMs)
    } catch (error) {
      console.error('Polling error:', error)
      await delay(delayMs)
    }
  }

  return {
    status: 'timeout',
    error: `Polling timed out after ${maxAttempts} attempts`,
    attempts: maxAttempts,
  }
}

/**
 * Utility: Sleep for N milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Format token amount from human-readable to contract units
 * USDC has 6 decimals everywhere
 */
export function parseUSDC(amount: string | number): bigint {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return BigInt(Math.floor(numAmount * 1e6))
}

/**
 * Format token amount from contract units to human-readable
 */
export function formatUSDC(amount: bigint): string {
  return (Number(amount) / 1e6).toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
}

/**
 * Check if an address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

// Export types and constants
export { CHAIN_CONFIGS, DOMAINS, SUPPORTED_CHAINS, CHAIN_DISPLAY_NAMES, getChainConfig, getChainDomain } from './chains'
export type { ChainConfig, BurnParams, FeeEstimate, CircleMessage, BurnTransaction, PollingResult } from './types'
