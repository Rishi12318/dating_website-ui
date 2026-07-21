import requests
import json
from django.conf import settings


class AIService:
    def __init__(self):
        self.groq_key = settings.GROQ_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        self.gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_key}"

    def _call_groq(self, messages, max_tokens=300):
        if not self.groq_key:
            return None
        try:
            response = requests.post(
                self.groq_url,
                headers={
                    "Authorization": f"Bearer {self.groq_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": 0.7,
                },
                timeout=10,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception:
            return None

    def _call_gemini(self, prompt):
        if not self.gemini_key:
            return None
        try:
            response = requests.post(
                self.gemini_url,
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"maxOutputTokens": 300, "temperature": 0.7},
                },
                timeout=10,
            )
            response.raise_for_status()
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            return None

    def generate_bio(self, hobbies, interests, personality_traits):
        prompt = f"""Generate 3 short dating app bio options (each 1-2 sentences) for someone with:
Hobbies: {hobbies}
Interests: {interests}
Personality: {personality_traits}

Make them catchy, authentic, and slightly playful. Return as a JSON array of strings."""

        messages = [
            {"role": "system", "content": "You are a dating profile copywriter. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ]

        result = self._call_groq(messages)
        if result:
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                return [result]

        return [
            f"I love {hobbies} and am passionate about {interests}. Looking for someone who appreciates authentic connections.",
            f"Adventurous soul who enjoys {hobbies}. Let's explore {interests} together!",
            f"Passionate about {interests} and always up for {hobbies}. Seeking genuine connections with interesting people.",
        ]

    def generate_icebreakers(self, shared_interests, user_a_name, user_b_name):
        interests_str = ", ".join(shared_interests[:5]) if shared_interests else "similar interests"
        prompt = f"""Generate 3 icebreaker message suggestions for a dating match.
Both users enjoy: {interests_str}
Make them friendly, specific to shared interests, and easy to respond to."""

        messages = [
            {"role": "system", "content": "You are a dating coach. Return only valid JSON array of strings."},
            {"role": "user", "content": prompt},
        ]

        result = self._call_groq(messages)
        if result:
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                return [result]

        return [
            f"I noticed we both enjoy {interests_str if shared_interests else 'similar things'}! What got you into it?",
            f"Hey! Our interests seem to align perfectly. Want to chat about {interests_str if shared_interests else 'what we have in common'}?",
            f"Great match! I see we share some passions. What's your favorite thing about {interests_str if shared_interests else 'our shared interests'}?",
        ]

    def suggest_reply(self, recent_messages, context=""):
        messages_text = "\n".join([f"{m['sender']}: {m['content']}" for m in recent_messages[-5:]])
        prompt = f"""Based on this conversation:
{messages_text}

Suggest 3 possible replies that are natural, engaging, and keep the conversation going.
{f'Context: {context}' if context else ''}"""

        messages = [
            {"role": "system", "content": "You are a dating messaging assistant. Return only valid JSON array of strings."},
            {"role": "user", "content": prompt},
        ]

        result = self._call_groq(messages)
        if result:
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                return [result]

        return [
            "That sounds great! Tell me more about that.",
            "I'd love to hear more about your experience with that!",
            "That's really interesting! What else do you enjoy?",
        ]

    def explain_compatibility(self, score, category_scores, shared_traits):
        prompt = f"""Explain this dating compatibility score in a warm, encouraging way:
Overall Score: {score}%
Category Breakdown: {json.dumps(category_scores)}
Shared Traits: {', '.join(shared_traits[:5]) if shared_traits else 'various aligned values'}

Write 2-3 sentences explaining what this means for the couple."""

        messages = [
            {"role": "system", "content": "You are a relationship advisor. Be warm and encouraging."},
            {"role": "user", "content": prompt},
        ]

        result = self._call_groq(messages)
        if result:
            return result

        if score >= 80:
            return f"You two have excellent compatibility at {score}%! Your shared values and interests create a strong foundation for a meaningful connection."
        elif score >= 60:
            return f"You have solid compatibility at {score}%. You share some important values and have great potential for a genuine connection."
        else:
            return f"Your compatibility is {score}%. While you have some differences, these can bring excitement and growth to a relationship."


ai_service = AIService()
