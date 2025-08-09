import { z } from "zod";
import { AddressSchema } from "../connections/schemas";
import { EllipticHexPrivateKeySchema } from "../transactions/schemas";

export const ConfigSchema = z.object({
  port: z.number().min(0).max(65535),
  nodeAddress: AddressSchema,
  bootstrapNodes: z.array(AddressSchema),
  privateKey: EllipticHexPrivateKeySchema,
  mining: z.object({
    enableMining: z.boolean(),
  }),
});

export const PortSchema = z.number().min(0).max(65535);
