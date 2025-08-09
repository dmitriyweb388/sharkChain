import inquirer from "inquirer";
import { Commands } from "./types";
import { GenCommonTransactionPayloadSchema } from "../transactions/schemas";
import { TransactionsService } from "../transactions/service";
import { CreateCommonTransactionParams } from "../transactions/types";
import { LoggerService } from "../logger/service";

export class UserInputService {
  static async handleSendTransactionCommand() {
    const answer = await inquirer.prompt<CreateCommonTransactionParams>([
      {
        type: "input",
        name: "toAddress",
        message: "To address:",
      },
      {
        type: "number",
        name: "fishBones",
        message: "Fish bones amount:",
      },
      {
        type: "number",
        name: "rewardForMiner",
        message: "Reward for miner:",
      },
    ]);

    const validationResult =
      GenCommonTransactionPayloadSchema.safeParse(answer);

    if (!validationResult.success)
      return LoggerService.logError(
        `Provided invalid transaction data: ${validationResult.error}`
      );

    await TransactionsService.handleSendTransactionCommand(answer);
  }

  static async askUser() {
    const commandTitles = Object.values(Commands);

    const answer = await inquirer.prompt<{ command: Commands }>([
      {
        type: "list",
        name: "command",
        message: "Node interaction menu:",
        choices: commandTitles,
      },
    ]);

    switch (answer.command) {
      case Commands.SEND_TRANSACTION:
        await this.handleSendTransactionCommand();
        break;
    }

    this.askUser();
  }
}
