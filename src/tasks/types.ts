import { LoadAddressesTask, SendAddressesTask } from "../connections/types";
import { ProceedCommonTransactionTask } from "../transactions/types";

export enum TaskType {
  SEND_ADDRESSES = "send_addresses",
  LOAD_ADDRESSES = "load_addresses",
  PROCEED_COMMON_TRANSACTION = "proceed_common_transaction",
}

export type TaskTemplate<Type, Data> = {
  from: string;
  type: Type;
  data: Data;
};

export type Task =
  | SendAddressesTask
  | LoadAddressesTask
  | ProceedCommonTransactionTask;
