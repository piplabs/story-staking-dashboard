'use client'

import { base64ToHex, truncateAddress } from '@/lib/utils'

// pubkeyFingerprint collapses the validator's consensus pubkey to a short
// "0xAABBCC..DDEEFF" form so a user can compare it against an out-of-band
// reference (e.g. the validator's record on an explorer or its public docs)
// before signing the wallet transaction.
//
// Why this matters: the staking-api returns validator metadata that the form
// then converts into stake/redelegate calldata. If the API or its data store
// is compromised, the consensus_pubkey can be silently swapped for an
// attacker-controlled validator and the wallet confirmation only shows raw
// bytes, which most users will not read. Surfacing operator address and
// pubkey fingerprint side-by-side in the form gives an attentive user a
// last chance to notice the substitution without changing the trust model.
export function pubkeyFingerprint(consensusPubkeyB64: string): string {
  if (!consensusPubkeyB64) return ''
  const hex = base64ToHex(consensusPubkeyB64)
  if (hex.length < 12) return `0x${hex}`
  return `0x${hex.slice(0, 6)}..${hex.slice(-6)}`
}

export function ValidatorConfirmCard(props: {
  label: string
  moniker?: string
  operatorAddress: string
  consensusPubkeyB64: string
}) {
  return (
    <section className="flex flex-col gap-1 rounded-lg border border-primary-border bg-black/30 px-3 py-2 text-sm">
      <p className="font-semibold text-white">{props.label}</p>
      {props.moniker && <p className="text-white">{props.moniker}</p>}
      <p className="text-primary-outline">
        <span className="text-white/60">Operator:</span>{' '}
        <span className="font-mono">{truncateAddress(props.operatorAddress, 10, 8)}</span>
      </p>
      <p className="text-primary-outline">
        <span className="text-white/60">Pubkey:</span>{' '}
        <span className="font-mono">{pubkeyFingerprint(props.consensusPubkeyB64)}</span>
      </p>
      <p className="mt-1 text-xs text-white/40">
        Verify the operator address and pubkey fingerprint against the validator&apos;s public profile before
        confirming in your wallet.
      </p>
    </section>
  )
}
