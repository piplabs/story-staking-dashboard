'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { links } from '@/lib/constants'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { StakeDialog } from '@/components/dialogs/StakeDialog'
import { useAccount } from 'wagmi'
import ConnectWalletButton from '@/components/buttons/ConnectWalletButton'
import AprCalculatorDialog from '@/components/dialogs/AprCalculatorDialog'

export default function ValidatorHeader() {
  const isSmallDevice = useIsSmallDevice()
  const { isConnected, chainId } = useAccount()

  return (
    <section className="flex w-full flex-row gap-4">
      <h1 className="w-full">Validators</h1>
      {!isSmallDevice && (
        <div className="my-auto flex flex-row gap-4">
          {isConnected && chainId?.toString() == process.env.NEXT_PUBLIC_CHAIN_ID ? (
            <StakeDialog text={'Stake Now'} />
          ) : (
            <ConnectWalletButton text={'Stake Now'} />
          )}
          <AprCalculatorDialog />
          <Link href={links.docsValidator} target="_blank" rel="noreferrer noopener">
            <Button variant="outline">Become a Validator</Button>
          </Link>
        </div>
      )}
    </section>
  )
}
