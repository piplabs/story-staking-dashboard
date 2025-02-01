'use client'

import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSingularity } from '@/lib/services/hooks/useSingularity'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { UnstakeDelegationIdForm } from '../forms/UnstakeDelegationIdForm'
import { UnstakeForm } from '../forms/UnstakeForm'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

export type UnstakeDialogProps = {
  validator: Validator
  isUnstakeDisabled: boolean
  delegationId?: string
  isMatured?: boolean
}

export function UnstakeDialog({
  validator,
  isUnstakeDisabled,
  delegationId,
  isMatured,
}: UnstakeDialogProps) {
  const { isConnected } = useAccount()
  const singularity = useSingularity()
  const isSingularity = singularity.error != true && singularity.isSingularity

  let disabledText
  if (isSingularity) {
    disabledText = 'Unstaking is unavailable during network singularity'
  } else if (isMatured === false) {
    disabledText = 'Delegation has not matured yet'
  } else {
    disabledText = 'You have not staked on this validator'
  }

  if (isUnstakeDisabled || isSingularity) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button className="" variant="disabled" disabled>
              Unstake
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border-none bg-black p-2">
            <p>{disabledText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        {isConnected ? (
          <Button className="" variant="primary">
            Unstake
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="border border-solid border-stakingModalOutline bg-[#202020] sm:max-w-[825px] sm:rounded-[32px]"
      >
        {delegationId ? (
          <UnstakeDelegationIdForm validator={validator} delegationId={delegationId} />
        ) : (
          <UnstakeForm validator={validator} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function TemporaryDisable() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {' '}
          <Button className="" variant="disabled" disabled>
            Unstake
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-none">
          <p>
            Currently unavailable. Please unstake <br />
            directly from the contract or CLI in the meantime.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
