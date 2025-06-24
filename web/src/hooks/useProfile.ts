import useSWR from 'swr';
import api from "@/libs/axios";

type UserProfile = {
  id: string;
  name: string;
  nickname: string;
};

export const useProfile = () => {
  const { data, error, mutate } = useSWR<UserProfile>('/auth/profile', api);
  return {
    user: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
};
