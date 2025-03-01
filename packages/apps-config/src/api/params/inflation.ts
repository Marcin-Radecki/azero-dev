// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { BN, BN_MILLION } from '@polkadot/util';

import { ALEPHZERO_MAINNET_GENESIS, ALEPHZERO_TESTNET_GENESIS, CERE_NETWORK_GENESIS, CERE_NETWORK_TESTNET_GENESIS, DOCK_POS_TESTNET_GENESIS, KUSAMA_GENESIS, NEATCOIN_GENESIS, NFTMART_GENESIS, POLKADOT_GENESIS } from '../constants.js';

export interface InflationParams {
  auctionAdjust: number;
  auctionMax: number;
  falloff: number;
  maxInflation: number;
  minInflation: number;
  stakeTarget: number;
}

interface UniformEraPayoutInflationParams extends InflationParams {
  yearlyInflationInTokens: BN;
}

const DEFAULT_PARAMS: InflationParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  // 5% for falloff, as per the defaults, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L534
  falloff: 0.05,
  // 10% max, 0.25% min, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L523
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5
};

const DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS: UniformEraPayoutInflationParams = {
  ...DEFAULT_PARAMS,
  yearlyInflationInTokens: BN_MILLION.mul(new BN(30))
};

const CERE_NETWORK_INFLATION_PARAMS = { ...DEFAULT_PARAMS, maxInflation: 0.05, minInflation: 0.0001, stakeTarget: 0.2 };

const KNOWN_PARAMS: Record<string, InflationParams> = {
  [ALEPHZERO_MAINNET_GENESIS]: DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS,
  [ALEPHZERO_TESTNET_GENESIS]: DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS,
  [CERE_NETWORK_GENESIS]: CERE_NETWORK_INFLATION_PARAMS,
  [CERE_NETWORK_TESTNET_GENESIS]: CERE_NETWORK_INFLATION_PARAMS,
  [DOCK_POS_TESTNET_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  // 30% for up to 60 slots, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L526-L527
  // 75% ideal target, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L529-L531
  [KUSAMA_GENESIS]: { ...DEFAULT_PARAMS, auctionAdjust: (0.3 / 60), auctionMax: 60, stakeTarget: 0.75 },
  [NEATCOIN_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [NFTMART_GENESIS]: { ...DEFAULT_PARAMS, falloff: 0.04, stakeTarget: 0.60 },
  [POLKADOT_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 }
};

export function getInflationParams (api: ApiPromise): InflationParams | UniformEraPayoutInflationParams {
  // below behaviour is different between our fork and upstream, that by default we are operating
  // in uniform era payout model, rather than Polkadot-js's RewardCurve model
  return KNOWN_PARAMS[api.genesisHash.toHex()] || DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS;
}
