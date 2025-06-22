import { z } from "zod";

export const ProfileSchema = z.object({});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;