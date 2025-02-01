'use client'

import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { LockedTokenStakeForm } from '../forms/LockedTokenStakeForm'
import { StakeForm } from '../forms/StakeForm'

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
        className="border border-solid border-stakingModalOutline bg-[#202020] sm:max-w-[425px] sm:rounded-[32px]"
      >
        {props.validator.support_token_type === undefined ||
        props.validator.support_token_type == 0 ? (
          <LockedTokenStakeForm validator={props.validator} />
        ) : (
          <StakeForm validator={props.validator} isFlexible={props.isFlexible} />
        )}
      </DialogContent>
    </Dialog>
  )
}
