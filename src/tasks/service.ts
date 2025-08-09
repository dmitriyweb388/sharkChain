import axios from "axios";
import { ConnectionsService } from "../connections/service";
import { QueueService } from "../queue/service";
import { Task, TaskType } from "./types";
import { LoggerService } from "../logger/service";
import { NodeDataService } from "../node-data/service";
import { ConfigService } from "../config/service";
import { TransactionsService } from "../transactions/service";
import {
  LoadAddressesTaskSchema,
  SendAddressesTaskSchema,
} from "../connections/schemas";
import { ProceedCommonTransactionTaskSchema } from "../transactions/schemas";

export class TasksService {
  private constructor() {}

  static isTaskValid(task: Task) {
    try {
      switch (task.type) {
        case TaskType.SEND_ADDRESSES:
          SendAddressesTaskSchema.parse(task);
          break;
        case TaskType.LOAD_ADDRESSES:
          LoadAddressesTaskSchema.parse(task);
          break;
        case TaskType.PROCEED_COMMON_TRANSACTION:
          ProceedCommonTransactionTaskSchema.parse(task);
          break;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  static async handleTask(task: Task) {
    if (!this.isTaskValid(task)) {
      return LoggerService.logWarning("Received task that has invalid format");
    }

    const wasAddressSaved = NodeDataService.wasAddressSaved(task.from);

    if (!wasAddressSaved) {
      ConnectionsService.requestAddressesFromNode(task.from);
    }

    await NodeDataService.saveAddress(task.from);

    switch (task.type) {
      case TaskType.LOAD_ADDRESSES:
        return QueueService.push(
          async () => await ConnectionsService.handleLoadAddressesTask(task)
        );
      case TaskType.SEND_ADDRESSES:
        return QueueService.push(
          async () => await ConnectionsService.handleSendAddressesTask(task)
        );
      case TaskType.PROCEED_COMMON_TRANSACTION:
        return QueueService.push(
          async () =>
            await TransactionsService.handleProceedCommonTransactionTask(task)
        );
    }
  }

  static sendTaskToOtherNode(address: string, task: Task) {
    QueueService.push(async () => await axios.post(address, task));
  }

  static async broadcastTask(task: Task, exclude?: string[]) {
    const addresses = await NodeDataService.getAllSavedAddresses();

    const excludedAddresses = exclude || [];
    excludedAddresses.push(ConfigService.config.nodeAddress);

    for (const address of addresses) {
      const isExcludedAddress = excludedAddresses.includes(address);

      if (!isExcludedAddress) {
        this.sendTaskToOtherNode(address, task);
      }
    }
  }
}
