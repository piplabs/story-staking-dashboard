import { parseEther } from 'viem'
import { StakingPeriodMultiplierInfo } from './types'

export const links = {
  docsValidator: 'https://docs.story.foundation/docs/validator-operations',
  twitter: 'https://twitter.com/storyprotocol',
  privacy: 'https://story.foundation/privacy-policy',
  terms: 'https://story.foundation/terms',
}

// Network constants -- technically could pull from API or read onchain, however hardcoded as a constant to save RPC calls
export const totalToken = 1e9
export const feeEther = '1'
export const feeWei = parseEther(feeEther)

export const STAKING_PERIODS: Record<string, StakingPeriodMultiplierInfo[]> = {
  1315: [
    { value: '0', label: 'Flexible', multiplier: '1.0x', description: 'Unstake anytime' },
    { value: '1', label: '90 Days', multiplier: '1.051x', description: 'Lock for 90 days' },
    { value: '2', label: '360 Days', multiplier: '1.16x', description: 'Lock for 360 days' },
    { value: '3', label: '540 Days', multiplier: '1.34x', description: 'Lock for 540 days' },
  ] as const,
  1514: [
    { value: '0', label: 'Flexible', multiplier: '1.0x', description: 'Unstake anytime' },
    { value: '1', label: '90 Days', multiplier: '1.1x', description: 'Lock for 90 days' },
    { value: '2', label: '360 Days', multiplier: '1.5x', description: 'Lock for 360 days' },
    { value: '3', label: '540 Days', multiplier: '2.0x', description: 'Lock for 540 days' },
  ] as const,
}
