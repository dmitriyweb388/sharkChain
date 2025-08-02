import { LoadAddressesTask, SendAddressesTask } from "../connection/types";

export enum TaskType {
  SEND_ADDRESSES = "send_addresses",
  LOAD_ADDRESSES = "load_addresses",
}

export type TaskTemplate<Type, Data> = {
  from: string;
  type: Type;
  data: Data;
};

export type Task = SendAddressesTask | LoadAddressesTask;
