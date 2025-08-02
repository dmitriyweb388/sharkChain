import { TaskTemplate, TaskType } from "../tasks/types";

export type LoadAddressesTaskData = {
  addresses: string[];
};

export type SendAddressesTaskData = void;

export type LoadAddressesTask = TaskTemplate<
  TaskType.LOAD_ADDRESSES,
  LoadAddressesTaskData
>;

export type SendAddressesTask = TaskTemplate<
  TaskType.SEND_ADDRESSES,
  SendAddressesTaskData
>;
