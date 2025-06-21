export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">🔐 인증/권한 데모 프로젝트</h1>
      <section className="grid gap-6">{children}</section>
    </main>
  );
}