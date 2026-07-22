"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import CherryBlossom from "@/components/CherryBlossom";

interface Question {
  id: string;
  text: string;
  category: string;
  question_type: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  values: "Core Values",
  communication: "Communication Style",
  conflict: "Conflict Resolution",
  love_language: "Love Language",
  lifestyle: "Lifestyle Pace",
  ambition: "Ambition & Goals",
};

export default function CompatibilityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.getQuestions()
      .then((data: unknown) => {
        const q = Array.isArray(data) ? data : (data as { results: Question[] }).results || [];
        setQuestions(q);
        const initial: Record<string, number> = {};
        q.forEach((question: Question) => { initial[question.id] = 3; });
        setAnswers(initial);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const answerList = Object.entries(answers).map(([question, answer_value]) => ({
        question,
        answer_value,
      }));
      await api.submitAnswers(answerList);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save answers");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pink-gradient-bg flex items-center justify-center">
        <div className="text-lg animate-pulse" style={{ color: "#DC143C" }}>Loading quiz...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pink-gradient-bg flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold mb-2 italic" style={{ color: "#DC143C" }}>Answers Saved!</h1>
          <p className="text-gray-600 mb-6">Your compatibility results will be calculated when you match with someone.</p>
          <button onClick={() => router.push("/discover")}
            className="rounded-full text-white px-6 py-3 font-semibold"
            style={{ background: "linear-gradient(to right, #DC143C, #B22222, #8B0000)" }}>
            Find Matches
          </button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(questions.map((q) => q.category))];

  return (
    <div className="min-h-screen pink-gradient-bg">
      <CherryBlossom />
      <header className="flex items-center gap-3 px-6 py-4">
        <button onClick={() => router.push("/discover")} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition">
          ←
        </button>
        <h1 className="text-xl font-bold italic tracking-wide" style={{ color: "#DC143C" }}>Compatibility Quiz</h1>
      </header>

      <div className="max-w-lg mx-auto px-6 pb-12">
        <p className="text-gray-600 text-sm mb-6">Answer honestly to get the best match suggestions. Tap the slider to set your answer from 1 (strongly disagree) to 5 (strongly agree).</p>

        {categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{CATEGORY_LABELS[cat] || cat}</h2>
            <div className="space-y-4">
              {questions.filter((q) => q.category === cat).map((q) => (
                <div key={q.id} className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white/40 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-3">{q.text}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-6">1</span>
                    <input type="range" min={1} max={5} step={1}
                      value={answers[q.id] ?? 3}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    <span className="text-xs text-gray-400 w-6 text-right">5</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    {["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"].map((label, i) => (
                      <span key={i} className={`text-[10px] ${(answers[q.id] ?? 3) === i + 1 ? "text-rose-600 font-semibold" : "text-gray-400"}`}>
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full rounded-full text-white font-semibold py-3 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition disabled:opacity-60"
          style={{ background: "linear-gradient(to right, #DC143C, #B22222, #8B0000)" }}>
          {submitting ? "Saving..." : "Save Answers"}
        </button>
      </div>
    </div>
  );
}
