import { parseEther } from 'viem'

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
