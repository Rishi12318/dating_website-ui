import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter


class ContentBasedRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500)

    def build_feature_vector(self, profile):
        features = []
        features.append(profile.get_gender_display() or "")
        features.append(profile.get_relationship_goal_display() or "")
        features.append(profile.city or "")
        features.append(profile.occupation or "")
        features.append(profile.education or "")
        features.append(profile.bio or "")
        features.extend([tag for tag in (profile.lifestyle_tags or [])])
        features.extend([tag for tag in (profile.personality_tags or [])])
        interests = profile.interests.all()
        features.extend([interest.name for interest in interests])
        return " ".join(features)

    def compute_similarity(self, user_profile, candidate_profiles):
        user_vector = self.build_feature_vector(user_profile)
        candidate_vectors = [self.build_feature_vector(p) for p in candidate_profiles]

        if not candidate_vectors:
            return []

        all_vectors = [user_vector] + candidate_vectors
        tfidf_matrix = self.vectorizer.fit_transform(all_vectors)

        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        return similarities

    def get_interest_overlap(self, user_interests, candidate_interests):
        user_set = set(user_interests.values_list("name", flat=True))
        candidate_set = set(candidate_interests.values_list("name", flat=True))

        if not user_set or not candidate_set:
            return 0.0

        intersection = user_set & candidate_set
        union = user_set | candidate_set
        return len(intersection) / len(union) if union else 0.0

    def generate_reason(self, user_profile, candidate_profile, score):
        reasons = []
        shared_interests = set(user_profile.interests.values_list("name", flat=True)) & \
                          set(candidate_profile.interests.values_list("name", flat=True))
        if shared_interests:
            interest_list = ", ".join(list(shared_interests)[:3])
            reasons.append(f"You both enjoy {interest_list}")

        if user_profile.city and candidate_profile.city and user_profile.city == candidate_profile.city:
            reasons.append(f"Both live in {user_profile.city}")

        if user_profile.relationship_goal == candidate_profile.relationship_goal:
            goal_display = user_profile.get_relationship_goal_display()
            reasons.append(f"Both looking for {goal_display}")

        shared_lifestyle = set(user_profile.lifestyle_tags or []) & set(candidate_profile.lifestyle_tags or [])
        if shared_lifestyle:
            reasons.append(f"Similar lifestyle: {', '.join(list(shared_lifestyle)[:2])}")

        if not reasons:
            reasons.append("Your profiles show complementary traits")

        return "; ".join(reasons[:3])


class CollaborativeRecommender:
    def __init__(self):
        self.model = None
        self.version = "v1.0"

    def build_interaction_matrix(self, users, profiles):
        n_users = len(users)
        n_profiles = len(profiles)
        matrix = np.zeros((n_users, n_profiles))

        user_id_map = {str(u.id): i for i, u in enumerate(users)}
        profile_id_map = {str(p.id): i for i, p in enumerate(profiles)}

        from matching.models import Like
        likes = Like.objects.all()
        for like in likes:
            user_idx = user_id_map.get(str(like.from_user_id))
            profile_user = profiles.filter(user_id=like.to_user_id).first()
            if profile_user and user_idx is not None:
                profile_idx = profile_id_map.get(str(profile_user.id))
                if profile_idx is not None:
                    matrix[user_idx][profile_idx] = 1.0 if like.is_super_like else 0.5

        from matching.models import Match
        matches = Match.objects.filter(is_active=True)
        for match in matches:
            for uid in [match.user_a_id, match.user_b_id]:
                user_idx = user_id_map.get(str(uid))
                other_id = match.user_b_id if uid == match.user_a_id else match.user_a_id
                profile = profiles.filter(user_id=other_id).first()
                if profile and user_idx is not None:
                    profile_idx = profile_id_map.get(str(profile.id))
                    if profile_idx is not None:
                        matrix[user_idx][profile_idx] = 1.0

        return matrix

    def predict_scores(self, user_idx, interaction_matrix):
        if user_idx >= interaction_matrix.shape[0]:
            return np.array([])

        user_vector = interaction_matrix[user_idx].reshape(1, -1)
        similarities = cosine_similarity(user_vector, interaction_matrix).flatten()
        scores = np.dot(similarities, interaction_matrix)
        already_interacted = interaction_matrix[user_idx] > 0
        scores[already_interacted] = -1
        scores[user_idx] = -1
        return scores
