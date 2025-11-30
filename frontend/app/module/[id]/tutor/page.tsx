import Link from "next/link";

import TutorClient from "./TutorClient";

export async function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"].map((id) => ({
    id,
  }));
}

export default async function TutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <Link
          href={`/module/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Module
        </Link>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-[#800020]">Module {id}</p>
          <h1 className="text-3xl font-bold text-gray-900">AI Tutor</h1>
          <p className="text-gray-600">
            Ask Socratic CourseTutor anything about this module. Responses are grounded in the CSE 230
            knowledge base.
          </p>
        </div>

        <TutorClient moduleId={id} />
      </main>
    </div>
  );
}

