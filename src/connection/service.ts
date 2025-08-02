import { ConfigService } from "../config/service";
import { TasksService } from "../tasks/service";
import { LoadAddressesTask, SendAddressesTask } from "./types";
import { TasksGeneratorService } from "../tasks-generator/service";
import { NodeDataService } from "../node-data/service";

export class ConnectionService {
  private constructor() {}

  static async handleLoadAddressesTask(task: LoadAddressesTask) {
    const addresses = task.data.addresses;
    await NodeDataService.saveManyAddresses(addresses);
  }

  static async handleSendAddressesTask(task: SendAddressesTask) {
    const addresses = await NodeDataService.getAllSavedAddresses();
    const loadAddressesTask =
      TasksGeneratorService.genLoadAddressesTask(addresses);

    TasksService.sendTaskToOtherNode(task.from, loadAddressesTask);
  }

  static async requestAddressesFromBootstrapNodes() {
    const bootstrapNodes = ConfigService.config.bootstrapNodes;

    for (const bootstrapNode of bootstrapNodes) {
      this.requestAddressesFromNode(bootstrapNode);
    }
  }

  static requestAddressesFromNode(address: string) {
    const task = TasksGeneratorService.genSendAddressTask();

    TasksService.sendTaskToOtherNode(address, task);
  }
}
