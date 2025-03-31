'use client';
import { use } from "react";

import { MoveLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Address } from 'viem'

import CopyStringButton from '@/components/buttons/CopyStringButton'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { truncateAddress } from '@/lib/utils'

import ActivityTable from './_components/ActivityTable'

export default function Page(props: { params: Promise<{ delegatorEvmAddr: Address }> }) {
  const params = use(props.params);
  const isSmallDevice = useIsSmallDevice()

  return (
    <div className="max-w-screen flex h-full w-full flex-col gap-8 text-white">
      <section className="flex flex-row gap-2">
        <Link href="/">
          <div className="flex flex-row gap-2">
            <MoveLeftIcon size={24} />
            Back to Home
          </div>
        </Link>
      </section>
      <section className="flex flex-col justify-between lg:flex-row">
        <div className="mb-4 flex flex-row gap-2 rounded-md">
          <Image
            src={`https://cdn.stamp.fyi/avatar/${params.delegatorEvmAddr}`}
            alt="Validator Avatar"
            className="my-auto aspect-square h-12 w-12 rounded-md"
            width={48}
            height={48}
          />
          <div className="my-auto flex w-full flex-row break-words pr-8 text-xl">
            <h2>{isSmallDevice ? truncateAddress(params.delegatorEvmAddr) : params.delegatorEvmAddr} </h2>
            <CopyStringButton value={params.delegatorEvmAddr} />
          </div>
        </div>
      </section>
      <ActivityTable delegatorEvmAddr={params.delegatorEvmAddr} />
    </div>
  )
}
