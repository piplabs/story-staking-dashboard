import { defineConfig, loadEnv } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { Abi, Address } from 'viem'

import { ipTokenStakeAbi } from '@/lib/abi/ipTokenStakeAbi'

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  })

  return {
    out: './src/lib/contracts.ts',
    contracts: [
      {
        name: 'IPTokenStake',
        abi: ipTokenStakeAbi,
        address: env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as Address,
      },
    ],
    plugins: [react()],
  }
})
