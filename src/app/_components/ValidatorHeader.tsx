'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { links } from '@/lib/constants'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { StakeDialog } from '@/components/dialogs/StakeDialog'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import ConnectWalletButton from '@/components/buttons/ConnectWalletButton'

export default function ValidatorHeader() {
  const isSmallDevice = useIsSmallDevice()
  const { isConnected } = useAccount()

  return (
    <section className="flex w-full flex-row gap-4">
      <h1 className="w-full">Validators</h1>
      {!isSmallDevice && (
        <div className="my-auto flex flex-row gap-8">
          {isConnected ? <StakeDialog text={'Stake Now'} /> : <ConnectWalletButton text={'Stake Now'} />}

          <Link
            href={'https://docs.story.foundation/docs/node-setup-dev-mainnet'}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Button variant="outline">Become a Validator</Button>
          </Link>
        </div>
      )}
    </section>
  )
}
