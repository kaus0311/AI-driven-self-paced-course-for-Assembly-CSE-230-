"use client";

import { useState } from "react";
import { useAuth } from "../../../login/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../../../login/components/ui/card";
import { Textarea } from "../../../login/components/ui/textarea";
import { Button } from "../../../login/components/ui/button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ source_name?: string; page_number?: number }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function TutorClient({ moduleId }: { moduleId: string }) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError(null);
    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/fetch/query`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: userMessage.content,
          context: `Module ${moduleId}`,
          enable_search: true,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail =
          typeof data?.detail === "string" ? data.detail : "Tutor request failed. Please try again.";
        setError(detail);
        return;
      }

      const assistantText: string =
        typeof data?.result?.response === "string"
          ? data.result.response
          : "I received your question, but I could not parse the response.";

      const sources: ChatMessage["sources"] =
        data?.result?.metadata?.sources?.sources ?? data?.result?.metadata?.sources ?? [];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantText,
          sources: Array.isArray(sources) ? sources : undefined,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error contacting the tutor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Socratic CourseTutor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-96 overflow-y-auto rounded-lg border border-gray-200 p-4 space-y-4 bg-white">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Ask a question about Module {moduleId} to get started.
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`message-${index}`}
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-[#fff0f5] border border-[#800020]/50 text-gray-900"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.role === "user" ? "You" : "Tutor"}
                </p>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    <p className="font-semibold text-gray-600 mb-1">Citations:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {message.sources.map((source, idx) => (
                        <li key={`${source.source_name}-${idx}`}>
                          {source.source_name ?? "Knowledge Base"}
                          {source.page_number ? ` · Page ${source.page_number}` : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about this module..."
            rows={3}
            disabled={isLoading}
            className="bg-white text-gray-900 placeholder:text-gray-500"
          />
          <div className="flex justify-end">
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

