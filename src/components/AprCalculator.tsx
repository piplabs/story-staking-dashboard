'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator, Clock, Calendar, TrendingUp } from 'lucide-react'
import StyledCard from '@/components/cards/StyledCard'
import { useNetworkStakingParams } from '@/lib/services/hooks/useNetworkStakingParams'
import useApr from '@/lib/services/hooks/useApr'
import type { GetNetworkStakingParamsResponse } from '@/lib/types/networkApiTypes'

type Period = GetNetworkStakingParamsResponse['params']['periods'][number]

interface LockupOption {
  id: string
  name: string
  days: number
  multiplier: number
  apr: number
}

const getPeriodTypeLabel = (periodType: number) => {
  switch (periodType) {
    case 0:
      return 'Flexible'
    case 1:
      return 'Short-term'
    case 2:
      return 'Medium-term'
    case 3:
      return 'Long-term'
    default:
      return `Type ${periodType}`
  }
}

function StakeSlider({
  min,
  max,
  value,
  step,
  onChange,
  disabled,
}: {
  min: number
  max: number
  value: number
  step?: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
        disabled={disabled}
        style={{ accentColor: '#3b82f6' }}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function AprCalculator() {
  const { data: stakingParams, isLoading, isError } = useNetworkStakingParams()
  const { data: aprData, isLoading: isAprLoading, isError: isAprError } = useApr()
  const baseAPR = aprData ? Number(aprData) : 7.98
  const [stakeAmount, setStakeAmount] = useState(30000)
  const [activeTab, setActiveTab] = useState('daily')

  const lockupOptions: LockupOption[] = useMemo(() => {
    if (!stakingParams?.params?.periods) return []
    return stakingParams.params.periods.map((period: Period) => {
      const id = `period-${period.period_type}`
      const name = getPeriodTypeLabel(period.period_type)
      const durationSeconds = Number(period.duration) / 1e9
      const days = Math.round(durationSeconds / 86400)
      const multiplier = Number(period.rewards_multiplier)
      return {
        id,
        name,
        days,
        multiplier,
        apr: baseAPR * multiplier,
      }
    })
  }, [stakingParams, baseAPR])

  const [selectedLockupId, setSelectedLockupId] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (lockupOptions.length > 0) setSelectedLockupId(lockupOptions[0].id)
  }, [lockupOptions])
  const selectedLockup = lockupOptions.find((option) => option.id === selectedLockupId)

  const rewards = useMemo(() => {
    if (!selectedLockup) return { daily: 0, monthly: 0, yearly: 0, total: 0 }
    const apr = selectedLockup.apr / 100
    const dailyRate = apr / 365
    const dailyReward = stakeAmount * dailyRate
    const monthlyReward = dailyReward * 30
    const yearlyReward = dailyReward * 365
    const totalReward = selectedLockup.days > 0 ? dailyReward * selectedLockup.days : yearlyReward
    return {
      daily: dailyReward,
      monthly: monthlyReward,
      yearly: yearlyReward,
      total: totalReward,
    }
  }, [stakeAmount, selectedLockup])

  const handleLockupChange = (value: string) => {
    setSelectedLockupId(value)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const SLIDER_MIN = 100
  const SLIDER_MAX = 1_000_000
  const SLIDER_STEP = 100

  if (isLoading)
    return (
      <StyledCard className="flex flex-col w-full">
        <div className="p-8 text-center text-gray-400">Loading staking parameters...</div>
      </StyledCard>
    )
  if (isError || !stakingParams)
    return (
      <StyledCard className="flex flex-col w-full">
        <div className="p-8 text-center text-red-500">Failed to load staking parameters</div>
      </StyledCard>
    )
  if (!selectedLockup)
    return (
      <StyledCard className="flex flex-col w-full">
        <div className="p-8 text-center text-gray-400">No lockup options available</div>
      </StyledCard>
    )
  return (
    <StyledCard className="flex flex-col">
      <section className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-400" />
          <h2 className="text-lg font-medium text-primary-outline my-auto flex">APR Reward Calculator</h2>
        </div>
        <div className="text-gray-300 text-base">
          Estimate your potential rewards based on staking amount and lock-up period
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex-1 min-w-0">
            <Label htmlFor="stake-amount" className="text-lg font-semibold mb-2 block text-primary-outline">
              1. Enter Stake Amount
            </Label>
            <div className="flex flex-row items-center gap-4">
              <div
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-md px-3"
                style={{ height: '48px' }}
              >
                <Input
                  id="stake-amount"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => {
                    let stakeValue = Number(e.target.value)
                    if (isNaN(stakeValue)) stakeValue = 0
                    setStakeAmount(stakeValue)
                  }}
                  className="w-32 bg-transparent border-none text-white text-xl focus:ring-0 focus:outline-none text-center h-full"
                  placeholder="Amount"
                  inputMode="decimal"
                  min={0}
                  style={{ height: '100%' }}
                />
                <span className="text-gray-400 text-base font-medium">IP</span>
              </div>
              <div className="flex-1 min-w-0">
                <StakeSlider
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={SLIDER_STEP}
                  value={stakeAmount < SLIDER_MIN ? SLIDER_MIN : stakeAmount > SLIDER_MAX ? SLIDER_MAX : stakeAmount}
                  onChange={(v) => setStakeAmount(v)}
                  disabled={false}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Label className="text-lg font-semibold mb-2 block text-primary-outline">
              2. Choose Staking Lock-up Period
            </Label>
            <RadioGroup value={selectedLockupId} onValueChange={handleLockupChange} className="grid grid-cols-2 gap-2">
              {lockupOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedLockupId === option.id
                      ? 'border-blue-500 bg-blue-900/30 shadow-md'
                      : 'border-gray-700 bg-gray-800/60 hover:bg-gray-800'
                  }`}
                  onClick={() => handleLockupChange(option.id)}
                  style={{ height: '48px' }}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <Label htmlFor={option.id} className="flex flex-1 cursor-pointer items-center w-full">
                    <div className="flex items-center w-full">
                      <div className="flex items-center gap-2 flex-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-white">
                          {option.name}{' '}
                          <span className="text-gray-400 font-normal">
                            {option.name === 'Flexible' ? '(Unlock anytime)' : `(${option.days} days)`}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-semibold text-primary-outline text-white">{option.apr.toFixed(2)}%</span>
                        <span className="text-xs text-gray-400">({option.multiplier}x)</span>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Estimated Rewards</h3>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-lg">
            <TabsList className="grid grid-cols-3 bg-gray-800 text-gray-300 rounded-lg">
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white"
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="pt-4">
              <RewardCard title="Daily Rewards" amount={rewards.daily} apr={selectedLockup.apr} period="day" />
            </TabsContent>
            <TabsContent value="monthly" className="pt-4">
              <RewardCard title="Monthly Rewards" amount={rewards.monthly} apr={selectedLockup.apr} period="month" />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <RewardCard title="Yearly Rewards" amount={rewards.yearly} apr={selectedLockup.apr} period="year" />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </StyledCard>
  )
}

interface RewardCardProps {
  title: string
  amount: number
  apr: number
  period: string
  icon?: React.ReactNode
}

function RewardCard({ title, amount, apr, period, icon }: RewardCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="text-sm text-gray-300">{apr.toFixed(2)}% APR</div>
      </div>
      <div className="text-3xl font-bold text-white">{formatCurrency(amount)} IP</div>
      <div className="text-sm text-gray-300 mt-1">Estimated reward per {period}</div>
    </div>
  )
}
