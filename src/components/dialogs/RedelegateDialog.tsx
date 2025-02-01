'use client'

import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSingularity } from '@/lib/services/hooks/useSingularity'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { RedelegateForm } from '../forms/RedelegateForm'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

export function RedelegateDialog(props: {
  validator: Validator
  delegationId?: string
  delegatedAmount?: string
}) {
  const { isConnected } = useAccount()
  const singularity = useSingularity()
  const isSingularity = singularity.error != true && singularity.isSingularity

  let disabledText
  if (isSingularity) {
    disabledText = 'Redelegating is unavailable during network singularity'
  } else {
    disabledText = 'You have not staked on this validator'
  }

  if (isSingularity) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button className="" variant="disabled" disabled>
              Redelegate
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
            Redelegate
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="border border-solid border-stakingModalOutline bg-[#202020] sm:max-w-[825px] sm:rounded-[32px]"
      >
        <RedelegateForm
          validator={props.validator}
          delegationId={props.delegationId}
          delegatedAmount={props.delegatedAmount}
        />
      </DialogContent>
    </Dialog>
  )
}
