import { PrismaClient } from "../generated/prisma";
import { LoggerService } from "../logger/service";
import { AddressSchema } from "./types";

export class NodeDataService {
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
    if (!AddressSchema.safeParse(address).success) {
      LoggerService.logWarning("Received and ignored invalid address");

      return;
    }

    const wasAddressSaved = await this.wasAddressSaved(address);

    if (!wasAddressSaved) {
      await this.prisma.address.create({ data: { address } });
    }
  }
}
