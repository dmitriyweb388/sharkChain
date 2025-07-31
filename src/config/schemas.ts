import { z } from "zod";
import { AddressSchema } from "../node-data/types";

export const ConfigSchema = z.object({
  port: z.number().min(0).max(65535),
  nodeAddress: AddressSchema,
  bootstrapNodes: z.array(AddressSchema),
});

export const PortSchema = z.number().min(0).max(65535);
