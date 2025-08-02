import axios from "axios";
import { ConnectionService } from "../connection/service";
import { QueueService } from "../queue/service";
import { Task, TaskType } from "./types";
import {
  loadAddressesTaskSchema,
  sendAddressesTaskSchema,
} from "../connection/schemas";
import { LoggerService } from "../logger/service";
import { NodeDataService } from "../node-data/service";

export class TasksService {
  private constructor() {}

  static isTaskValid(task: Task) {
    try {
      switch (task.type) {
        case TaskType.SEND_ADDRESSES:
          sendAddressesTaskSchema.parse(task);
          break;
        case TaskType.LOAD_ADDRESSES:
          loadAddressesTaskSchema.parse(task);
          break;
      }

      return true;
    } catch {
      return false;
    }
  }

  static async handleTask(task: Task) {
    if (!this.isTaskValid(task)) {
      return LoggerService.logWarning("Received task that has invalid format");
    }

    const wasAddressSaved = NodeDataService.wasAddressSaved(task.from);

    if (!wasAddressSaved) {
      ConnectionService.requestAddressesFromNode(task.from);
    }

    await NodeDataService.saveAddress(task.from);

    switch (task.type) {
      case TaskType.LOAD_ADDRESSES:
        return QueueService.push(
          async () => await ConnectionService.handleLoadAddressesTask(task)
        );
      case TaskType.SEND_ADDRESSES:
        return QueueService.push(
          async () => await ConnectionService.handleSendAddressesTask(task)
        );
    }
  }

  static sendTaskToOtherNode(address: string, task: Task) {
    QueueService.push(async () => await axios.post(address, task));
  }
}
