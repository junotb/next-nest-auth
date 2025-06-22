import { z } from 'zod';

export const UpdateSchema = z.object({
  nickname: z.string()
    .min(1, '닉네임은 필수입니다.')
    .max(50, '닉네임은 최대 50자까지 가능합니다.'),
});

export type UpdateSchemaType = z.infer<typeof UpdateSchema>;