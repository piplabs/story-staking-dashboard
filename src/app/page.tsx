'use client'

import Metrics from './_components/Metrics'
import ValidatorHeader from './_components/ValidatorHeader'
import { ValidatorsTable } from './_components/ValidatorsTable'
import { useState } from 'react'

export default function Page() {
  const [showLockedTokens, setShowLockedTokens] = useState(false)
  const tokenType = showLockedTokens ? 'ALL' : 'UNLOCKED'

  return (
    <main className="flex w-full flex-col gap-8 text-white">
      <ValidatorHeader />
      <Metrics tokenType={tokenType} />
      <ValidatorsTable
        tokenType={tokenType}
        showLockedTokens={showLockedTokens}
        setShowLockedTokens={setShowLockedTokens}
      />
    </main>
  )
}
