import { z } from 'zod'

const envVariables = z.object({
  NEXT_PUBLIC_WALLETCONNECT_ID: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_EXPLORER_URL: z.string(),
  NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_STAKING_API_URL: z.string().url(),
  NEXT_PUBLIC_SINGULARITY_BLOCK_HEIGHT: z.string().transform((val) => parseInt(val)),
  NEXT_PUBLIC_CHAIN_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string(),
  // Optional override for the DKG dashboard URL. Aeneid + mainnet have
  // built-in defaults (see DKG_DASHBOARD_URLS in constants.ts); custom
  // networks set this to point at their own DKG dashboard deployment.
  NEXT_PUBLIC_DKG_DASHBOARD_URL: z.string().url().optional(),
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
