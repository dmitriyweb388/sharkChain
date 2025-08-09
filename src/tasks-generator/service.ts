import { ConfigService } from "../config/service";
import { LoadAddressesTask, SendAddressesTask } from "../connections/types";
import { TaskType } from "../tasks/types";
import {
  CommonTransaction,
  ProceedCommonTransactionTask,
} from "../transactions/types";

export class TasksGeneratorService {
  private constructor() {}

  static genSendAddressTask() {
    const task = {
      from: ConfigService.config.nodeAddress,
      type: TaskType.SEND_ADDRESSES,
    } as SendAddressesTask;

    return task;
  }

  static genLoadAddressesTask(addresses: string[]) {
    const task = {
      from: ConfigService.config.nodeAddress,
      type: TaskType.LOAD_ADDRESSES,
      data: {
        addresses,
      },
    } as LoadAddressesTask;

    return task;
  }

  static genProceedCommonTransactionTask(transaction: CommonTransaction) {
    const task = {
      from: ConfigService.config.nodeAddress,
      type: TaskType.PROCEED_COMMON_TRANSACTION,
      data: transaction,
    } as ProceedCommonTransactionTask;

    return task;
  }
}
