import { z } from "zod";

export const DeleteSchema = z.object({});

export type DeleteSchemaType = z.infer<typeof DeleteSchema>;