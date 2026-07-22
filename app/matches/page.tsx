"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import CherryBlossom from "@/components/CherryBlossom";

interface Match {
  id: string;
  matched_at: string;
  other_user_profile?: {
    id: string;
    display_name: string;
    age: number;
    city: string;
    photos: Array<{ image: string }>;
  };
}

export default function MatchesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.getMatches()
      .then((data: unknown) => setMatches(Array.isArray(data) ? data : (data as { results: Match[] }).results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pink-gradient-bg flex items-center justify-center">
        <div className="text-lg animate-pulse" style={{ color: "#DC143C" }}>Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pink-gradient-bg">
      <CherryBlossom />
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/discover")} className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition">
          ←
        </button>
        <h1 className="text-xl font-bold italic tracking-wide" style={{ color: "#DC143C" }}>Matches</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 pb-6">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No matches yet</h2>
            <p className="text-gray-500 mb-4">Keep swiping to find someone special!</p>
            <button onClick={() => router.push("/discover")}
              className="rounded-full text-white px-6 py-2 font-semibold"
              style={{ background: "linear-gradient(to right, #DC143C, #B22222, #8B0000)" }}>
              Discover People
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const profile = match.other_user_profile;
              return (
                <button key={match.id} onClick={() => router.push(`/matches/${match.id}`)}
                  className="w-full flex items-center gap-4 bg-white/70 backdrop-blur rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition text-left">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                    {profile?.photos?.[0]?.image ? (
                      <img src={profile.photos[0].image} alt="" className="w-full h-full object-cover" />
                    ) : "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {profile?.display_name || "Unknown"}, {profile?.age || "?"}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{profile?.city || "Somewhere nearby"}</p>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(match.matched_at).toLocaleDateString()}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
