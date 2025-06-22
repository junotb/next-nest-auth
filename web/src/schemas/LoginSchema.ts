import { z } from "zod";

export const LoginSchema = z.object({
  id: z.string()
    .nonempty("이메일 주소를 입력하세요.")
    .email("유효한 이메일 주소를 입력하세요."),
  pwd: z.string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .refine((password) => /[0-9]/.test(password), {
      message: "비밀번호는 숫자를 포함해야 합니다.",
    })
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: "비밀번호는 영문자를 포함해야 합니다.",
    })
    .refine((password) => /[~!@#$%^&*()_+|<>?:{}]/.test(password), {
      message: "비밀번호는 특수문자를 포함해야 합니다.",
    }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;