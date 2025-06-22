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

export default function Home() {
  const onSignUpSubmit = (signUpSchema: SignUpSchemaType): void => {
    console.log(signUpSchema);
  };

  const onLoginSubmit = (loginSchema: LoginSchemaType): void => {
    console.log(loginSchema);
  };

  const onProfileSubmit = (): void => {
    throw new Error("Function not implemented.");
  };

  const onRefreshSubmit = (): void => {
    throw new Error("Function not implemented.");
  };

  const onUpdateSubmit = (UpdateSchema: UpdateSchemaType): void => {
    console.log(UpdateSchema);
  };

  const onDeleteSubmit = (): void => {
    throw new Error("Function not implemented.");
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
