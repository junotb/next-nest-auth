import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <h1><strong>{status}</strong>님 환영합니다!</h1>
    </div>
  );
}