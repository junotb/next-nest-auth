import StepCard from "@/components/StepCard";

export default function Home() {
  const steps = [
    { step: "1", title: "회원가입", description: "계정을 만들고 서비스를 시작하세요.", href: "/signup" },
    { step: "2", title: "로그인", description: "Access/Refresh Token 발급 받기", href: "/login" },
    { step: "3", title: "토큰 인증된 페이지 접근", description: "로그인 후 대시보드 확인", href: "/dashboard" },
    { step: "4", title: "권한 제어 (Admin 전용)", description: "관리자만 접근 가능한 페이지", href: "/dashboard/admin" },
    { step: "5", title: "프로필 수정", description: "이름, 이메일 등 정보 수정", href: "/dashboard/profile" },
    { step: "6", title: "로그아웃 / 탈퇴", description: "세션 종료 및 계정 삭제", href: "/dashboard/profile" },
  ];
  
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">🔐 인증/권한 데모 프로젝트</h1>
      
      <section className="grid gap-6">
        {steps.map(({ step, title, description, href }) => (
          <StepCard
            step={step}
            title={title}
            description={description}
            href={href}
            key={step}
          />
        ))}
      </section>
    </main>
  );
}
