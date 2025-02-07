import useNetworkHealth from './useNetworkHealth'

export function useSingularity() {
  const { data: networkHealth } = useNetworkHealth()

  const blockHeight = networkHealth?.consensus_block_height
  if (!blockHeight) {
    return {
      error: true,
      isSingularity: undefined,
      singularityBlockHeight: process.env.NEXT_PUBLIC_SINGULARITY_BLOCK_HEIGHT,
      currentBlockHeight: blockHeight,
    }
  }
  return {
    error: false,
    isSingularity: blockHeight > process.env.NEXT_PUBLIC_SINGULARITY_BLOCK_HEIGHT ? false : true,
    singularityBlockHeight: process.env.NEXT_PUBLIC_SINGULARITY_BLOCK_HEIGHT,
    currentBlockHeight: blockHeight,
  }
}
