"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpSchemaType } from "@/schemas/SignUpSchema";
import CardLayout from "./CardLayout";

interface SignUpCardProps {
  onSubmit: (signUpSchema: SignUpSchemaType) => void;
}

export default function SignUpCard({ onSubmit }: SignUpCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });

  const processSubmit = async (signUpSchema: SignUpSchemaType) => {
    onSubmit(signUpSchema);
  };

  return (
    <CardLayout title="회원가입">
      <form method="post" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">아이디</label>
          <input
            type="email"
            className={clsx("mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500", {
              "border-red-500": errors.id,
            })}
            placeholder="아이디를 입력하세요"
            aria-label="아이디"            
            {...register("id")}
          />
          {errors.id && <p className="mt-2 text-sm text-red-600">{errors.id.message}</p>}
        </div>
        <div>
          <label htmlFor="pwd" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            className={clsx("mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500", {
              "border-red-500": errors.pwd,
            })}
            placeholder="비밀번호를 입력하세요"
            aria-label="비밀번호"
            {...register("pwd")}
          />
          {errors.pwd && <p className="mt-2 text-sm text-red-600">{errors.pwd.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPwd" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            className={clsx("mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500", {
              "border-red-500": errors.confirmPwd,
            })}
            placeholder="비밀번호를 다시 입력하세요"
            aria-label="비밀번호 확인"
            {...register("confirmPwd")}
          />
          {errors.confirmPwd && <p className="mt-2 text-sm text-red-600">{errors.confirmPwd.message}</p>}
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            className={clsx("mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500", {
              "border-red-500": errors.name,
            })}
            placeholder="이름을 입력하세요"
            aria-label="이름"
            {...register("name")}
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
          <input
            type="text"
            className={clsx("mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500", {
              "border-red-500": errors.nickname,
            })}
            placeholder="닉네임을 입력하세요"
            aria-label="닉네임"
            {...register("nickname")}
          />
          {errors.nickname && <p className="mt-2 text-sm text-red-600">{errors.nickname.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">회원가입</button>
      </form>
    </CardLayout>
  );
}