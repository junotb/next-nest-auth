"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshSchema, RefreshSchemaType } from "@/schemas/RefreshSchema";
import CardLayout from "./CardLayout";

interface RefreshCardProps {
  onSubmit: () => void;
}

export default function RefreshCard({ onSubmit }: RefreshCardProps) {
  const {
    handleSubmit,
    formState: {},
  } = useForm<RefreshSchemaType>({
    resolver: zodResolver(RefreshSchema),
  });

  const processSubmit = async ({}: RefreshSchemaType) => {
    onSubmit();
  }

  return (
    <CardLayout title="리프레시">
      <form method="post" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">리프레시</button>
      </form>
    </CardLayout>
  )
}