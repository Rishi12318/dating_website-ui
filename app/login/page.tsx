"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/discover");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 px-4 py-12">
      <div className="w-full max-w-md relative animate-fadeInUp">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-3xl blur opacity-30 animate-pulse-custom"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40">
          <h1 className="text-3xl font-bold text-center mb-2 tracking-tight animate-bounceIn" style={{ color: '#DC143C' }}>
            Welcome Back
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">Log in to continue your journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-pink-500 px-4 py-2.5 bg-white/70"
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-semibold py-3 mt-2 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <Link href="/forgot-password" className="text-pink-600 hover:text-pink-700">Forgot password?</Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-pink-600 hover:text-pink-700">Sign up</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
