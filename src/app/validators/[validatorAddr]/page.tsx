'use client'

import { MoveLeftIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Address } from 'viem'

import CopyStringButton from '@/components/buttons/CopyStringButton'
import { Skeleton } from '@/components/ui/skeleton'
import { useValidator } from '@/lib/services/hooks/useValidator'

import { YourStakeCard } from './_components/ValidatorCtaCard'
import {
  AddressesCard,
  CommissionCard,
  OverviewCard,
  StakeInfoCard,
} from './_components/ValidatorDataCards'

const DelegatorsTable = dynamic(() => import('./_components/DelegatorsTable'), {
  ssr: false,
})
export const fetchCache = 'force-no-store'

export default function Page({ params }: { params: { validatorAddr: Address } }) {
  const {
    data: validator,
    isFetched,
    isPending,
  } = useValidator({ validatorAddr: params.validatorAddr })

  const moniker = validator?.description?.moniker
  if (!validator && isFetched) {
    return <div>Validator not found</div>
  }

  if (isPending) {
    return <Skeleton className="h-full w-full rounded-[16px]" />
  }

  if (!validator) return <Skeleton className="h-full w-full rounded-[16px]" />

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
            src={`https://cdn.stamp.fyi/avatar/${params.validatorAddr}`}
            alt="Validator Avatar"
            className="my-auto aspect-square h-12 w-12 rounded-md"
            width={48}
            height={48}
          />
          <div className="my-auto w-full break-words pr-8">
            {moniker ? (
              <h2>{moniker}</h2>
            ) : (
              <h2>
                {params.validatorAddr} <CopyStringButton value={params.validatorAddr} />
              </h2>
            )}
          </div>
        </div>
        <div className="my-auto">
          <ValidatorStatus status={validator.status} />
        </div>
      </section>

      <section className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1">
          <OverviewCard validator={validator} />
        </div>
        <div className="flex flex-1 place-items-stretch">
          <CommissionCard validator={validator} />
        </div>
        <div className="flex flex-1 place-self-stretch">
          {validator && <YourStakeCard validator={validator} />}
        </div>
      </section>
      <section className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex flex-1 place-items-stretch">
          <StakeInfoCard validator={validator} />
        </div>
        <div className="flex w-full flex-1 grow place-items-stretch lg:flex-[1.5]">
          <AddressesCard validator={validator} />
        </div>
      </section>
      <DelegatorsTable validator={validator} />
    </div>
  )
}

function ValidatorStatus({ status }: { status: number }) {
  let statusText
  let statusStyle
  if (status == 1) {
    statusText = 'INACTIVE'
    statusStyle = 'text-red-50'
  } else if (status == 2) {
    statusText = 'DEGRADED'
    statusStyle = 'text-yellow-500'
  } else if (status == 3) {
    statusText = 'ACTIVE'
    statusStyle = 'text-green-500'
  }

  return (
    <div className="flex flex-col rounded-[16px]">
      {/* <p>Status</p> */}
      <h1 className={statusStyle}>{statusText}</h1>
    </div>
  )
}
