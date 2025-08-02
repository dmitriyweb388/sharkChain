import { PrismaClient } from "../generated/prisma";
import { LoggerService } from "../logger/service";
import { AddressesArraySchema, AddressSchema } from "./types";

export class NodeDataService {
  private constructor() {}

  private static prisma = new PrismaClient();

  static async wasAddressSaved(address: string) {
    if (!AddressSchema.safeParse(address).success) {
      return false;
    }

    const foundAddress = await this.prisma.address.findFirst({
      where: { address },
    });

    return Boolean(foundAddress);
  }

  static async saveAddress(address: string) {
    if (!AddressSchema.safeParse(address).success) return;

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
    if (!AddressesArraySchema.safeParse(addresses).success) return;

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
}
