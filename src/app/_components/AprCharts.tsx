'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import StyledCard from '@/components/cards/StyledCard'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

export default function AprCharts() {
  const baseAPR = 7.98

  // Calculate APRs with multipliers
  const shortTermAPR = +(baseAPR * 1.2).toFixed(2)
  const mediumTermAPR = +(baseAPR * 1.5).toFixed(2)
  const longTermAPR = +(baseAPR * 2.0).toFixed(2)

  const data = [
    {
      period: 'No Lock',
      apr: baseAPR,
      multiplier: '1.0x',
      days: '0 days',
      fill: '#6B7280', // gray-500
    },
    {
      period: 'Short-term',
      apr: shortTermAPR,
      multiplier: '1.2x',
      days: '30 days',
      fill: '#60A5FA', // blue-400
    },
    {
      period: 'Medium-term',
      apr: mediumTermAPR,
      multiplier: '1.5x',
      days: '90 days',
      fill: '#34D399', // green-400
    },
    {
      period: 'Long-term',
      apr: longTermAPR,
      multiplier: '2.0x',
      days: '180 days',
      fill: '#10B981', // green-500
    },
  ]

  return (
    <StyledCard className="flex flex-col grow w-full z-10">
      <section className="flex flex-col gap-2 mb-4">
        <h2 className="text-lg font-medium text-primary-outline my-auto flex">APR by Lock-up Period</h2>
        <div className="text-gray-300 text-base">Compare APR rewards based on different lock-up periods</div>
      </section>
      <section>
        <div className="h-80 mt-4">
          <ChartContainer
            config={{
              apr: {
                label: 'APR (%)',
                color: 'white',
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  stroke="#D1D5DB"
                  tick={{ fill: '#D1D5DB' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                  tickFormatter={(value) => value}
                  height={60}
                  label={{
                    value: 'Lock-up Period',
                    position: 'insideBottom',
                    offset: -10,
                    fill: '#D1D5DB',
                  }}
                />
                <YAxis
                  stroke="#D1D5DB"
                  tick={{ fill: '#D1D5DB' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                  label={{
                    value: 'APR (%)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#D1D5DB',
                  }}
                />
                <ChartTooltip cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} content={<CustomTooltip />} />
                <Bar dataKey="apr" radius={[4, 4, 0, 0]} fill="var(--color-apr)" barSize={60} fillOpacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 rounded-lg"
              style={{ backgroundColor: `${item.fill}20` }}
            >
              <div className="text-2xl font-bold text-white">{item.apr}%</div>
              <div className="text-sm text-gray-300">
                {item.multiplier} • {item.days}
              </div>
            </div>
          ))}
        </div>
      </section>
    </StyledCard>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="font-bold text-lg">{data.period}</p>
        <p className="text-gray-300 text-sm">
          {data.days} • {data.multiplier}
        </p>
        <p className="text-xl font-bold mt-1" style={{ color: data.fill }}>
          {data.apr}% APR
        </p>
      </div>
    )
  }

  return null
}
