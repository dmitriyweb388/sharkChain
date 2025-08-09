import { ec as EC } from "elliptic";
import { ConfigService } from "../config/service";
import sha256 from "sha256";
import {
  CommonTransaction,
  CommonTransactionData,
  CreateCommonTransactionParams,
  ProceedCommonTransactionTask,
} from "./types";
import { TasksService } from "../tasks/service";
import { NodeDataService } from "../node-data/service";
import { TasksGeneratorService } from "../tasks-generator/service";
import { LoggerService } from "../logger/service";

export class TransactionsService {
  private static ec = new EC("secp256k1");

  static async genCommonTransaction({
    toAddress,
    fishBones,
    rewardForMiner,
  }: CreateCommonTransactionParams) {
    const privateKey = ConfigService.config.privateKey;
    const keyPair = this.ec.keyFromPrivate(privateKey);

    const publicKey = keyPair.getPublic("hex");

    const sentCommonTransactions =
      await NodeDataService.getSentCommonTransactionsByPublicKey(publicKey);
    const transactionNumber = sentCommonTransactions.length;

    const transactionData = {
      fromAddress: publicKey,
      toAddress,
      fishBones,
      transactionNumber,
      rewardForMiner,
    } as CommonTransactionData;

    const signature = this.genCommonTransactionDataSignature(transactionData);

    const transaction = {
      data: transactionData,
      signature,
    } as CommonTransaction;

    return transaction;
  }

  static genCommonTransactionDataSignature(data: CommonTransactionData) {
    const privateKey = ConfigService.config.privateKey;
    const keyPair = this.ec.keyFromPrivate(privateKey);
    const dataHash = sha256(JSON.stringify(data));
    const signature = keyPair.sign(dataHash);

    return signature.toDER("hex");
  }

  static verifyCommonTransactionDataSignature(transaction: CommonTransaction) {
    try {
      const dataHash = sha256(JSON.stringify(transaction.data));
      const isValid = this.ec
        .keyFromPublic(transaction.data.fromAddress, "hex")
        .verify(dataHash, transaction.signature);

      return isValid;
    } catch (e) {
      return false;
    }
  }

  static async handleProceedCommonTransactionTask(
    task: ProceedCommonTransactionTask
  ) {
    const savedTransaction =
      await NodeDataService.getNotProceedCommonTransactionBySignature(
        task.data.signature
      );

    if (savedTransaction) {
      return;
    }

    await NodeDataService.saveNotProceedCommonTransaction(task.data, true);
    const prevFrom = task.from;
    task.from = ConfigService.config.nodeAddress;

    TasksService.broadcastTask(task, [prevFrom]);
  }

  static async handleSendTransactionCommand(
    answer: CreateCommonTransactionParams
  ) {
    const transaction = await TransactionsService.genCommonTransaction(answer);
    await NodeDataService.saveSentCommonTransaction(transaction);
    const task =
      TasksGeneratorService.genProceedCommonTransactionTask(transaction);
    await TransactionsService.handleProceedCommonTransactionTask(task);
    LoggerService.logInfo(
      `Transaction was successfully sent: ${JSON.stringify(transaction)}`
    );
  }
}
