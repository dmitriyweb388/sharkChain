import z from "zod";
import { AddressSchema } from "../connections/schemas";
import { TaskType } from "../tasks/types";

export const EllipticHexSignatureSchema = z
  .string()
  .regex(/^30[0-9a-fA-F]{2,142}$/, {
    message: "Invalid ECDSA DER signature",
  });

export const EllipticHexPrivateKeySchema = z
  .string()
  .regex(/^[a-fA-F0-9]{64}$/, {
    message: "Invalid ECС private key",
  });

export const EllipticHexPublicKeySchema = z
  .string()
  .regex(/^04[a-fA-F0-9]{128}$/, {
    message: "Invalid ECС public key",
  });

export const GenCommonTransactionPayloadSchema = z.object({
  toAddress: EllipticHexPublicKeySchema,
  fishBones: z.number(),
  rewardForMiner: z.number(),
});

export const CommonTransactionSchema = z.object({
  signature: EllipticHexSignatureSchema,
  data: z.object({
    transactionNumber: z.number(),
    fromAddress: EllipticHexPublicKeySchema,
    toAddress: EllipticHexPublicKeySchema,
    fishBones: z.number(),
  }),
});

export const ProceedCommonTransactionTaskSchema = z.object({
  from: AddressSchema,
  type: z.enum(TaskType),
  data: CommonTransactionSchema,
});
