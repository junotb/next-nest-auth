"use client";

import Header from "@/components/Header";
import SignUpCard from "@/components/cards/SignUpCard";
import LoginCard from "@/components/cards/LoginCard";
import ProfileCard from "@/components/cards/ProfileCard";
import RefreshCard from "@/components/cards/RefreshCard";
import UpdateCard from "@/components/cards/UpdateCard";
import LogoutCard from "@/components/cards/LogoutCard";
import DeleteCard from "@/components/cards/DeleteCard";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";
import api from "@/libs/axios";
import { SignUpSchemaType } from "@/schemas/SignUpSchema";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import { UpdateSchemaType } from "@/schemas/UpdateSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { mutate } from "swr";

export default function Home() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { user } = useProfile();
  const { showToast, Toast } = useToast();

  const onSignUpSubmit = async ({ id, pwd, name, nickname }: SignUpSchemaType): Promise<void> => {
    try {
      await api.post("/auth/signup", { id, pwd, usePwd: 0, name, nickname });
      showToast("회원가입 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("회원가입 실패");
      }
    }
  };

  const onLoginSubmit = async ({ id, pwd }: LoginSchemaType): Promise<void> => {
    try {
      const { data } = await api.post("/auth/login", { id, pwd });
      setAccessToken(data.accessToken);
      showToast("로그인 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("로그인 실패");
      }
    }
  };

  const onProfileSubmit = async (): Promise<void> => {
    try {
      await api.get("/auth/profile");
      showToast("프로필 조회 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("프로필 조회 실패");
      }
    }
  };

  const onRefreshSubmit = async (): Promise<void> => {
    try {
      const { data } = await api.post("/auth/refresh");
      setAccessToken(data.accessToken);
      showToast("토큰 갱신 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("토큰 갱신 실패");
      }
    }
  };

  const onUpdateSubmit = async ({ nickname }: UpdateSchemaType): Promise<void> => {
    try {
      await api.put("/auth/update", { nickname });
      showToast("닉네임 업데이트 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("닉네임 업데이트 실패");
      }
    }
  };

  const onLogoutSubmit = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
      setAccessToken("");
      mutate("/auth/profile", null);
      showToast("로그아웃 성공");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("로그아웃 실패");
      }
    }
  };

  const onDeleteSubmit = async (): Promise<void> => {
    try {
      await api.delete("/auth/delete");
      showToast("회원 탈퇴 성공");
      setAccessToken("");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      } else {
        showToast("회원 탈퇴 실패");
      }
    }
  }

  return (
    <>
      <Header />

      {Toast}
      
      <main className="min-w-md max-w-4xl mx-auto pt-16 px-16">
        <section className="grid md:grid-cols-2 gap-8 pt-8">
          <article>
            <SignUpCard onSubmit={onSignUpSubmit} />
          </article>
          
          <article>
            <LoginCard onSubmit={onLoginSubmit} />
          </article>

          {user && (
            <>
              <article>
                <ProfileCard onSubmit={onProfileSubmit} />
              </article>
              
              <article>
                <RefreshCard onSubmit={onRefreshSubmit} />
              </article>

              <article>
                <UpdateCard onSubmit={onUpdateSubmit} />
              </article>

              <article>
                <LogoutCard onSubmit={onLogoutSubmit} />
              </article>
              
              <article>
                <DeleteCard onSubmit={onDeleteSubmit} />
              </article>
            </>
          )}
        </section>
      </main>
    </>
  );
}
