'use client'
import { use } from 'react'

import { MoveLeftIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Address } from 'viem'

import CopyStringButton from '@/components/buttons/CopyStringButton'
import { Skeleton } from '@/components/ui/skeleton'
import { useValidator } from '@/lib/services/hooks/useValidator'

import { YourStakeCard } from './_components/ValidatorCtaCard'
import { AddressesCard, CommissionCard, OverviewCard, StakeInfoCard } from './_components/ValidatorDataCards'
import DelegatorsTable from './_components/DelegatorsTable'

export default function Page(props: { params: Promise<{ validatorAddr: Address }> }) {
  const params = use(props.params)
  const { data: validator, isFetched, isPending } = useValidator({ validatorAddr: params.validatorAddr })

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
          <div className="my-auto w-full break-words flex flex-row gap-4">
            {moniker ? (
              <h2 className="flex flex-row">
                {moniker} <CopyStringButton value={moniker} />
              </h2>
            ) : (
              <h2>
                {params.validatorAddr} <CopyStringButton value={params.validatorAddr} />
              </h2>
            )}
            <div className="my-auto flex flex-row gap-2">
              <ValidatorStatus status={validator.status} />
              <JailedStatus isJailed={validator.jailed} />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1">
          <OverviewCard validator={validator} />
        </div>
        <div className="flex flex-1 place-items-stretch">
          <CommissionCard validator={validator} />
        </div>
        <div className="flex flex-1 place-self-stretch">{validator && <YourStakeCard validator={validator} />}</div>
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
  if (status == 2 || status == 0) return null // UNBONDING or UNDEFINED

  let statusText
  let statusStyle
  if (status == 1) {
    statusText = 'UNBONDED'
    statusStyle = 'text-white'
  } else if (status == 3) {
    statusText = 'ACTIVE'
    statusStyle = 'text-green-500'
  }
  // else if (status == 2) {
  //   statusText = 'UNBONDING'
  //   statusStyle = 'text-yellow-500'
  // }

  return (
    <div className="">
      <h2 className={statusStyle}>{statusText}</h2>
    </div>
  )
}

function JailedStatus({ isJailed }: { isJailed: boolean }) {
  if (!isJailed) return null

  return (
    <div className="">
      <h2 className={'text-yellow-500'}>JAILED</h2>
    </div>
  )
}
