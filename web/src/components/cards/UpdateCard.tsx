"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSchema, UpdateSchemaType } from "@/schemas/UpdateSchema";
import CardLayout from "./CardLayout";

interface UpdateCardProps {
  onSubmit: (updateSchema: UpdateSchemaType) => void;
}

export default function UpdateCard({ onSubmit }: UpdateCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSchemaType>({
    resolver: zodResolver(UpdateSchema),
  });

  const processSubmit = async (updateSchema: UpdateSchemaType) => {
    onSubmit(updateSchema);
  };

  return (
    <CardLayout title="회원수정">
      <form method="put" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
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
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">회원수정</button>
      </form>
    </CardLayout>
  );
}