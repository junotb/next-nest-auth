"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteSchema, DeleteSchemaType } from "@/schemas/DeleteSchema";
import CardLayout from "./CardLayout";

interface DeleteCardProps {
  onSubmit: () => void;
}

export default function DeleteCard({ onSubmit }: DeleteCardProps) {
  const {
    handleSubmit,
    formState: {},
  } = useForm<DeleteSchemaType>({
    resolver: zodResolver(DeleteSchema),
  });

  const processSubmit = async ({}: DeleteSchemaType) => {
    onSubmit();
  }

  return (
    <CardLayout title="회원 탈퇴">
      <form method="post" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">회원 탈퇴</button>
      </form>
    </CardLayout>
  );
}