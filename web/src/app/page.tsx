"use client";

import Header from "@/components/Header";
import SignUpCard from "@/components/cards/SignUpCard";
import LoginCard from "@/components/cards/LoginCard";
import ProfileCard from "@/components/cards/ProfileCard";
import RefreshCard from "@/components/cards/RefreshCard";
import UpdateCard from "@/components/cards/UpdateCard";
import DeleteCard from "@/components/cards/DeleteCard";
import { SignUpSchemaType } from "@/schemas/SignUpSchema";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import { UpdateSchemaType } from "@/schemas/UpdateSchema";
import api from "@/libs/axios";

export default function Home() {
  const onSignUpSubmit = ({ id, pwd, name, nickname }: SignUpSchemaType): void => {
    const data = api.post("/auth/signup", { id, pwd, name, nickname });
    console.log(data);
  };

  const onLoginSubmit = async ({ id, pwd }: LoginSchemaType): Promise<void> => {
    const data = await api.post("/auth/login", { id, pwd });
    console.log(data);
  };

  const onProfileSubmit = (): void => {
    const data = api.get("/auth/profile");
    console.log(data);
  };

  const onRefreshSubmit = (): void => {
    const data = api.post("/auth/refresh");
    console.log(data);
  };

  const onUpdateSubmit = ({ nickname }: UpdateSchemaType): void => {
    const data = api.put("/auth/update", { nickname });
    console.log(data);
  };

  const onDeleteSubmit = (): void => {
    const data = api.delete("/auth/delete");
    console.log(data);
  }

  return (
    <>
      <Header />

      <main className="min-w-md max-w-4xl mx-auto pt-16 px-16">
        <section className="grid md:grid-cols-2 gap-8 pt-8">
          <article>
            <SignUpCard onSubmit={onSignUpSubmit} />
          </article>
          
          <article>
            <LoginCard onSubmit={onLoginSubmit} />
          </article>

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
            <DeleteCard onSubmit={onDeleteSubmit} />
          </article>
        </section>
      </main>
    </>
  );
}
