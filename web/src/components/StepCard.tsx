import Link from "next/link";

export default function StepCard({ step, title, description, href }: { step: string; title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <div className="border p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-1">
          {step}. {title}
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}