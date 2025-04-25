'use client'

import Metrics from './_components/Metrics'
import ValidatorHeader from './_components/ValidatorHeader'
import { ValidatorsTable } from './_components/ValidatorsTable'
import { useState } from 'react'
// import Charts from './_components/Charts'
// import AprCharts from './_components/AprCharts'
import AprCalculator from '../components/AprCalculator'
import Charts from './_components/Charts'
export default function Page() {
  const [showLockedTokens, setShowLockedTokens] = useState(false)
  const tokenType = showLockedTokens ? 'ALL' : 'UNLOCKED'

  return (
    <main className="flex w-full flex-col gap-8 text-white">
      <ValidatorHeader />
      <Metrics tokenType={tokenType} />
      <Charts />

      <ValidatorsTable
        tokenType={tokenType}
        showLockedTokens={showLockedTokens}
        setShowLockedTokens={setShowLockedTokens}
      />
    </main>
  )
}
