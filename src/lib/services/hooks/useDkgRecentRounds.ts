'use client'

import { useQueries } from '@tanstack/react-query'

import { getDKGNetworkByRound } from '../api/dkgApi'
import { DKGNetwork } from '@/lib/types/dkgTypes'

export type RoundOutcome = 'success' | 'failed' | 'in_progress' | 'unknown'

export type RecentRound = {
  round: number
  outcome: RoundOutcome
  network: DKGNetwork | null
}

// Stage enum (proto):
//   1 REGISTRATION  2 DEALING  3 FINALIZATION  4 ACTIVE  5 FAILED  6 ENDED
function classify(stage: number | undefined): RoundOutcome {
  if (stage === 4 || stage === 6) return 'success'
  if (stage === 5) return 'failed'
  if (stage === 1 || stage === 2 || stage === 3) return 'in_progress'
  return 'unknown'
}

// Fetch the last `count` DKG rounds anchored at `latestRound`. Returns the
// round-level outcome (success / failed / in_progress) for each — the same
// signal for every committee member, useful for spotting a streak of failed
// rounds at a glance.
export function useDkgRecentRounds(
  latestRound: number | undefined,
  count = 10
): { isLoading: boolean; rounds: RecentRound[] } {
  const enabled = !!latestRound
  const lower = enabled ? Math.max(1, (latestRound as number) - count + 1) : 0
  const upper = enabled ? (latestRound as number) : 0
  const roundNumbers: number[] = []
  for (let r = lower; r <= upper; r++) roundNumbers.push(r)

  const queries = useQueries({
    queries: roundNumbers.map((r) => ({
      queryKey: ['dkg', 'network', r],
      queryFn: () => getDKGNetworkByRound(r),
      enabled,
      staleTime: 5 * 60_000,
    })),
  })

  const isLoading = enabled && queries.some((q) => q.isLoading)

  const rounds: RecentRound[] = roundNumbers.map((round, i) => {
    const network = queries[i]?.data ?? null
    return { round, outcome: classify(network?.stage), network }
  })

  return { isLoading, rounds }
}
