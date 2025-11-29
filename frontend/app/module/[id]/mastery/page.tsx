"use client";

import { notFound, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import MasteryQuiz from "./QuizClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Choice = { id: string; text: string; isCorrect: boolean };
type Question = { id: string; prompt: string; choices: Choice[]; hint?: string };
type Quiz = { moduleId: string; questions: Question[] };

export default function MasteryPage() {
  const params = useParams();
  const moduleId = params?.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateQuiz = useCallback(async () => {
    if (!moduleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/fetch/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          num_questions: 10,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate quiz");
      }

      setQuiz(data);
      setShowQuiz(true);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  // Auto-generate quiz when page loads
  useEffect(() => {
    if (moduleId && !hasGenerated) {
      generateQuiz();
    }
  }, [moduleId, hasGenerated, generateQuiz]);

  if (!moduleId) {
    return notFound();
  }

  if (showQuiz && quiz) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Back */}
          <div className="flex items-center justify-between mb-6">
            <a href={`/module/${moduleId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Modules
            </a>
            <button
              onClick={() => {
                setShowQuiz(false);
                setQuiz(null);
                setHasGenerated(false);
                generateQuiz();
              }}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate New Quiz"}
            </button>
          </div>

          {/* Title + Pill */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-black mb-2">Module {moduleId} Quiz</h2>
              <p className="text-gray-600">{quiz.questions.length} questions · hints · instant feedback</p>
            </div>
            <div className="ml-6">
              <span className="bg-[#800020] text-white px-6 py-2 rounded-full text-sm font-semibold">
                Practice &amp; Mastery
              </span>
            </div>
          </div>

          {/* Quiz card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <MasteryQuiz quiz={quiz} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <a href={`/module/${moduleId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Modules
        </a>

        {/* Title + Pill */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-black mb-2">Module {moduleId} Quiz</h2>
            <p className="text-gray-600">Practice & Mastery Questions</p>
          </div>
          <div className="ml-6">
            <span className="bg-[#800020] text-white px-6 py-2 rounded-full text-sm font-semibold">
              Practice &amp; Mastery
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#800020] rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 text-lg font-medium">Generating quiz questions...</p>
              <p className="text-gray-500 text-sm">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={generateQuiz}
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#800020" }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
