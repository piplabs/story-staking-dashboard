'use client'

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import {
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { defineChain } from 'viem'
import { WagmiProvider, createConfig, fallback, http } from 'wagmi'

const KNOWN_NETWORKS: Record<number, { name: string; rpcUrl: string; explorerUrl: string; testnet: boolean }> = {
  1315: {
    name: 'Story Aeneid',
    rpcUrl: 'https://aeneid.storyrpc.io',
    explorerUrl: 'https://aeneid.storyscan.xyz/',
    testnet: true,
  },
  1514: {
    name: 'Story Mainnet',
    rpcUrl: 'https://mainnet.storyrpc.io',
    explorerUrl: 'https://storyscan.xyz/',
    testnet: false,
  },
}

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const knownNetwork = KNOWN_NETWORKS[chainId]

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || knownNetwork?.rpcUrl || 'http://localhost:8545'
const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || knownNetwork?.explorerUrl || ''
const chainName = knownNetwork?.name || `Story (${chainId})`
const isTestnet = knownNetwork?.testnet ?? true

export const storyChain = defineChain({
  id: chainId,
  name: chainName,
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
  blockExplorers: explorerUrl
    ? {
        default: {
          name: `${chainName} Explorer`,
          url: explorerUrl,
        },
      }
    : undefined,
  testnet: isTestnet,
})

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        okxWallet,
        phantomWallet,
        injectedWallet,
        safeWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Story Staking Dashboard',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  }
)

const transports =
  chainId === 1514
    ? fallback([
        http(rpcUrl),
        http('https://internal-full.storyrpc.io', {
          fetchOptions: {
            headers: {
              'X-Origin': 'staking.story.foundation',
            },
          },
        }),
      ])
    : fallback([http(rpcUrl)])

const wagmiConfig = createConfig({
  chains: [storyChain],
  transports: {
    [chainId]: transports,
  },
  connectors,
  ssr: true,
})

const queryClient = new QueryClient()

export default function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
