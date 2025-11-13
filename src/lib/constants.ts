import { parseEther } from 'viem'
import { StakingPeriodMultiplierInfo } from './types'

export const links = {
  docsValidator: 'https://docs.story.foundation/network/participate/validators/overview',
  twitter: 'https://x.com/storyprotocol',
  privacy: 'https://story.foundation/privacy-policy',
  terms: 'https://story.foundation/terms',
}

// Network constants -- technically could pull from API or read onchain, however hardcoded as a constant to save RPC calls
export const totalToken = 1e9
export const feeEther = '1'
export const feeWei = parseEther(feeEther)

export const STAKING_PERIODS: Record<string, StakingPeriodMultiplierInfo[]> = {
  1315: [
    { value: '0', label: 'Flexible (Unstake anytime)', multiplier: '1.0x', description: '1.0x rewards' },
    { value: '1', label: 'Lock for 90 Days', multiplier: '1.051x', description: '1.051x rewards' },
    { value: '2', label: 'Lock for 360 Days', multiplier: '1.16x', description: '1.16x rewards' },
    { value: '3', label: 'Lock for 540 Days', multiplier: '1.34x', description: '1.34x rewards' },
  ] as const,
  1514: [
    { value: '0', label: 'Flexible (Unstake anytime)', multiplier: '1.0x', description: '1.0x rewards' },
    { value: '1', label: 'Lock for 90 Days', multiplier: '1.1x', description: '1.1x rewards' },
    { value: '2', label: 'Lock for 360 Days', multiplier: '1.5x', description: '1.5x rewards' },
    { value: '3', label: 'Lock for 540 Days', multiplier: '2.0x', description: '2x rewards' },
  ] as const,
}

export const LOCKED_STAKING_PERIODS: Record<string, StakingPeriodMultiplierInfo[]> = {
  1315: [{ value: '0', label: 'Flexible (Unstake anytime)', multiplier: '0.5x', description: '0.5x rewards' }] as const,
  1514: [{ value: '0', label: 'Flexible (Unstake anytime)', multiplier: '0.5x', description: '0.5x rewards' }] as const,
}
