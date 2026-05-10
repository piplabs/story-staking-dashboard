'use client'

import { useQuery } from '@tanstack/react-query'

import { getDKGCommitteeMembers } from '../api/dkgApi'
import { useDkgLatestActive } from './useDkgLatestActive'
import { DKGCommitteeMember } from '@/lib/types/dkgTypes'

// Committee for the latest ACTIVE round. Resolves the round number from
// useDkgLatestActive first and only fires the registrations query once it's
// known. Round transitions happen on a multi-day cadence so a 5-minute
// staleTime is plenty.
export function useDkgCommittee() {
  const { data: latest } = useDkgLatestActive()
  const round = latest?.round
  return useQuery<DKGCommitteeMember[], Error>({
    queryKey: ['dkg', 'committee', round],
    queryFn: () => getDKGCommitteeMembers(round!),
    enabled: round !== undefined,
    staleTime: 5 * 60_000,
  })
}
