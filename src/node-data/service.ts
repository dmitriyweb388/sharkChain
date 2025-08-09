import { PrismaClient } from "../generated/prisma";
import { CommonTransaction } from "../transactions/types";

export class NodeDataService {
  private constructor() {}

  private static prisma = new PrismaClient();

  static async wasAddressSaved(address: string) {
    const foundAddress = await this.prisma.address.findFirst({
      where: { address },
    });

    return Boolean(foundAddress);
  }

  static async saveAddress(address: string) {
    const wasAddressSaved = await this.wasAddressSaved(address);

    if (!wasAddressSaved) {
      await this.prisma.address.create({ data: { address } });
    }
  }

  static async getAllSavedAddresses() {
    const addresses = await this.prisma.address.findMany();
    return addresses.map(({ address }) => address);
  }

  static async saveManyAddresses(addresses: string[]) {
    const savedAddresses = await this.getAllSavedAddresses();

    const addressesToSave: string[] = [];

    for (const address of addresses) {
      if (!savedAddresses.includes(address)) {
        addressesToSave.push(address);
      }
    }

    await this.prisma.address.createMany({
      data: addressesToSave.map((address) => ({ address })),
    });
  }

  static async saveSentCommonTransaction(transaction: CommonTransaction) {
    await this.prisma.sentCommonTransaction.create({
      data: {
        signature: transaction.signature,
        fromAddress: transaction.data.fromAddress,
        transaction,
      },
    });
  }

  static async getSentCommonTransactionsByPublicKey(publicKey: string) {
    const transactions = await this.prisma.sentCommonTransaction.findMany({
      where: { fromAddress: publicKey },
    });

    return transactions.map(
      ({ transaction }) => transaction
    ) as CommonTransaction[];
  }

  static async getNotProceedCommonTransactionBySignature(signature: string) {
    const transactionData =
      await this.prisma.notProceedCommonTransaction.findFirst({
        where: { signature },
      });

    if (!transactionData) return null;

    return transactionData.transaction as CommonTransaction;
  }

  static async saveNotProceedCommonTransaction(
    transaction: CommonTransaction,
    skipUniqueCheck?: boolean
  ) {
    const savedTransaction =
      !skipUniqueCheck &&
      (await this.getNotProceedCommonTransactionBySignature(
        transaction.signature
      ));

    if (!savedTransaction) {
      await this.prisma.notProceedCommonTransaction.create({
        data: {
          transaction,
          signature: transaction.signature,
        },
      });
    }
  }
}
