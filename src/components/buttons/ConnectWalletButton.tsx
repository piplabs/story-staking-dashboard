'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'

import { Button } from '../ui/button'

export default function ConnectWalletButton() {
  const isSmallDevice = useIsSmallDevice()
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="text-white"
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="outline" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button variant="primary" onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  {!isSmallDevice && (
                    <Button
                      variant="outline"
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                      className="hidden md:inline"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>
                  )}
                  <Button variant="outline" onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance && !isSmallDevice ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
