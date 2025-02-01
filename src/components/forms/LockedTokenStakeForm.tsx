'use client'

import { Validator } from '@/lib/types'

export function LockedTokenStakeForm(props: { validator: Validator | undefined }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white">Stake IP</h2>
      {
        <section className="flex flex-col">
          <p className="text-white">
            This validator only supports locked token staking. If you have{' '}
            <a
              href="https://docs.story.foundation/docs/tokenomics-staking#locked-vs-unlocked-tokens"
              className="italic underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              locked tokens
            </a>{' '}
            and want to stake them, please contact the Story team.
            <br />
            <br />
            To learn more about the token staking mechanics, please visit the{' '}
            <a
              href="https://docs.story.foundation/docs/tokenomics-staking"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation
            </a>
          </p>
        </section>
      }
    </>
  )
}
