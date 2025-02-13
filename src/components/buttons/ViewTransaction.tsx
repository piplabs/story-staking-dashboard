import Link from 'next/link'
import { useAccount } from 'wagmi'

export type ViewTransactionProps = {
  txHash: `0x${string}` | undefined
}

export default function ViewTransaction(props: ViewTransactionProps) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${props.txHash}`} target="_blank">
      <p className="font-medium text-blue-600 hover:underline dark:text-blue-500">View transaction</p>
    </Link>
  )
}
