// DKG types matching story-api consensus REST responses.
// See story/client/proto/story/dkg/v1/types/types.proto.

export type DKGStageNumber = 1 | 2 | 3 | 4 | 5 | 6
export type DKGStageName = 'REGISTRATION' | 'DEALING' | 'FINALIZATION' | 'ACTIVE' | 'FAILED' | 'ENDED' | 'UNKNOWN'

export function dkgStageName(stage: number | undefined): DKGStageName {
  switch (stage) {
    case 1:
      return 'REGISTRATION'
    case 2:
      return 'DEALING'
    case 3:
      return 'FINALIZATION'
    case 4:
      return 'ACTIVE'
    case 5:
      return 'FAILED'
    case 6:
      return 'ENDED'
    default:
      return 'UNKNOWN'
  }
}

export type DKGNetwork = {
  round: number
  start_block_height: string
  start_block_hash?: string
  active_val_set: string[]
  total: number
  threshold: number
  stage: number
  is_resharing?: boolean
  is_upgrade?: boolean
  global_public_key?: string
}

export type DKGNetworkResponse = {
  code: number
  msg: { network: DKGNetwork } | null
  error: string
}

// Subset of DKGRegistration relevant to "who is in the committee".
// See story/client/proto/story/dkg/v1/types/types.proto.
export type DKGRegistration = {
  round: number
  validator_addr: string
  index: number
  status: DKGRegStatusNumber
}

export type DKGRegistrationsResponse = {
  code: number
  msg: { registrations: DKGRegistration[] | null } | null
  error: string
}

// Matches story.dkg.v1.types.DKGRegStatus.
export type DKGRegStatusNumber = 0 | 1 | 2 | 3
export type DKGRegStatusName = 'UNSPECIFIED' | 'VERIFIED' | 'FINALIZED' | 'INVALIDATED' | 'UNKNOWN'

export function dkgRegStatusName(status: number | undefined): DKGRegStatusName {
  switch (status) {
    case 0:
      return 'UNSPECIFIED'
    case 1:
      return 'VERIFIED'
    case 2:
      return 'FINALIZED'
    case 3:
      return 'INVALIDATED'
    default:
      return 'UNKNOWN'
  }
}

// VERIFIED and FINALIZED both count as active committee membership for display
// purposes; INVALIDATED and UNSPECIFIED are not.
export function isCommitteeStatus(status: number | undefined): boolean {
  return status === 1 || status === 2
}

export type DKGCommitteeMember = {
  // Lowercased EVM address — matches Validator.operator_address.
  address: string
  index: number
  status: DKGRegStatusNumber
}
