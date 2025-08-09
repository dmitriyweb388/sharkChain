import express from "express";
import "dotenv/config";
import { ConfigService } from "./config/service";
import { LoggerService } from "./logger/service";
import { NodeDataService } from "./node-data/service";
import { TasksController } from "./tasks/controller";
import { ConnectionsService } from "./connections/service";
import { UserInputService } from "./user-input/server";
import { TasksGeneratorService } from "./tasks-generator/service";

const main = async () => {
  try {
    const app = express();

    await ConfigService.importAndValidateConfig();
    await NodeDataService.saveAddress(ConfigService.config.nodeAddress);
    await ConnectionsService.requestAddressesFromBootstrapNodes();

    app.use(express.json());
    app.post("/", TasksController.handleTask);

    app.listen(ConfigService.config.port, () => {
      LoggerService.logInfo(
        `Node is running on port ${ConfigService.config.port}`
      );

      UserInputService.askUser();
    });
  } catch {
    LoggerService.logError("Node was stopped with unknown error", true);
  }
};

main();
