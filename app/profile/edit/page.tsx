"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const GENDERS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "NB", label: "Non-Binary" },
  { value: "O", label: "Other" },
];

const GOALS = [
  { value: "long_term", label: "Long-term" },
  { value: "short_term", label: "Short-term" },
  { value: "friendship", label: "Friendship" },
  { value: "unsure", label: "Not sure" },
];

export default function ProfileEditPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    display_name: "", bio: "", city: "", occupation: "", education: "",
    height: "", gender: "", gender_preference: "A", relationship_goal: "unsure",
    lifestyle_tags: [] as string[], personality_tags: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLifestyleTag, setNewLifestyleTag] = useState("");
  const [newPersonalityTag, setNewPersonalityTag] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.getProfile()
      .then((p: unknown) => {
        const profile = p as Record<string, unknown>;
        setForm({
          display_name: (profile.display_name as string) || "", bio: (profile.bio as string) || "", city: (profile.city as string) || "",
          occupation: (profile.occupation as string) || "", education: (profile.education as string) || "",
          height: (profile.height as number)?.toString() || "", gender: (profile.gender as string) || "",
          gender_preference: (profile.gender_preference as string) || "A",
          relationship_goal: (profile.relationship_goal as string) || "unsure",
          lifestyle_tags: (profile.lifestyle_tags as string[]) || [], personality_tags: (profile.personality_tags as string[]) || [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.updateProfile({
        ...form,
        height: form.height ? parseInt(form.height) : null,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (type: "lifestyle" | "personality") => {
    const tag = type === "lifestyle" ? newLifestyleTag : newPersonalityTag;
    if (!tag.trim()) return;
    const field = type === "lifestyle" ? "lifestyle_tags" : "personality_tags";
    setForm({ ...form, [field]: [...form[field], tag.trim()] });
    if (type === "lifestyle") setNewLifestyleTag(""); else setNewPersonalityTag("");
  };

  const removeTag = (type: "lifestyle" | "personality", index: number) => {
    const field = type === "lifestyle" ? "lifestyle_tags" : "personality_tags";
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        <div className="text-rose-500 text-lg animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <header className="flex items-center gap-3 px-6 py-4">
        <button onClick={() => router.push("/discover")} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition">←</button>
        <h1 className="text-xl font-bold" style={{ color: "#DC143C" }}>Edit Profile</h1>
      </header>

      <div className="max-w-lg mx-auto px-6 pb-12 space-y-5">
        {[
          { label: "Display Name", name: "display_name", type: "text", placeholder: "Your name" },
          { label: "Bio", name: "bio", type: "textarea", placeholder: "Tell us about yourself..." },
          { label: "City", name: "city", type: "text", placeholder: "New York" },
          { label: "Occupation", name: "occupation", type: "text", placeholder: "Software Engineer" },
          { label: "Education", name: "education", type: "text", placeholder: "University of..." },
          { label: "Height (cm)", name: "height", type: "number", placeholder: "170" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1 text-gray-700">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea name={field.name} value={(form as Record<string, unknown>)[field.name] as string}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                rows={3} placeholder={field.placeholder}
                className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70 resize-none" />
            ) : (
              <input type={field.type} name={field.name} value={(form as Record<string, unknown>)[field.name] as string}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70" />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
            <select name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70">
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Looking For</label>
            <select name="relationship_goal" value={form.relationship_goal}
              onChange={(e) => setForm({ ...form, relationship_goal: e.target.value })}
              className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70">
              {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>

        {/* Lifestyle tags */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Lifestyle Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.lifestyle_tags.map((tag, i) => (
              <span key={i} className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                {tag} <button onClick={() => removeTag("lifestyle", i)} className="hover:text-pink-900">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newLifestyleTag} onChange={(e) => setNewLifestyleTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("lifestyle"))}
              placeholder="e.g. non-smoker, vegetarian" className="flex-1 rounded-xl border border-gray-300 px-4 py-2 bg-white/70 text-sm" />
            <button onClick={() => addTag("lifestyle")} className="px-3 rounded-xl bg-rose-100 text-rose-600 text-sm font-medium">Add</button>
          </div>
        </div>

        {/* Personality tags */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Personality Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.personality_tags.map((tag, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                {tag} <button onClick={() => removeTag("personality", i)} className="hover:text-blue-900">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newPersonalityTag} onChange={(e) => setNewPersonalityTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("personality"))}
              placeholder="e.g. adventurous, introverted" className="flex-1 rounded-xl border border-gray-300 px-4 py-2 bg-white/70 text-sm" />
            <button onClick={() => addTag("personality")} className="px-3 rounded-xl bg-blue-100 text-blue-600 text-sm font-medium">Add</button>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        {success && <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">Profile saved!</div>}

        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-semibold py-3 shadow-lg shadow-pink-500/30 transition disabled:opacity-60">
          {saving ? "Saving..." : "Save Profile"}
        </button>

        <div className="flex gap-3">
          <button onClick={() => router.push("/compatibility")}
            className="flex-1 rounded-full border-2 border-rose-300 text-rose-600 font-semibold py-3 hover:bg-rose-50 transition text-sm">
            Take Compatibility Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
