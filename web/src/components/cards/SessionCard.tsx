import CardLayout from "./CardLayout";

export default function SessionCard() {
  return (
    <CardLayout title="세션 정보">
      <form method="post" className="space-y-4">
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">세션 정보 가져오기</button>
      </form>
    </CardLayout>
  );
}