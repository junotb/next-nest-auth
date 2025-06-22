import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoggedIn: boolean;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ 
    accessToken: token,
    isLoggedIn: !!token // token이 null이면 false, 아니면 true로 설정
  }),
  isLoggedIn: false,
}));
