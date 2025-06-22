export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 mt-16 text-center">인증 기능 데모</h1>
      <section className="grid gap-6">{children}</section>
    </main>
  );
}