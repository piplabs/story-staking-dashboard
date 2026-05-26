import React, { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTotalStakeHistory } from '@/lib/services/hooks/useTotalStakeHistory'
import { formatLargeMetricsNumber } from '@/lib/utils'
import StyledCard from '@/components/cards/StyledCard'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Responsive hook for window width
function useWindowWidth() {
  const [width, setWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
  React.useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

export default function Charts() {
  return (
    <div className="w-full">
      <TotalStakeHistory />
    </div>
  )
}

function TotalStakeHistory() {
  // Add 'all' to the interval type
  const [interval, setInterval] = useState<'1d' | '7d' | '30d' | 'all'>('7d')
  const width = useWindowWidth()
  const {
    data: totalStakeHistory,
    isFetching: isFetchingTotalStakeHistory,
    isError: isErrorTotalStakeHistory,
  } = useTotalStakeHistory({ interval: interval === 'all' ? 'all' : interval })

  // Helper to format date for axis and tooltip. 1d-range data points fall
  // inside a single calendar day, so use an hour label there; everything
  // longer is bucketed by day.
  const formatDate = (date: Date) => {
    if (interval === '1d') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric' })
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTooltipValue = (value: number) => {
    return `${formatLargeMetricsNumber(value.toString())} IP`
  }

  // Calculate the domain for Y axis to avoid starting from zero
  const getYAxisDomain = () => {
    if (!totalStakeHistory || totalStakeHistory.length === 0) return [0, 0]

    const values = totalStakeHistory.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Set the minimum to be slightly lower than the actual minimum
    // This creates a better visual range
    const padding = (max - min) * 0.1
    // Ensure the lower bound is never negative
    const lowerBound = Math.max(0, min - padding)
    return [lowerBound, max + padding]
  }

  // Format Y-axis values to display in millions (M) with 3 decimal places
  const formatYAxisValue = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M`
  }

  // Plot against a numeric (epoch-ms) X axis. The data carries Date objects,
  // but recharts renders raw tick/axis values as React children, so passing
  // Date objects to <XAxis ticks> throws React error #310 ("Objects are not
  // valid as a React child"). Numbers are safe and let us use a proper time
  // scale.
  const chartData = useMemo(
    () => (totalStakeHistory ?? []).map((item) => ({ ts: item.date.getTime(), value: item.value })),
    [totalStakeHistory]
  )

  // Compute explicit X-axis ticks as epoch-ms numbers. The history endpoint
  // returns multiple samples per day, and recharts' built-in `interval`
  // sampling picks every Nth data point - which produces duplicate "May 20"
  // labels when several consecutive samples land on the same day. Build a
  // deduplicated list (one timestamp per rendered label) and pass it to XAxis
  // via `ticks` with `interval={0}` so recharts renders exactly these.
  const xTicks = useMemo(() => {
    if (!totalStakeHistory || totalStakeHistory.length === 0) return [] as number[]

    // Dedupe by the same string the X-axis tickFormatter would render.
    const seen = new Set<string>()
    const uniques: number[] = []
    for (const item of totalStakeHistory) {
      const label = formatDate(item.date)
      if (!seen.has(label)) {
        seen.add(label)
        uniques.push(item.date.getTime())
      }
    }

    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    let desiredTicks: number
    switch (interval) {
      case '1d':
        desiredTicks = isMobile ? 3 : isTablet ? 6 : 12
        break
      case '7d':
        desiredTicks = isMobile ? 4 : isTablet ? 7 : 8
        break
      case '30d':
        desiredTicks = isMobile ? 4 : isTablet ? 8 : 12
        break
      case 'all':
        desiredTicks = isMobile ? 4 : isTablet ? 8 : 14
        break
      default:
        desiredTicks = 6
    }

    if (uniques.length <= desiredTicks) return uniques
    const step = Math.ceil(uniques.length / desiredTicks)
    return uniques.filter((_, i) => i % step === 0)
  }, [totalStakeHistory, width, interval])

  // Guard after all hooks so hook order stays stable across the
  // loading -> loaded transition (Rules of Hooks).
  if (!totalStakeHistory) return null

  return (
    <StyledCard className="flex flex-col w-full grow">
      <section className="flex justify-between mb-4">
        <h2 className="text-lg font-medium text-primary-outline my-auto flex">Total Staked</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-150 shadow-sm">
            {/* Show user-friendly label */}
            {
              {
                '1d': '24h',
                '7d': '7d',
                '30d': '30d',
                all: 'All Time',
              }[interval]
            }
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border border-gray-700 rounded-md shadow-lg text-gray-50">
            <DropdownMenuItem
              className="hover:bg-gray-800 px-4 py-2 cursor-pointer text-gray-50"
              onSelect={() => setInterval('1d')}
            >
              24 hours
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-800 px-4 py-2 cursor-pointer text-gray-50"
              onSelect={() => setInterval('7d')}
            >
              7 days
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-800 px-4 py-2 cursor-pointer text-gray-50"
              onSelect={() => setInterval('30d')}
            >
              30 days
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-800 px-4 py-2 cursor-pointer text-gray-50"
              onSelect={() => setInterval('all')}
            >
              All Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      {isErrorTotalStakeHistory ? (
        <div className="flex h-[200px] items-center justify-center text-red-500">Failed to load data</div>
      ) : isFetchingTotalStakeHistory ? (
        <div className="flex h-[200px] items-center justify-center text-gray-400">Loading...</div>
      ) : totalStakeHistory && totalStakeHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="ts"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(ts) => formatDate(new Date(ts))}
              stroke="#888"
              tick={{ fontSize: 12, fill: '#FFFFFF' }}
              ticks={xTicks}
              interval={0}
            />
            <YAxis
              tickFormatter={formatYAxisValue}
              stroke="#888"
              tick={{ fontSize: 12, fill: '#FFFFFF' }}
              domain={getYAxisDomain()}
            />
            <Tooltip
              formatter={formatTooltipValue}
              labelFormatter={(label) => formatDate(new Date(label))}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={1}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[200px] items-center justify-center text-gray-400">No data available</div>
      )}
    </StyledCard>
  )
}
