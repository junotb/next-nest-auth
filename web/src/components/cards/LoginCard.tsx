"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import CardLayout from "./CardLayout";

interface LoginCardProps {
  onSubmit: (loginSchema: LoginSchemaType) => void;
}

export default function LoginCard({ onSubmit }: LoginCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const processSubmit = async (loginSchema: LoginSchemaType) => {
    onSubmit(loginSchema);
  };
  
  return (
    <CardLayout title="로그인">
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">로그인</button>
      </form>
    </CardLayout>
  );
}