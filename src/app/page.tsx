import dynamic from 'next/dynamic'

import Metrics from './_components/Metrics'
import { ValidatorsTable } from './_components/ValidatorsTable'

const ValidatorHeader = dynamic(() => import('./_components/ValidatorHeader'), {
  ssr: false,
})

// export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  return (
    <main className="flex w-full flex-col gap-8 text-white">
      <ValidatorHeader />
      <Metrics />
      <ValidatorsTable />
    </main>
  )
}
