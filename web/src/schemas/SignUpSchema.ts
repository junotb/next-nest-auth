import { z } from "zod";

export const SignUpSchema = z.object({
  id: z.string()
    .nonempty("이메일 주소를 입력하세요.")
    .email("유효한 이메일 주소를 입력하세요."),
  name: z.string()
    .nonempty("이름을 입력하세요.")
    .min(2, "이름은 2자 이상이어야 합니다.")
    .max(10, "이름은 10자 이하이어야 합니다.")
    .regex(/^[a-zA-Z가-힣]+$/, "이름은 한글, 영문자만 사용할 수 있습니다."),
  nickname: z.string()
    .nonempty("닉네임을 입력하세요.")
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(10, "닉네임은 10자 이하이어야 합니다.")
    .regex(/^[a-zA-Z0-9가-힣]+$/, "닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다."),
  pwd: z.string()
    .nonempty("비밀번호를 입력하세요.")
    .refine((pwd) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+|<>?:{}]).{8,}$/.test(pwd), {
      message: "비밀번호는 8자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.",
    }),
  confirmPwd: z.string()
    .nonempty("비밀번호 확인을 입력하세요."),
}).refine((data) => data.pwd === data.confirmPwd, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPwd"],
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;