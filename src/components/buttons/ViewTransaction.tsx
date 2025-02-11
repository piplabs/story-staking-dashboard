import Link from 'next/link'
import { useAccount } from 'wagmi'

export type ViewTransactionProps = {
  txHash: `0x${string}` | undefined
}

export default function ViewTransaction(props: ViewTransactionProps) {
  const { chain } = useAccount()

  const explorerUrl =
    chain && chain.blockExplorers ? chain.blockExplorers.default.url : process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL

  return (
    <Link href={`${explorerUrl}/tx/${props.txHash}`} target="_blank">
      <p className="font-medium text-blue-600 hover:underline dark:text-blue-500">View transaction</p>
    </Link>
  )
}
