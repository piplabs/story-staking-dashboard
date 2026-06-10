import Link from 'next/link'
import { useAccount } from 'wagmi'

import { txExplorerUrl } from '@/lib/explorer'

export type ViewTransactionProps = {
  txHash: `0x${string}` | undefined
}

export default function ViewTransaction(props: ViewTransactionProps) {
  const href = txExplorerUrl(props.txHash)
  if (!href) return null
  return (
    <Link href={href} target="_blank">
      <p className="font-medium text-blue-600 hover:underline dark:text-blue-500">View transaction</p>
    </Link>
  )
}
