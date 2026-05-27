// Block-explorer URL helpers — the single source of truth for explorer links.
//
// Kept in its own module (not lib/env) on purpose: lib/env runs
// envVariables.parse(process.env) as a top-level side effect, so importing
// anything from it would force that validation to run wherever these helpers
// are used (including at build/prerender time). These helpers only need the
// chain id and the optional explorer URL, and tolerate the latter's absence,
// so they read process.env directly and stay free of that side effect.

// Explorer URLs for known chains, used when NEXT_PUBLIC_EXPLORER_URL is not set
// (e.g. a build that only pins the chain id). Mirrors the known networks in
// WagmiProviderWrapper, which consumes EXPLORER_URL from here so the explorer
// link has a single definition shared by every component.
const KNOWN_EXPLORERS: Record<string, string> = {
  '1315': 'https://aeneid.storyscan.xyz', // Story Aeneid
  '1514': 'https://storyscan.xyz', // Story Mainnet
}

// EXPLORER_URL resolves the active explorer base, preferring an explicit
// NEXT_PUBLIC_EXPLORER_URL and falling back to the known-chain default. Empty
// string when neither is available (custom/devnet without an explorer), so
// callers can short-circuit instead of building a broken link.
export const EXPLORER_URL = (
  process.env.NEXT_PUBLIC_EXPLORER_URL ||
  KNOWN_EXPLORERS[process.env.NEXT_PUBLIC_CHAIN_ID ?? ''] ||
  ''
).replace(/\/+$/, '')

// txExplorerUrl returns the canonical "view this transaction on the explorer"
// URL. If EXPLORER_URL is unset it returns an empty string so callers can
// short-circuit instead of rendering a relative path that would 404 against
// the dashboard's own host.
export function txExplorerUrl(txHash: string | undefined): string {
  if (!EXPLORER_URL || !txHash) return ''
  return `${EXPLORER_URL}/tx/${txHash}`
}
