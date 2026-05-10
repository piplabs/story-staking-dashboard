'use client'

import { InfoCircledIcon } from '@radix-ui/react-icons'
import { ExternalLink } from 'lucide-react'
import { useMemo } from 'react'
import { Address } from 'viem'

import StyledCard from '@/components/cards/StyledCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { dkgDashboardUrl } from '@/lib/constants'
import { useDkgCommittee } from '@/lib/services/hooks/useDkgCommittee'
import { useDkgLatestActive } from '@/lib/services/hooks/useDkgLatestActive'
import { RecentRound, useDkgRecentRounds } from '@/lib/services/hooks/useDkgRecentRounds'
import { dkgRegStatusName, dkgStageName } from '@/lib/types/dkgTypes'
import { cn } from '@/lib/utils'

import { DataRow } from './ValidatorDataCards'

const RECENT_ROUNDS = 10

// Inline header badge — small chip rendered next to ACTIVE/BONDED in the
// validator detail header. Returns null for non-committee validators.
//
// Tinted by registration status:
//   FINALIZED -> cyan  (fully participating)
//   VERIFIED  -> amber (registered + dealing-verified, not yet finalized)
export function DKGCommitteeBadge({ validatorAddr }: { validatorAddr: Address }) {
  const { data: committee } = useDkgCommittee()
  const target = validatorAddr.toLowerCase()
  const member = useMemo(() => committee?.find((m) => m.address === target), [committee, target])
  if (!member) return null
  const isFinalized = member.status === 2
  const tone = isFinalized
    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
    : 'border-amber-400/40 bg-amber-400/10 text-amber-300'
  const dot = isFinalized ? 'bg-cyan-400' : 'bg-amber-400'
  return (
    <span
      className={cn(
        'my-auto inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs uppercase tracking-wider font-robotoMono border',
        tone
      )}
    >
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', dot)} />
      DKG Committee
    </span>
  )
}

// Body card. Renders only when this validator is in the current DKG committee.
// Styled identically to the other validator data cards (StyledCard) so it sits
// flush in the page grid.
export default function DKGCommitteeCard({ validatorAddr }: { validatorAddr: Address }) {
  const { data: committee } = useDkgCommittee()
  const { data: latest } = useDkgLatestActive()

  const target = validatorAddr.toLowerCase()
  const member = useMemo(() => committee?.find((m) => m.address === target), [committee, target])

  const { rounds } = useDkgRecentRounds(latest?.round, RECENT_ROUNDS)

  if (!member) return null

  const round = latest?.round
  const stage = latest ? dkgStageName(latest.stage) : 'UNKNOWN'
  const committeeSize = committee?.length ?? 0
  const successCount = rounds.filter((r) => r.outcome === 'success').length

  // Avoid duplicating "ACTIVE" when latest stage is ACTIVE — drop the leading
  // "Active ·" prefix and just show round + stage.
  const statusValue = round !== undefined ? `Round #${round} · ${stage}` : stage
  const dashboardHref = dkgDashboardUrl()

  return (
    <StyledCard className="w-full">
      <div className="flex flex-row items-center justify-between">
        <h1>DKG Committee</h1>
        {dashboardHref && (
          <a
            href={dashboardHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs text-primary-outline transition-colors hover:text-white"
          >
            View full DKG dashboard
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Status"
          value={statusValue}
          tooltipInfo="The latest active DKG round number and its current stage"
        />
        <MemberStatusRow status={member.status} />
        <DataRow
          title="Member index"
          value={`#${member.index}`}
          tooltipInfo="This validator's index within the DKG committee"
        />
        <DataRow
          title="Committee size"
          value={committeeSize > 0 ? `${committeeSize} member${committeeSize === 1 ? '' : 's'}` : '–'}
          tooltipInfo="Number of validators in the active DKG committee"
        />

        {rounds.length > 0 && (
          <div className="mt-1 flex flex-row items-center justify-between gap-4 text-sm lg:text-base">
            <span>Recent rounds</span>
            <div className="flex flex-1 flex-row items-center justify-end gap-1.5">
              {rounds.map((r) => (
                <RoundDot key={r.round} round={r} />
              ))}
            </div>
            <span className="my-auto whitespace-nowrap tabular-nums text-primary-outline">
              {successCount} / {rounds.length} succeeded
            </span>
          </div>
        )}
      </section>
    </StyledCard>
  )
}

// Inline row mirroring DataRow's layout but able to render a coloured value.
// DataRow's `value` is typed as `string | number` so we can't pass a span
// through it.
function MemberStatusRow({ status }: { status: number }) {
  const name = dkgRegStatusName(status)
  const isFinalized = status === 2
  // Mirror how ValidatorStatus / JailedStatus colorise text in the page header:
  // green = fully active, yellow = an intermediate / "watch" state.
  const color = isFinalized ? 'text-green-500' : 'text-yellow-500'
  const tooltip =
    status === 2
      ? 'Validator finalized DKG for the active round — fully participating committee member'
      : status === 1
        ? 'Validator passed registration and dealing verification but has not finalized yet'
        : 'Registration status'
  return (
    <div className="flex flex-row justify-between text-sm lg:text-base">
      <div className="flex items-center">
        <span>Member status</span>
        <span className="my-auto ml-2 flex">
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon />
              </TooltipTrigger>
              <TooltipContent className="max-w-64 border-gray-700 bg-gray-900 text-xs leading-4 tracking-[0.48px] text-gray-50">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
      <div className="my-auto flex flex-row justify-end">
        <p className={cn('ml-2 mr-2', color)}>{name}</p>
      </div>
    </div>
  )
}

function RoundDot({ round }: { round: RecentRound }) {
  const stageLabel = round.network ? dkgStageName(round.network.stage) : '?'
  let cls: string
  let outcomeLabel: string
  switch (round.outcome) {
    case 'success':
      cls = 'bg-white border-white'
      outcomeLabel = 'success'
      break
    case 'failed':
      cls = 'bg-transparent border-red-400/70'
      outcomeLabel = 'failed'
      break
    case 'in_progress':
      cls = 'bg-white/30 border-white/60 animate-pulse'
      outcomeLabel = 'in progress'
      break
    default:
      cls = 'bg-transparent border-primary-outline/40'
      outcomeLabel = 'unknown'
  }
  const tip = `Round #${round.round} · ${stageLabel} · ${outcomeLabel}`
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn('inline-block h-2.5 w-2.5 rounded-full border', cls)}
            aria-label={tip}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-64 border-gray-700 bg-gray-900 text-xs leading-4 tracking-[0.48px] text-gray-50">
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
