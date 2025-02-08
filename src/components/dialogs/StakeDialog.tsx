'use client'

import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { LockedTokenStakeForm } from '../forms/LockedTokenStakeForm'
import { StakeForm } from '../forms/StakeForm'
import StyledCard from '../cards/StyledCard'

export function StakeDialog(props: { validator: Validator; isFlexible?: boolean }) {
  const { isConnected } = useAccount()
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        {isConnected ? (
          <Button className="" variant="primary">
            Stake
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm:max-w-[825px] p-0"
      >
        <StyledCard>
          {props.validator.support_token_type === undefined ||
          props.validator.support_token_type == 0 ? (
            <LockedTokenStakeForm validator={props.validator} />
          ) : (
            <StakeForm validator={props.validator} isFlexible={props.isFlexible} />
          )}
        </StyledCard>
      </DialogContent>
    </Dialog>
  )
}
