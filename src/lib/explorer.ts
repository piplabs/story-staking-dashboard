// Block-explorer URL helpers.
//
// Kept in its own module (not lib/env) on purpose: lib/env runs
// envVariables.parse(process.env) as a top-level side effect, so importing
// anything from it would force that validation to run wherever these helpers
// are used (including at build/prerender time). These helpers only need the
// single NEXT_PUBLIC_EXPLORER_URL value and tolerate its absence, so they read
// it directly and stay free of that side effect.

// EXPLORER_URL is the single source of truth for building block-explorer
// links. Components must never read process.env.NEXT_PUBLIC_EXPLORER_URL
// directly: future env-var loading changes (e.g. devnet fallbacks based on
// NEXT_PUBLIC_CHAIN_ID) only need to update this helper, not every consumer.
export const EXPLORER_URL = (process.env.NEXT_PUBLIC_EXPLORER_URL ?? '').replace(/\/+$/, '')

// txExplorerUrl returns the canonical "view this transaction on the
// explorer" URL. If EXPLORER_URL is unset it returns an empty string so
// callers can short-circuit instead of rendering a relative path that
// would 404 against the dashboard's own host.
export function txExplorerUrl(txHash: string | undefined): string {
  if (!EXPLORER_URL || !txHash) return ''
  return `${EXPLORER_URL}/tx/${txHash}`
}
