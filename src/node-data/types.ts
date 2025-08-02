import { z } from "zod";

export const AddressSchema = z
  .string()
  .regex(
    /^(https?):\/\/((localhost)|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(:(\d{1,5}))?$/,
    "URL must be in the format protocol://domain.tld or protocol://localhost[:port] without a trailing slash or path."
  );

export const AddressesArraySchema = z.array(AddressSchema);
