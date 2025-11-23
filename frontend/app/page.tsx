"use client";

import { FormEvent, useState } from "react";

type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const formatHistory = (history: TutorMessage[]) =>
  history.length
    ? history
        .map(({ role, content }) => `${role.toUpperCase()}: ${content}`)
        .join("\n")
    : undefined;

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    const updatedMessages: TutorMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);
    setQuestion("");

    try {
      const res = await fetch(`${API_URL}/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          context: formatHistory(updatedMessages),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail =
          typeof data.detail === "string" ? data.detail : "Unexpected error";
        throw new Error(detail);
      }

      const data: { answer?: string } = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: (data.answer || "No response from tutor.").trim(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Capstone Next.js Frontend</h1>
      {/*<p className="mt-4 text-gray-700">Backend /health: {JSON.stringify(health)}</p>*/}
    </main>
  );
}
