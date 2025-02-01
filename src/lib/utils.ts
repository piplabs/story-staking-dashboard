import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string | undefined, startLength = 6, endLength = 4) {
  if (!address) return ''
  if (address.length < startLength + endLength + 3) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function formatLargeMetricsNumber(
  value: number | string,
  options: { useSuffix?: boolean } = {}
): string {
  const num = Number(value)

  if (isNaN(num)) {
    return 'Invalid number'
  }

  const absValue = Math.abs(num)
  const { useSuffix = false } = options
  let formattedValue: string

  if (useSuffix) {
    if (absValue >= 1e12) {
      formattedValue = (num / 1e12).toFixed(2)
      return parseFloat(formattedValue) + 'T'
    } else if (absValue >= 1e9) {
      formattedValue = (num / 1e9).toFixed(2)
      return parseFloat(formattedValue) + 'B'
    } else if (absValue >= 1e6) {
      formattedValue = (num / 1e6).toFixed(2)
      return parseFloat(formattedValue) + 'M'
    } else if (absValue >= 1e3) {
      formattedValue = (num / 1e3).toFixed(2)
      return parseFloat(formattedValue) + 'K'
    } else {
      formattedValue = num.toFixed(2)
      return parseFloat(formattedValue).toString()
    }
  } else {
    // Format with commas for long form
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
}

export function formatPercentage(value: string | undefined): string | undefined {
  if (!value) return undefined

  let numberValue = parseFloat(value.replace('%', ''))
  let formattedValue = numberValue.toFixed(2)
  formattedValue = parseFloat(formattedValue).toString()

  return formattedValue + '%'
}

// Utility function to convert snake_case / kebab-case to camelCase
export function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace(/[-_]/, ''))
}

export function convertKeysToCamelCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase)

  return Object.keys(obj).reduce(
    (acc, key) => {
      const camelKey = toCamelCase(key)
      acc[camelKey] = convertKeysToCamelCase(obj[key])
      return acc
    },
    {} as Record<string, any>
  )
}
