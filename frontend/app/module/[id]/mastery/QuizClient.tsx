"use client";
import { useMemo, useState } from "react";
import { RESOURCES } from "../mastery/resources";

type Choice = { id: string; text: string; isCorrect: boolean };
type Question = { id: string; prompt: string; choices: Choice[]; hint?: string };
type Quiz = { moduleId: string; code: string; title: string; questions: Question[] };

export default function MasteryQuiz({ initialQuiz }: { initialQuiz: Quiz }) {
  const questions = initialQuiz.questions;
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showSummary, setShowSummary] = useState(false);

  const current = questions[index];

  const pick = (choiceId: string) => {
    if (checked[current.id]) return;
    setAnswers(prev => ({ ...prev, [current.id]: choiceId }));
  };

  const submitCurrent = () => {
    if (!answers[current.id]) return;
    setChecked(prev => ({ ...prev, [current.id]: true }));
  };

  const next = () => setIndex(i => Math.min(i + 1, total - 1));
  const prev = () => setIndex(i => Math.max(i - 1, 0));
  const onHint = () => {
    if (hintsLeft > 0) setHintsLeft(h => h - 1);
  };

  const correctIdFor = (q: Question) => q.choices.find(c => c.isCorrect)?.id ?? "";
  const isCorrect = (q: Question) => answers[q.id] === correctIdFor(q);

  const score = useMemo(() => {
    let s = 0;
    for (const q of questions) {
      if (checked[q.id] && answers[q.id] === correctIdFor(q)) {
        s++;
      }
    }
    return s;
  }, [answers, checked, questions]);

  const allSubmitted = questions.every(q => checked[q.id]);

  const wrongQuestions = useMemo(
    () =>
      questions.filter(
        q => checked[q.id] && answers[q.id] !== (q.choices.find(c => c.isCorrect)?.id ?? "")
      ),
    [answers, checked, questions]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Question <span className="font-semibold text-black">{index + 1}</span> of {total}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Score:</span>{" "}
          <span className="text-[#800020] font-semibold">
            {score}/{total}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{ width: `${((index + 1) / total) * 100}%`, backgroundColor: "#800020" }}
        />
      </div>

      <h3 className="text-xl font-semibold text-black">{current.prompt}</h3>

      <div className="space-y-3">
        {current.choices.map(choice => {
          const selected = answers[current.id] === choice.id;
          const wasChecked = checked[current.id];
          let skin = "bg-white border border-gray-200 hover:border-gray-300";
          if (!wasChecked && selected) skin = "bg-[#fff6f8] border border-[#800020]";
          if (wasChecked) {
            const correct = correctIdFor(current);
            if (choice.id === correct) skin = "bg-green-50 border border-green-500";
            else if (selected) skin = "bg-red-50 border border-red-500";
            else skin = "bg-white border border-gray-200";
          }
          return (
            <button
              key={choice.id}
              onClick={() => pick(choice.id)}
              disabled={wasChecked}
              className={`w-full text-left p-4 rounded-lg transition ${skin}`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full border text-xs font-semibold">
                {choice.id}
              </span>
              {choice.text}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onHint}
            disabled={!current.hint || hintsLeft === 0}
            className="text-[#800020] disabled:text-gray-400 font-medium"
            title={current.hint ? "" : "No hint for this question"}
          >
            💡 Get Hint ({hintsLeft} remaining)
          </button>
          {current.hint && hintsLeft < 3 && <span className="text-gray-600">{current.hint}</span>}
        </div>
        {checked[current.id] && (
          <div
            className={`text-sm font-medium ${
              isCorrect(current) ? "text-green-700" : "text-red-700"
            }`}
          >
            {isCorrect(current) ? "Correct!" : `Incorrect. Correct answer: ${correctIdFor(current)}`}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg bg-gray-100 text-black disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center gap-3">
          {!checked[current.id] ? (
            <button
              onClick={submitCurrent}
              disabled={!answers[current.id]}
              className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ backgroundColor: "#800020" }}
            >
              Submit Answer
            </button>
          ) : index < total - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded-lg text-white"
              style={{ background: "linear-gradient(90deg, #800020, #f59e0b)" }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setShowSummary(true)}
              disabled={!allSubmitted}
              className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #800020, #f59e0b)" }}
            >
              Finish Quiz
            </button>
          )}
        </div>
      </div>

      {showSummary && (
        <div className="border-t pt-6 mt-4 space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-black">Summary</h4>
            <p className="text-gray-700">
              You answered <strong className="text-black">{score}</strong> of{" "}
              <strong className="text-black">{total}</strong> correctly.
            </p>
          </div>

          <div className="space-y-3">
            {questions.map(q => {
              const picked = answers[q.id] ?? "—";
              const correct = q.choices.find(c => c.isCorrect)?.id ?? "—";
              const ok = picked === correct;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    ok ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="font-medium text-black mb-1">
                    Q{q.id}. {q.prompt}
                  </div>
                  <div className="text-sm text-gray-600">
                    Your answer: <strong className="text-black">{picked}</strong> · Correct:{" "}
                    <strong className="text-black">{correct}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {wrongQuestions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-black mb-2">Recommended resources</h4>
              <p className="text-gray-700 mb-3">
                Review these to strengthen the concepts you missed:
              </p>
              <div className="space-y-4">
                {wrongQuestions.map(q => {
                  const items = RESOURCES[initialQuiz.moduleId]?.[q.id] ?? [];
                  if (!items.length) return null;
                  return (
                    <div
                      key={`res-${q.id}`}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="font-medium text-black mb-2">
                        Q{q.id}: {q.prompt}
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {items.map((url, idx) => (
                          <li key={idx}>
                            <a
                              className="text-[#800020] hover:underline"
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
