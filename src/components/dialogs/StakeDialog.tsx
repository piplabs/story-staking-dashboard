'use client'

import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Validator } from '@/lib/types'

import ConnectWalletButton from '../buttons/ConnectWalletButton'
import { LockedTokenStakeForm } from '../forms/LockedTokenStakeForm'
import { StakeForm } from '../forms/StakeForm'
import StyledCard from '../cards/StyledCard'

export function StakeDialog(props: { text?: string; validator?: Validator; isFlexible?: boolean }) {
  const { isConnected, chainId } = useAccount()

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        {isConnected && chainId?.toString() == process.env.NEXT_PUBLIC_CHAIN_ID ? (
          <Button className="" variant="primary">
            {props.text || 'Stake'}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </DialogTrigger>

      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="sm:max-w-[825px] p-0">
        <StyledCard>
          <StakeForm validator={props.validator} />
        </StyledCard>
      </DialogContent>
    </Dialog>
  )
}
