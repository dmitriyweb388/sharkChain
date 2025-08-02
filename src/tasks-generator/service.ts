import { ConfigService } from "../config/service";
import { LoadAddressesTask, SendAddressesTask } from "../connection/types";
import { TaskType } from "../tasks/types";

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
}
