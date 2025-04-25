import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from '../ui/dialog'
import AprCalculator from '../AprCalculator'
import { Button } from '../ui/button'

const AprCalculatorDialog = () => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="outline">Calculate Rewards</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>APR Reward Calculator</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="py-2">
          <AprCalculator />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AprCalculatorDialog
