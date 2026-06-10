// Sentry beforeSend / beforeBreadcrumb scrubbing helpers.
//
// The staking dashboard transports two flavours of caller-supplied PII:
// 0x-prefixed EVM addresses (in URL paths and query strings) and free-form
// query-string values (e.g. ?delegator=, ?period=). Without scrubbing, Sentry
// captures both verbatim in events, breadcrumbs, and session replays. The
// helpers here collapse addresses to first6+last4 and strip query strings
// from any URL Sentry is about to transmit.

import type { ErrorEvent, EventHint, Breadcrumb, BreadcrumbHint } from '@sentry/nextjs'

const EVM_ADDRESS_RE = /0x[a-fA-F0-9]{40}/g

export function maskEvmAddresses(input: string): string {
  return input.replace(EVM_ADDRESS_RE, (addr) => `${addr.slice(0, 8)}...${addr.slice(38)}`)
}

function stripQuery(url: string): string {
  const queryIdx = url.indexOf('?')
  return queryIdx >= 0 ? url.slice(0, queryIdx) : url
}

function scrubString(s: unknown): unknown {
  if (typeof s !== 'string') return s
  return maskEvmAddresses(stripQuery(s))
}

export function beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  if (event.request) {
    if (event.request.url) event.request.url = scrubString(event.request.url) as string
    if (event.request.query_string) event.request.query_string = ''
    if (event.request.headers) {
      // Cookie and Authorization headers should never reach Sentry. The
      // dashboard does not use them today, but defence in depth is cheap.
      delete (event.request.headers as Record<string, string>)['Cookie']
      delete (event.request.headers as Record<string, string>)['cookie']
      delete (event.request.headers as Record<string, string>)['Authorization']
      delete (event.request.headers as Record<string, string>)['authorization']
    }
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((b) => ({
      ...b,
      message: typeof b.message === 'string' ? maskEvmAddresses(b.message) : b.message,
      data: b.data ? scrubData(b.data) : b.data,
    }))
  }
  if (event.extra) event.extra = scrubData(event.extra)
  if (event.tags) event.tags = scrubData(event.tags) as typeof event.tags
  return event
}

export function beforeBreadcrumb(
  breadcrumb: Breadcrumb,
  _hint?: BreadcrumbHint
): Breadcrumb | null {
  if (typeof breadcrumb.message === 'string') {
    breadcrumb.message = maskEvmAddresses(breadcrumb.message)
  }
  if (breadcrumb.data) breadcrumb.data = scrubData(breadcrumb.data)
  return breadcrumb
}

function scrubData<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // The 'url' / 'to' / 'from' keys frequently carry full URLs with
      // query strings; mask + strip query.
      if (key === 'url' || key === 'to' || key === 'from') {
        out[key] = scrubString(value)
      } else {
        out[key] = maskEvmAddresses(value)
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = scrubData(value as Record<string, unknown>)
    } else {
      out[key] = value
    }
  }
  return out as T
}
