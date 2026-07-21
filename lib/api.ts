const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://lovelle-backend.onrender.com/api/v1";

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getTokens(): { access: string | null; refresh: string | null } {
    if (typeof window === "undefined") return { access: null, refresh: null };
    return {
      access: localStorage.getItem("access_token"),
      refresh: localStorage.getItem("refresh_token"),
    };
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  async refreshAccessToken(): Promise<string | null> {
    const { refresh } = this.getTokens();
    if (!refresh) return null;

    try {
      const res = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      this.setTokens(data.access, refresh);
      return data.access;
    } catch {
      return null;
    }
  }

  async request<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const token = options.token || this.getTokens().access;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    let res = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (res.status === 401 && this.getTokens().refresh) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        res = await fetch(`${this.baseUrl}${endpoint}`, config);
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || errorData.error || errorData.message || `Request failed (${res.status})`;
      throw new Error(message);
    }

    return res.json();
  }

  // Auth
  register(data: { email: string; password: string; password_confirm: string }) {
    return this.request<{
      user: { id: string; email: string; is_verified: boolean };
      tokens: { access: string; refresh: string };
      verification_token: string;
    }>("/auth/register/", { method: "POST", body: data, token: "" });
  }

  login(data: { email: string; password: string }) {
    return this.request<{
      user: { id: string; email: string; is_verified: boolean };
      tokens: { access: string; refresh: string };
    }>("/auth/login/", { method: "POST", body: data, token: "" });
  }

  logout(refreshToken: string) {
    return this.request("/auth/logout/", { method: "POST", body: { refresh: refreshToken } });
  }

  verifyEmail(token: string) {
    return this.request("/auth/verify-email/", { method: "POST", body: { token } });
  }

  requestPasswordReset(email: string) {
    return this.request("/auth/password-reset/", { method: "POST", body: { email } });
  }

  resetPassword(token: string, newPassword: string, newPasswordConfirm: string) {
    return this.request("/auth/password-reset/confirm/", {
      method: "POST",
      body: { token, new_password: newPassword, new_password_confirm: newPasswordConfirm },
    });
  }

  // Profile
  getProfile() {
    return this.request("/profiles/");
  }

  updateProfile(data: Record<string, unknown>) {
    return this.request("/profiles/", { method: "PATCH", body: data });
  }

  getProfileList() {
    return this.request("/profiles/list/");
  }

  uploadPhoto(formData: FormData) {
    const token = this.getTokens().access;
    return fetch(`${this.baseUrl}/profiles/photos/upload/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then((r) => r.json());
  }

  // Matching
  likeUser(toUserId: string, isSuperLike = false) {
    return this.request("/matching/like/", {
      method: "POST",
      body: { to_user: toUserId, is_super_like: isSuperLike },
    });
  }

  dislikeUser(toUserId: string) {
    return this.request("/matching/dislike/", { method: "POST", body: { to_user: toUserId } });
  }

  blockUser(blockedUserId: string) {
    return this.request("/matching/block/", { method: "POST", body: { blocked: blockedUserId } });
  }

  getMatches() {
    return this.request("/matching/matches/");
  }

  unmatch(matchId: string) {
    return this.request(`/matching/matches/${matchId}/unmatch/`, { method: "DELETE" });
  }

  discover() {
    return this.request("/matching/discover/");
  }

  // Messaging
  getMessages(matchId: string) {
    return this.request(`/messaging/${matchId}/messages/`);
  }

  sendMessage(matchId: string, content: string, messageType = "text") {
    return this.request(`/messaging/${matchId}/messages/send/`, {
      method: "POST",
      body: { content, message_type: messageType },
    });
  }

  // Compatibility
  getQuestions() {
    return this.request("/compatibility/questions/");
  }

  submitAnswers(answers: Array<{ question: string; answer_value: number }>) {
    return this.request("/compatibility/answers/", { method: "POST", body: { answers } });
  }

  calculateCompatibility(otherUserId: string) {
    return this.request(`/compatibility/calculate/${otherUserId}/`, { method: "POST" });
  }

  // AI Features
  generateBio(hobbies: string, interests: string, personalityTraits: string) {
    return this.request("/ml/ai/generate-bio/", {
      method: "POST",
      body: { hobbies, interests, personality_traits: personalityTraits },
    });
  }

  generateIcebreakers(matchId: string) {
    return this.request(`/ml/ai/icebreaker/${matchId}/`, { method: "POST" });
  }

  suggestReply(messageId: string) {
    return this.request(`/ml/ai/suggest-reply/${messageId}/`, { method: "POST" });
  }

  explainCompatibility(userId: string) {
    return this.request(`/ml/ai/explain-compatibility/${userId}/`, { method: "POST" });
  }

  // Recommendations
  getRecommendations() {
    return this.request("/ml/recommendations/");
  }

  // Moderation
  reportUser(reportedUserId: string, reason: string, description: string) {
    return this.request("/moderation/report/", {
      method: "POST",
      body: { reported_user: reportedUserId, reason, description },
    });
  }

  // Interests
  getInterests() {
    return this.request("/profiles/interests/");
  }
}

export const api = new ApiClient(API_BASE);
