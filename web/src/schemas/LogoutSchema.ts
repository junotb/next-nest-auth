import { z } from "zod";

export const LogoutSchema = z.object({});

export type LogoutSchemaType = z.infer<typeof LogoutSchema>;