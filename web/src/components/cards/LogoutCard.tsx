"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoutSchema, LogoutSchemaType } from "@/schemas/LogoutSchema";
import CardLayout from "./CardLayout";

interface LogoutCardProps {
  onSubmit: () => void;
}

export default function LogoutCard({ onSubmit }: LogoutCardProps) {
  const {
    handleSubmit,
    formState: {},
  } = useForm<LogoutSchemaType>({
    resolver: zodResolver(LogoutSchema),
  });

  const processSubmit = async ({}: LogoutSchemaType) => {
    onSubmit();
  }

  return (
    <CardLayout title="로그아웃">
      <form method="post" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">로그아웃</button>
      </form>
    </CardLayout>
  );
}