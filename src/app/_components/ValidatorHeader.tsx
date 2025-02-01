'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { links } from '@/lib/constants'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'

export default function ValidatorHeader() {
  const isSmallDevice = useIsSmallDevice()

  return (
    <section className="flex w-full flex-row gap-4">
      <h1 className="w-full">Validators</h1>
      {!isSmallDevice && (
        <div className="my-auto">
          <Link href={links.docsValidator} target="_blank" rel="noreferrer noopener">
            <Button variant="secondary">Become a Validator</Button>
          </Link>
        </div>
      )}
    </section>
  )
}
