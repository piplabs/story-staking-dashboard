'use client'

import { Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const StoryConnectWalletButton = dynamic(() => import('../buttons/ConnectWalletButton'), {
  ssr: false,
})

export default function Header() {
  const { address } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="flex flex-row justify-between gap-4 md:gap-0">
      <section className="my-auto flex flex-row gap-4 text-white">
        <Link href="/">
          <Image
            src="https://images.ctfassets.net/5ei3wx54t1dp/ztxkTXcUvvV46bmpYOBbL/94cdcddb1cc65479a3d59798c254b74a/Story_Black.svg"
            alt="Story"
            width={128}
            height={64}
            className="invert filter"
          />
        </Link>
        <div className="hidden md:flex md:flex-row md:gap-4">
          <Link href="/" className="my-auto">
            Validators
          </Link>
          {address && (
            <>
              <Link href={`/delegations/${address}`} className="my-auto">
                My Delegations
              </Link>
              <Link href={`/transactions/${address}`} className="my-auto">
                My Transactions
              </Link>
            </>
          )}
        </div>
      </section>
      <section className="flex flex-row gap-4">
        <StoryConnectWalletButton />
        <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DropdownMenuTrigger className="my-auto block md:hidden" asChild>
            <button>
              {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full rounded-xl border-white/20 bg-black p-4 text-white md:hidden">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </DropdownMenuItem>
            {address && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/delegations/${address}`} onClick={() => setMobileMenuOpen(false)}>
                    My Delegations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/transactions/${address}`} onClick={() => setMobileMenuOpen(false)}>
                    My Transactions
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  )
}
