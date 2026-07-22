"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import CherryBlossom from "@/components/CherryBlossom";

interface Profile {
  id: string;
  display_name: string;
  age: number;
  city: string;
  occupation: string;
  photos: Array<{ image: string; is_primary: boolean }>;
}

export default function DiscoverPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [matchEffect, setMatchEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.discover();
      setProfiles(Array.isArray(data) ? data : (data as { results: Profile[] }).results || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadProfiles();
  }, [user, loadProfiles]);

  const handleLike = async (superLike = false) => {
    const profile = profiles[currentIndex];
    if (!profile || actionLoading) return;
    setActionLoading(true);
    try {
      const result = await api.likeUser(profile.id, superLike) as { match_created?: boolean };
      if (result?.match_created) {
        setMatchEffect(true);
        setTimeout(() => setMatchEffect(false), 3000);
      }
      setCurrentIndex((i) => i + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDislike = async () => {
    const profile = profiles[currentIndex];
    if (!profile || actionLoading) return;
    setActionLoading(true);
    try {
      await api.dislikeUser(profile.id);
      setCurrentIndex((i) => i + 1);
    } catch {
      // silently skip
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pink-gradient-bg flex items-center justify-center">
        <div className="text-lg animate-pulse" style={{ color: "#DC143C" }}>Loading profiles...</div>
      </div>
    );
  }

  const current = profiles[currentIndex];

  return (
    <div className="min-h-screen pink-gradient-bg flex flex-col">
      <CherryBlossom />
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold italic tracking-wide" style={{ color: "#DC143C" }}>Lovelle</h1>
        <div className="flex gap-3">
          <button onClick={() => router.push("/matches")} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition shadow-sm">
            <span className="text-lg">💬</span>
          </button>
          <button onClick={() => router.push("/profile/edit")} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition shadow-sm">
            <span className="text-lg">👤</span>
          </button>
        </div>
      </header>

      {/* Match effect overlay */}
      {matchEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounceIn shadow-2xl">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#DC143C" }}>It&apos;s a Match!</h2>
            <p className="text-gray-600 mb-4">You and {current?.display_name} liked each other</p>
            <button onClick={() => { setMatchEffect(false); router.push("/matches"); }}
              className="rounded-full text-white px-6 py-2 font-semibold"
              style={{ background: "linear-gradient(to right, #DC143C, #B22222, #8B0000)" }}>
              Send a Message
            </button>
          </div>
        </div>
      )}

      {/* Profile card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        {!current ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No more profiles</h2>
            <p className="text-gray-500 mb-4">Check back later for new people near you</p>
            <button onClick={() => { setCurrentIndex(0); loadProfiles(); }}
              className="rounded-full text-white px-6 py-2 font-semibold"
              style={{ background: "linear-gradient(to right, #DC143C, #B22222, #8B0000)" }}>
              Refresh
            </button>
          </div>
        ) : (
            <div className="w-full max-w-sm">
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-white/40">
              {/* Photo */}
              <div className="aspect-[3/4] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFE4E1, #F8BBD0)" }}>
                {current.photos?.length > 0 ? (
                  <img src={current.photos[0].image} alt={current.display_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-8xl">👤</div>
                )}
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
                <h2 className="text-2xl font-bold text-white">
                  {current.display_name}, {current.age}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {current.occupation && `${current.occupation} • `}{current.city}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleDislike} disabled={actionLoading}
                className="w-14 h-14 rounded-full bg-white shadow-lg border-2 border-gray-200 flex items-center justify-center text-2xl hover:border-red-300 hover:bg-red-50 transition disabled:opacity-50">
                ✕
              </button>
              <button onClick={() => handleLike(true)} disabled={actionLoading}
                className="w-14 h-14 rounded-full bg-white shadow-lg border-2 border-blue-200 flex items-center justify-center text-2xl hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50">
                ⭐
              </button>
              <button onClick={() => handleLike(false)} disabled={actionLoading}
                className="w-14 h-14 rounded-full shadow-lg shadow-pink-500/30 flex items-center justify-center text-2xl text-white hover:shadow-pink-500/50 transition disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #DC143C, #B22222)" }}>
                💕
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}
    </div>
  );
}
