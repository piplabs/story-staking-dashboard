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
import { mainnet } from 'viem/chains'
import { WagmiProvider, createConfig, fallback, http } from 'wagmi'

export const storyAeneid = defineChain({
  id: 1315,
  name: 'Story Aeneid',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Aeneid Explorer',
      url: 'https://aeneid.storyscan.xyz/',
    },
  },
  testnet: true,
})

export const storyMainnet = defineChain({
  id: 1514,
  name: 'Story Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Explorer',
      url: 'https://storyscan.xyz/',
    },
  },
  testnet: false,
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

const testnetConfig = createConfig({
  chains: [storyAeneid],
  transports: {
    [1315]: fallback([http('https://aeneid.storyrpc.io')]),
  },
  connectors,
  ssr: true,
})

const mainnetConfig = createConfig({
  chains: [storyMainnet],
  transports: {
    [1514]: fallback([
      // http('https://mainnet.storyrpc.io'),
      http('https://internal-full.storyrpc.io', {
        fetchOptions: {
          headers: {
            'X-Origin': 'staking.story.foundation',
          },
        },
      }),
    ]),
  },
  connectors,
  ssr: true,
})
const queryClient = new QueryClient()

export default function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider
      config={process.env.NEXT_PUBLIC_CHAIN_ID == storyMainnet.id.toString() ? mainnetConfig : testnetConfig}
    >
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
