'use client';
import { use } from "react";

import { MoveLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Address, formatEther } from 'viem'

import { DataRow } from '@/app/validators/[validatorAddr]/_components/ValidatorDataCards'
import CopyStringButton from '@/components/buttons/CopyStringButton'
import { useDelegatorTotalDelegationAmount } from '@/lib/services/hooks/useDelegatorTotalDelegationAmount'
import { useDelegatorRewards } from '@/lib/services/hooks/useDelegatorTotalRewards'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

import DelegationsTable from './_components/DelegationsTable'
import UnbondedDelegationsTable from './_components/UnbondedDelegationsTable'
import StyledCard from '@/components/cards/StyledCard'

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
          <div className="my-auto w-full break-words pr-8 text-xl ">
            <h2 className="flex flex-row">
              {isSmallDevice ? truncateAddress(params.delegatorEvmAddr) : params.delegatorEvmAddr}{' '}
              <CopyStringButton value={params.delegatorEvmAddr} />
            </h2>
          </div>
        </div>
      </section>
      <div className="flex flex-row">
        <OverviewCard delegatorAddr={params.delegatorEvmAddr} />
      </div>
      <DelegationsTable delegatorEvmAddr={params.delegatorEvmAddr} />
      <UnbondedDelegationsTable delegatorEvmAddr={params.delegatorEvmAddr} />
    </div>
  )
}

function OverviewCard({ delegatorAddr }: { delegatorAddr: Address }) {
  const { data: totalStake, isPending } = useDelegatorTotalDelegationAmount({ delegatorAddr })
  const { data: rewards, isPending: isRewardsPending } = useDelegatorRewards({
    delegatorAddr,
  })

  return (
    <StyledCard className="w-full md:w-1/3">
      <p className="font- text-3xl font-medium">Overview</p>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Total Staked"
          value={
            isPending || totalStake === undefined
              ? '-'
              : `${formatLargeMetricsNumber(formatEther(totalStake, 'gwei'))} IP`
          }
          tooltipInfo="The total amount of IP staked across validators"
        />

        <DataRow
          title="Total Rewards Earned"
          value={
            !rewards
              ? '-'
              : `${formatLargeMetricsNumber(parseFloat(Number(rewards.accumulatedRewards).toFixed(2)).toString())} IP`
          }
          tooltipInfo="The total IP rewards earned from staking on validators"
        />
      </section>
    </StyledCard>
  )
}
