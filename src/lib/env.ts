import { z } from 'zod'

const envVariables = z.object({
  NEXT_PUBLIC_WALLETCONNECT_ID: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_TESTNET_EXPLORER_URL: z.string(),
  NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_NETWORK_RPC_URL: z.string(),
  NEXT_PUBLIC_CHAINID: z.string(),
  NEXT_PUBLIC_STAKING_API_URL: z.string().url(),
  NEXT_PUBLIC_SINGULARITY_BLOCK_HEIGHT: z.string().transform((val) => parseInt(val)),
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
