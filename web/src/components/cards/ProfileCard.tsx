"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, ProfileSchemaType } from "@/schemas/ProfileSchema";
import CardLayout from "./CardLayout";

interface ProfileCardProps {
  onSubmit: () => void;
}

export default function ProfileCard({ onSubmit }: ProfileCardProps) {
  const {
    handleSubmit,
    formState: {},
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
  });

  const processSubmit = async ({}: ProfileSchemaType) => {
    onSubmit();
  }

  return (
    <CardLayout title="프로필 조회">
      <form method="post" className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">프로필 조회</button>
      </form>
    </CardLayout>
  );
}