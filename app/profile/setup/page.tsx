"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const GENDERS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "NB", label: "Non-Binary" },
  { value: "O", label: "Other" },
];

const RELATIONSHIP_GOALS = [
  { value: "long_term", label: "Long-term relationship" },
  { value: "short_term", label: "Short-term dating" },
  { value: "friendship", label: "Friendship" },
  { value: "unsure", label: "Not sure yet" },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    birth_date: "",
    gender: "",
    gender_preference: "A",
    bio: "",
    city: "",
    occupation: "",
    height: "",
    relationship_goal: "unsure",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!form.display_name || !form.birth_date || !form.gender)) {
      setError("Please fill in name, birthday, and gender.");
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.updateProfile({
        ...form,
        height: form.height ? parseInt(form.height) : null,
      });
      router.push("/discover");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 px-4 py-12">
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-3xl blur opacity-20"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? "w-8 bg-rose-500" : s < step ? "w-4 bg-rose-300" : "w-4 bg-gray-200"}`} />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#DC143C" }}>
            {step === 1 ? "About You" : step === 2 ? "Your Vibe" : "Looking For"}
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            {step === 1 ? "Tell us the basics" : step === 2 ? "Help others know you" : "What are you looking for?"}
          </p>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
                <input type="text" name="display_name" value={form.display_name} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Birthday</label>
                <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70">
                  <option value="">Select...</option>
                  {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Interested In</label>
                <select name="gender_preference" value={form.gender_preference} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70">
                  <option value="A">Everyone</option>
                  <option value="M">Men</option>
                  <option value="F">Women</option>
                  <option value="NB">Non-Binary</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70 resize-none" placeholder="Tell us about yourself..." maxLength={500} />
                <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" placeholder="New York" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Occupation</label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Height (cm)</label>
                <input type="number" name="height" value={form.height} onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" placeholder="170" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">What are you looking for?</label>
                <div className="grid grid-cols-2 gap-3">
                  {RELATIONSHIP_GOALS.map((g) => (
                    <button key={g.value} type="button" onClick={() => setForm({ ...form, relationship_goal: g.value })}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                        form.relationship_goal === g.value
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 bg-white/50 text-gray-600 hover:border-rose-300"
                      }`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 rounded-full border-2 border-rose-300 text-rose-600 font-semibold py-3 hover:bg-rose-50 transition">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext}
                className="flex-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-semibold py-3 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition">
                Continue
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-semibold py-3 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition disabled:opacity-60">
                {loading ? "Saving..." : "Find My Match"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
