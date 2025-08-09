import { z } from "zod";
import { TaskType } from "../tasks/types";

export const AddressSchema = z
  .string()
  .regex(
    /^(https?):\/\/((localhost)|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(:(\d{1,5}))?$/,
    "URL must be in the format protocol://domain.tld or protocol://localhost[:port] without a trailing slash or path."
  );

export const AddressesArraySchema = z.array(AddressSchema);

export const SendAddressesTaskSchema = z.object({
  from: AddressSchema,
  type: z.enum(TaskType),
});

export const LoadAddressesTaskSchema = z.object({
  from: AddressSchema,
  type: z.enum(TaskType),
  data: z.object({
    addresses: z.array(AddressSchema),
  }),
});
