import { stakingDataAxios } from '@/lib/services/api'
import {
  DKGCommitteeMember,
  DKGNetwork,
  DKGNetworkResponse,
  DKGRegistrationsResponse,
  isCommitteeStatus,
} from '@/lib/types/dkgTypes'

// DKG data is served by staking-api under /api/dkg/* with the same
// {code, msg, error} envelope as the rest of staking-api, so reuse the
// existing axios instance.

export async function getLatestActiveDKGNetwork(): Promise<DKGNetwork | null> {
  const response = await stakingDataAxios.get<DKGNetworkResponse>('/dkg/latest_active')
  if (response.data.code !== 200 || !response.data.msg?.network) return null
  return response.data.msg.network
}

export async function getDKGNetworkByRound(round: number): Promise<DKGNetwork | null> {
  const response = await stakingDataAxios.get<DKGNetworkResponse>(`/dkg/network/${round}`)
  if (response.data.code !== 200 || !response.data.msg?.network) return null
  return response.data.msg.network
}

// Fetch DKG committee membership for a given round's registrations.
//
// Filters out INVALIDATED so the consumer can distinguish VERIFIED vs
// FINALIZED in the UI. Addresses are lowercased to match
// Validator.operator_address.
export async function getDKGCommitteeMembers(round: number): Promise<DKGCommitteeMember[]> {
  const response = await stakingDataAxios.get<DKGRegistrationsResponse>(`/dkg/registrations/${round}`)
  const regs = response.data?.msg?.registrations ?? []
  return regs
    .filter((reg) => isCommitteeStatus(reg.status))
    .map((reg) => ({
      address: (reg.validator_addr || '').toLowerCase(),
      index: reg.index,
      status: reg.status,
    }))
}
