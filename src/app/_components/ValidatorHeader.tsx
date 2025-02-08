'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { links } from '@/lib/constants'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { StakeDialog } from '@/components/dialogs/StakeDialog'

export default function ValidatorHeader() {
  const isSmallDevice = useIsSmallDevice()

  return (
    <section className="flex w-full flex-row gap-4">
      <h1 className="w-full">Validators</h1>
      {!isSmallDevice && (
        <div className="my-auto flex flex-row gap-8">
          {/* <StakeDialog /> */}
          <Button>Stake Now</Button>

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
