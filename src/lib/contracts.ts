import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPTokenStake
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const ipTokenStakeAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'defaultMinFee', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDataLength', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AA',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BB',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_MIN_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_DATA_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_MONIKER_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PP',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKE_ROUNDING',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'moniker', internalType: 'string', type: 'string' },
      { name: 'commissionRate', internalType: 'uint32', type: 'uint32' },
      { name: 'maxCommissionRate', internalType: 'uint32', type: 'uint32' },
      { name: 'maxCommissionChangeRate', internalType: 'uint32', type: 'uint32' },
      { name: 'supportsUnlocked', internalType: 'bool', type: 'bool' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createValidator',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'args',
        internalType: 'struct IIPTokenStaking.InitializerArgs',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'minStakeAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'minUnstakeAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'minCommissionRate', internalType: 'uint256', type: 'uint256' },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minCommissionRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minStakeAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minUnstakeAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorSrcCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'validatorDstCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'redelegate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address' },
      { name: 'validatorSrcCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'validatorDstCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'redelegateOnBehalf',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'rawAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'roundedStakeAmount',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainder', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'newFee', internalType: 'uint256', type: 'uint256' }],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinCommissionRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newMinStakeAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinStakeAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newMinUnstakeAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinUnstakeAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newRewardsAddress', internalType: 'address', type: 'address' }],
    name: 'setRewardsAddress',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newWithdrawalAddress', internalType: 'address', type: 'address' }],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'stakingPeriod', internalType: 'enum IIPTokenStaking.StakingPeriod', type: 'uint8' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'stake',
    outputs: [{ name: 'delegationId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address' },
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'stakingPeriod', internalType: 'enum IIPTokenStaking.StakingPeriod', type: 'uint8' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'stakeOnBehalf',
    outputs: [{ name: 'delegationId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'unjail',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'unjailOnBehalf',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'function', inputs: [], name: 'unsetOperator', outputs: [], stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address' },
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'unstakeOnBehalf',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'commissionRate', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'updateValidatorCommission',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'moniker', internalType: 'string', type: 'string', indexed: false },
      { name: 'stakeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'commissionRate', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'maxCommissionRate', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'maxCommissionChangeRate', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'supportsUnlocked', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'operatorAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'CreateValidator',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'stakeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'stakingPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'operatorAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newFee', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'FeeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'minCommissionRate', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MinCommissionRateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'minStakeAmount', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'MinStakeAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'minUnstakeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MinUnstakeAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'validatorSrcCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'validatorDstCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'operatorAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Redelegate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'operator', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'SetOperator',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'executionAddress', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'SetRewardAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'executionAddress', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'SetWithdrawalAddress',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'unjailer', internalType: 'address', type: 'address', indexed: false },
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Unjail',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address', indexed: false }],
    name: 'UnsetOperator',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'commissionRate', internalType: 'uint32', type: 'uint32', indexed: false },
    ],
    name: 'UpdateValidatorCommission',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'delegator', internalType: 'address', type: 'address', indexed: false },
      { name: 'validatorCmpPubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'stakeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'delegationId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'operatorAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Withdraw',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

/**
 *
 */
export const ipTokenStakeAddress = {
  1315: '0xCCcCcC0000000000000000000000000000000001',
} as const

/**
 *
 */
export const ipTokenStakeConfig = { address: ipTokenStakeAddress, abi: ipTokenStakeAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__
 *
 *
 */
export const useReadIpTokenStake = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"AA"`
 *
 *
 */
export const useReadIpTokenStakeAa = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'AA',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"BB"`
 *
 *
 */
export const useReadIpTokenStakeBb = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'BB',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"DEFAULT_MIN_FEE"`
 *
 *
 */
export const useReadIpTokenStakeDefaultMinFee = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'DEFAULT_MIN_FEE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"MAX_DATA_LENGTH"`
 *
 *
 */
export const useReadIpTokenStakeMaxDataLength = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'MAX_DATA_LENGTH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"MAX_MONIKER_LENGTH"`
 *
 *
 */
export const useReadIpTokenStakeMaxMonikerLength = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'MAX_MONIKER_LENGTH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"PP"`
 *
 *
 */
export const useReadIpTokenStakePp = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'PP',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"STAKE_ROUNDING"`
 *
 *
 */
export const useReadIpTokenStakeStakeRounding = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'STAKE_ROUNDING',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"fee"`
 *
 *
 */
export const useReadIpTokenStakeFee = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'fee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"minCommissionRate"`
 *
 *
 */
export const useReadIpTokenStakeMinCommissionRate = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'minCommissionRate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"minStakeAmount"`
 *
 *
 */
export const useReadIpTokenStakeMinStakeAmount = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'minStakeAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"minUnstakeAmount"`
 *
 *
 */
export const useReadIpTokenStakeMinUnstakeAmount = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'minUnstakeAmount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadIpTokenStakeOwner = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"pendingOwner"`
 *
 *
 */
export const useReadIpTokenStakePendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"roundedStakeAmount"`
 *
 *
 */
export const useReadIpTokenStakeRoundedStakeAmount = /*#__PURE__*/ createUseReadContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'roundedStakeAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__
 *
 *
 */
export const useWriteIpTokenStake = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 *
 */
export const useWriteIpTokenStakeAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"createValidator"`
 *
 *
 */
export const useWriteIpTokenStakeCreateValidator = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'createValidator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useWriteIpTokenStakeInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"redelegate"`
 *
 *
 */
export const useWriteIpTokenStakeRedelegate = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'redelegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"redelegateOnBehalf"`
 *
 *
 */
export const useWriteIpTokenStakeRedelegateOnBehalf = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'redelegateOnBehalf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWriteIpTokenStakeRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setFee"`
 *
 *
 */
export const useWriteIpTokenStakeSetFee = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinCommissionRate"`
 *
 *
 */
export const useWriteIpTokenStakeSetMinCommissionRate = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinCommissionRate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinStakeAmount"`
 *
 *
 */
export const useWriteIpTokenStakeSetMinStakeAmount = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinStakeAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinUnstakeAmount"`
 *
 *
 */
export const useWriteIpTokenStakeSetMinUnstakeAmount = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinUnstakeAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setOperator"`
 *
 *
 */
export const useWriteIpTokenStakeSetOperator = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setOperator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setRewardsAddress"`
 *
 *
 */
export const useWriteIpTokenStakeSetRewardsAddress = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setRewardsAddress',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setWithdrawalAddress"`
 *
 *
 */
export const useWriteIpTokenStakeSetWithdrawalAddress = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setWithdrawalAddress',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"stake"`
 *
 *
 */
export const useWriteIpTokenStakeStake = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"stakeOnBehalf"`
 *
 *
 */
export const useWriteIpTokenStakeStakeOnBehalf = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'stakeOnBehalf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWriteIpTokenStakeTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unjail"`
 *
 *
 */
export const useWriteIpTokenStakeUnjail = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unjail',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unjailOnBehalf"`
 *
 *
 */
export const useWriteIpTokenStakeUnjailOnBehalf = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unjailOnBehalf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unsetOperator"`
 *
 *
 */
export const useWriteIpTokenStakeUnsetOperator = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unsetOperator',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unstake"`
 *
 *
 */
export const useWriteIpTokenStakeUnstake = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unstakeOnBehalf"`
 *
 *
 */
export const useWriteIpTokenStakeUnstakeOnBehalf = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unstakeOnBehalf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"updateValidatorCommission"`
 *
 *
 */
export const useWriteIpTokenStakeUpdateValidatorCommission = /*#__PURE__*/ createUseWriteContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'updateValidatorCommission',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__
 *
 *
 */
export const useSimulateIpTokenStake = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 *
 */
export const useSimulateIpTokenStakeAcceptOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"createValidator"`
 *
 *
 */
export const useSimulateIpTokenStakeCreateValidator = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'createValidator',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useSimulateIpTokenStakeInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"redelegate"`
 *
 *
 */
export const useSimulateIpTokenStakeRedelegate = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'redelegate',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"redelegateOnBehalf"`
 *
 *
 */
export const useSimulateIpTokenStakeRedelegateOnBehalf = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'redelegateOnBehalf',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulateIpTokenStakeRenounceOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setFee"`
 *
 *
 */
export const useSimulateIpTokenStakeSetFee = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setFee',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinCommissionRate"`
 *
 *
 */
export const useSimulateIpTokenStakeSetMinCommissionRate = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinCommissionRate',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinStakeAmount"`
 *
 *
 */
export const useSimulateIpTokenStakeSetMinStakeAmount = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinStakeAmount',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setMinUnstakeAmount"`
 *
 *
 */
export const useSimulateIpTokenStakeSetMinUnstakeAmount = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setMinUnstakeAmount',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setOperator"`
 *
 *
 */
export const useSimulateIpTokenStakeSetOperator = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setOperator',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setRewardsAddress"`
 *
 *
 */
export const useSimulateIpTokenStakeSetRewardsAddress = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setRewardsAddress',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"setWithdrawalAddress"`
 *
 *
 */
export const useSimulateIpTokenStakeSetWithdrawalAddress = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'setWithdrawalAddress',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"stake"`
 *
 *
 */
export const useSimulateIpTokenStakeStake = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"stakeOnBehalf"`
 *
 *
 */
export const useSimulateIpTokenStakeStakeOnBehalf = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'stakeOnBehalf',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulateIpTokenStakeTransferOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unjail"`
 *
 *
 */
export const useSimulateIpTokenStakeUnjail = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unjail',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unjailOnBehalf"`
 *
 *
 */
export const useSimulateIpTokenStakeUnjailOnBehalf = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unjailOnBehalf',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unsetOperator"`
 *
 *
 */
export const useSimulateIpTokenStakeUnsetOperator = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unsetOperator',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unstake"`
 *
 *
 */
export const useSimulateIpTokenStakeUnstake = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"unstakeOnBehalf"`
 *
 *
 */
export const useSimulateIpTokenStakeUnstakeOnBehalf = /*#__PURE__*/ createUseSimulateContract({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  functionName: 'unstakeOnBehalf',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `functionName` set to `"updateValidatorCommission"`
 *
 *
 */
export const useSimulateIpTokenStakeUpdateValidatorCommission =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    functionName: 'updateValidatorCommission',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__
 *
 *
 */
export const useWatchIpTokenStakeEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"CreateValidator"`
 *
 *
 */
export const useWatchIpTokenStakeCreateValidatorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'CreateValidator',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"Deposit"`
 *
 *
 */
export const useWatchIpTokenStakeDepositEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'Deposit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"FeeSet"`
 *
 *
 */
export const useWatchIpTokenStakeFeeSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'FeeSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"Initialized"`
 *
 *
 */
export const useWatchIpTokenStakeInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'Initialized',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"MinCommissionRateChanged"`
 *
 *
 */
export const useWatchIpTokenStakeMinCommissionRateChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'MinCommissionRateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"MinStakeAmountSet"`
 *
 *
 */
export const useWatchIpTokenStakeMinStakeAmountSetEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: ipTokenStakeAbi, address: ipTokenStakeAddress, eventName: 'MinStakeAmountSet' }
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"MinUnstakeAmountSet"`
 *
 *
 */
export const useWatchIpTokenStakeMinUnstakeAmountSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'MinUnstakeAmountSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 *
 */
export const useWatchIpTokenStakeOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchIpTokenStakeOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"Redelegate"`
 *
 *
 */
export const useWatchIpTokenStakeRedelegateEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'Redelegate',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"SetOperator"`
 *
 *
 */
export const useWatchIpTokenStakeSetOperatorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'SetOperator',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"SetRewardAddress"`
 *
 *
 */
export const useWatchIpTokenStakeSetRewardAddressEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'SetRewardAddress',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"SetWithdrawalAddress"`
 *
 *
 */
export const useWatchIpTokenStakeSetWithdrawalAddressEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'SetWithdrawalAddress',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"Unjail"`
 *
 *
 */
export const useWatchIpTokenStakeUnjailEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'Unjail',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"UnsetOperator"`
 *
 *
 */
export const useWatchIpTokenStakeUnsetOperatorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'UnsetOperator',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"UpdateValidatorCommission"`
 *
 *
 */
export const useWatchIpTokenStakeUpdateValidatorCommissionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ipTokenStakeAbi,
    address: ipTokenStakeAddress,
    eventName: 'UpdateValidatorCommission',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ipTokenStakeAbi}__ and `eventName` set to `"Withdraw"`
 *
 *
 */
export const useWatchIpTokenStakeWithdrawEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ipTokenStakeAbi,
  address: ipTokenStakeAddress,
  eventName: 'Withdraw',
})
