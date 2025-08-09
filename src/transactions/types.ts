import { TaskTemplate, TaskType } from "../tasks/types";

export enum TransactionTypes {
  COMMON = "common",
  MINER_REWARD = "miner_reward",
}

export type CreateCommonTransactionParams = {
  toAddress: string;
  fishBones: number;
  rewardForMiner: number;
};

export type CommonTransactionData = {
  fromAddress: string;
  transactionNumber: number;
} & CreateCommonTransactionParams;

export type CommonTransaction = {
  type: TransactionTypes.COMMON;
  data: CommonTransactionData;
  signature: string;
};

export const MiningRewardFishBones = 1_000;

export type MinerRewardTransactionData = {
  sharkChainReward: number;
  userFeesReward: number;
};

export type MinerRewardTransaction = {
  type: TransactionTypes.MINER_REWARD;
  data: MinerRewardTransactionData;
};

export type ProceedCommonTransactionTask = TaskTemplate<
  TaskType.PROCEED_COMMON_TRANSACTION,
  CommonTransaction
>;

export type Transaction = CommonTransaction | MinerRewardTransaction;
