import { AddressSchema } from "../node-data/types";
import { z } from "zod";
import { TaskType } from "./types";

export const basicParams = {
  from: AddressSchema,
  type: z.enum(TaskType),
};
