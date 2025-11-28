import { notFound } from "next/navigation";
import path from "node:path";
import { promises as fs } from "node:fs";
import MasteryQuiz from "./QuizClient";

export const runtime = "nodejs";

type Choice = { id: string; text: string; isCorrect: boolean };
type Question = { id: string; prompt: string; choices: Choice[]; hint?: string };
type Quiz = { moduleId: string; code: string; title: string; questions: Question[] };

async function loadQuiz(moduleId: string): Promise<Quiz | null> {
  try {
    const file = path.join(
      process.cwd(),      // /frontend
      "..",
      "db",
      "init",
      "questions",
      `module-${moduleId}.json`
    );
    console.log("[loadQuiz] reading:", file);
    const raw = await fs.readFile(file, "utf8");
    const quiz = JSON.parse(raw) as Quiz;
    return { ...quiz, questions: quiz.questions.slice(0, 10) };
  } catch (e) {
    console.error("[loadQuiz] error:", e);
    return null;
  }
}

export default async function MasteryPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quiz = await loadQuiz(id);
  if (!quiz) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <a href={`/module/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Modules
        </a>

        {/* Title + Pill */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">{quiz.title}</h2>
            <p className="text-gray-600">10 questions · hints · instant feedback</p>
          </div>
          <div className="ml-6">
            <span className="bg-[#800020] text-white px-6 py-2 rounded-full text-sm font-semibold">
              Practice &amp; Mastery
            </span>
          </div>
        </div>

        {/* Quiz card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <MasteryQuiz initialQuiz={quiz} />
        </div>
      </main>
    </div>
  );
}