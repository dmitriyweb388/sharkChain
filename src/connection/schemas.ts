import { AddressSchema } from "../node-data/types";
import { z } from "zod";
import { basicParams } from "../tasks/schemas";

export const sendAddressesTaskSchema = z.object({
  ...basicParams,
});

export const loadAddressesTaskSchema = z.object({
  ...basicParams,
  data: z.object({
    addresses: z.array(AddressSchema),
  }),
});
