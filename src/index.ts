import express from "express";
import "dotenv/config";
import { ConfigService } from "./config/service";
import { LoggerService } from "./logger/service";
import { NodeDataService } from "./node-data/service";
import { TasksController } from "./tasks/controller";
import { ConnectionService } from "./connection/service";

const app = express();

const main = async () => {
  try {
    await ConfigService.importAndValidateConfig();
    await NodeDataService.saveAddress(ConfigService.config.nodeAddress);
    await ConnectionService.requestAddressesFromBootstrapNodes();

    app.use(express.json());
    app.post("/", TasksController.handleTask);

    app.listen(ConfigService.config.port, () => {
      LoggerService.logInfo(
        `Node is running on port ${ConfigService.config.port}`
      );
    });
  } catch {
    LoggerService.logError("Node was stopped with unknown error", true);
  }
};

main();
