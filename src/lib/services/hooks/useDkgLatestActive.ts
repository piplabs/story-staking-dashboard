'use client'

import { useQuery } from '@tanstack/react-query'

import { getLatestActiveDKGNetwork } from '../api/dkgApi'
import { DKGNetwork } from '@/lib/types/dkgTypes'

// Latest ACTIVE DKG network (current committee). Refetches every 30s — committee
// changes only on round transitions (days), so this is plenty fresh.
export function useDkgLatestActive() {
  return useQuery<DKGNetwork | null, Error>({
    queryKey: ['dkg', 'latestActive'],
    queryFn: getLatestActiveDKGNetwork,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
