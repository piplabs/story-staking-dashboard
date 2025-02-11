'use client'

import Link from 'next/link'
import React from 'react'

import { links } from '@/lib/constants'
import useNetworkHealth from '@/lib/services/hooks/useNetworkHealth'
import { cn } from '@/lib/utils'
import { useSingularity } from '@/lib/services/hooks/useSingularity'
import TooltipWrapper from '../TooltipWrapper'

export default function NetworkHealthBanner() {
  const { data: networkHealth } = useNetworkHealth()
  const { isSingularity } = useSingularity()

  if (!networkHealth) return null
  if (networkHealth.status === 'Pending') return null

  const statusDisplay = {
    icon: {
      Normal: GreenCheck(),
      Degraded: YellowWarning(),
      Down: RedAlert(),
    },
    style: {
      Normal: 'border-white/[17%] bg-primary-grey',
      Degraded: 'border-[#E4CE07] bg-[#514903]',
      Down: 'border-[#EF7276] bg-[#4A030B]',
    },
    text: {
      Normal: (
        <p className="flex items-center">
          Network is operating normally. Current block height is {networkHealth.execution_block_height}.
        </p>
      ),
      Degraded: (
        <p className="">
          Network is experiencing delays. Follow our{' '}
          <Link href={links.twitter} target="_blank" rel="noopener noreferrer" className="underline">
            X/Twitter
          </Link>
          for updates.
        </p>
      ),
      Down: (
        <p className="">
          Network is down. Follow our{' '}
          <Link href={links.twitter} target="_blank" rel="noopener noreferrer" className="underline">
            X/Twitter
          </Link>{' '}
          for immediate updates.
        </p>
      ),
    },
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex flex-col lg:flex-col gap-2 rounded-lg border px-4 py-2.5 font-medium text-white my-auto align-middle',
          statusDisplay.style[networkHealth.status]
        )}
      >
        <div className="flex flex-row gap-2">
          <div className="flex my-auto">{statusDisplay.icon[networkHealth.status]}</div>
          {statusDisplay.text[networkHealth.status]}
        </div>
        <SingularityIndicator />
      </div>
    </div>
  )
}

function SingularityIndicator() {
  const { isSingularity } = useSingularity()

  if (isSingularity) {
    return (
      <TooltipWrapper content="The first 1,580,851 blocks after the genesis is called Singularity, during which everyone can create a validator and stake tokens but the active validator set will only have the genesis validators. Unstake and redelegate are not supported during this time. Learn more about network Singularity in the documentation (https://docs.story.foundation/docs/tokenomics-staking#singularity)">
        <span className="flex items-center justify-center rounded-full text-[]">
          <YellowWarning />
          <div className="ml-2" />
          Network is currently in&nbsp;
          <Link
            href="https://docs.story.foundation/docs/tokenomics-staking#singularity:~:text=Singularity"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Singularity
          </Link>
          .
        </span>
      </TooltipWrapper>
    )
  }
  return null
}

function GreenCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="22" height="22" rx="11" fill="#00E4BB" />
      <path
        d="M15.7656 7.98438C16.0703 8.26562 16.0703 8.75781 15.7656 9.03906L9.76562 15.0391C9.48438 15.3438 8.99219 15.3438 8.71094 15.0391L5.71094 12.0391C5.40625 11.7578 5.40625 11.2656 5.71094 10.9844C5.99219 10.6797 6.48438 10.6797 6.76562 10.9844L9.25 13.4453L14.7109 7.98438C14.9922 7.67969 15.4844 7.67969 15.7656 7.98438Z"
        fill="#1C1C1C"
      />
    </svg>
  )
}

function YellowWarning() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="#E4CE07" />
      <path
        d="M12.5 8V14C12.5 14.4219 12.1484 14.75 11.75 14.75C11.3281 14.75 11 14.4219 11 14V8C11 7.60156 11.3281 7.25 11.75 7.25C12.1484 7.25 12.5 7.60156 12.5 8ZM11.75 17.75C11.3984 17.75 11.0938 17.5859 10.9297 17.2812C10.7656 17 10.7656 16.6484 10.9297 16.3438C11.0938 16.0625 11.3984 15.875 11.75 15.875C12.0781 15.875 12.3828 16.0625 12.5469 16.3438C12.7109 16.6484 12.7109 17 12.5469 17.2812C12.3828 17.5859 12.0781 17.75 11.75 17.75Z"
        fill="#1C1C1C"
      />
    </svg>
  )
}

function RedAlert() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.2679 2C11.0377 0.666667 12.9623 0.666667 13.7321 2L22.3923 17C23.1621 18.3333 22.1999 20 20.6603 20H3.33975C1.80015 20 0.837895 18.3333 1.6077 17L10.2679 2Z"
        fill="#EB0823"
      />
      <path
        d="M12.75 8V14C12.75 14.4219 12.3984 14.75 12 14.75C11.5781 14.75 11.25 14.4219 11.25 14V8C11.25 7.60156 11.5781 7.25 12 7.25C12.3984 7.25 12.75 7.60156 12.75 8ZM12 17.75C11.6484 17.75 11.3438 17.5859 11.1797 17.2812C11.0156 17 11.0156 16.6484 11.1797 16.3438C11.3438 16.0625 11.6484 15.875 12 15.875C12.3281 15.875 12.6328 16.0625 12.7969 16.3438C12.9609 16.6484 12.9609 17 12.7969 17.2812C12.6328 17.5859 12.3281 17.75 12 17.75Z"
        fill="#EBEBEB"
      />
    </svg>
  )
}
