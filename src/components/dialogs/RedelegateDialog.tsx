'use client'

import { useAccount } from 'wagmi'

import { Button, disabledButtonVariant } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSingularity } from '@/lib/services/hooks/useSingularity'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { RedelegateForm } from '../forms/RedelegateForm'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import StyledCard from '../cards/StyledCard'

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
          <TooltipTrigger className={disabledButtonVariant}>Redelegate</TooltipTrigger>
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
        className="sm:max-w-[825px] p-0"
      >
        <StyledCard className="border-none border-0">
          <RedelegateForm
            validator={props.validator}
            delegationId={props.delegationId}
            delegatedAmount={props.delegatedAmount}
          />
        </StyledCard>
      </DialogContent>
    </Dialog>
  )
}
