import { z } from "zod";

export const RefreshSchema = z.object({});

export type RefreshSchemaType = z.infer<typeof RefreshSchema>;