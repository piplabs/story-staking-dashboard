import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTotalStakeHistory } from '@/lib/services/hooks/useTotalStakeHistory'
import { formatLargeMetricsNumber } from '@/lib/utils'

export default function Charts() {
  return (
    <div>
      Charts
      <TotalStakeHistory />
    </div>
  )
}

function TotalStakeHistory() {
  const {
    data: totalStakeHistory,
    isFetching: isFetchingTotalStakeHistory,
    isError: isErrorTotalStakeHistory,
  } = useTotalStakeHistory({ interval: '30d' })
  console.log({ totalStakeHistory })
  const formatDate = (date: Date) => {
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
    return [min - padding, max + padding]
  }

  // Format Y-axis values to display in millions (M) with 3 decimal places
  const formatYAxisValue = (value: number) => {
    return `${(value / 1000000).toFixed(3)}M`
  }

  return (
    <div className="flex grow flex-col rounded-lg bg-gray-800 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Total Stake History</h2>
      {isErrorTotalStakeHistory ? (
        <div className="flex h-[200px] items-center justify-center text-red-500">Failed to load data</div>
      ) : isFetchingTotalStakeHistory ? (
        <div className="flex h-[200px] items-center justify-center text-gray-400">Loading...</div>
      ) : totalStakeHistory && totalStakeHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={totalStakeHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxisValue} stroke="#888" tick={{ fontSize: 12 }} domain={getYAxisDomain()} />
            <Tooltip
              formatter={formatTooltipValue}
              labelFormatter={(label) => formatDate(new Date(label))}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[200px] items-center justify-center text-gray-400">No data available</div>
      )}
    </div>
  )
}
