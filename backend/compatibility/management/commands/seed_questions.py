from django.core.management.base import BaseCommand
from compatibility.models import CompatibilityQuestion


QUESTIONS = [
    {"text": "How important is honesty in a relationship?", "category": "values", "weight": 1.5, "order": 1},
    {"text": "How important is financial stability in a partner?", "category": "values", "weight": 1.2, "order": 2},
    {"text": "How important is family in your life?", "category": "values", "weight": 1.3, "order": 3},
    {"text": "How important is personal growth and self-improvement?", "category": "values", "weight": 1.1, "order": 4},
    {"text": "How important is shared religious or spiritual beliefs?", "category": "values", "weight": 1.0, "order": 5},

    {"text": "How often do you prefer to communicate with your partner?", "category": "communication", "weight": 1.2, "order": 6},
    {"text": "Do you prefer to talk through problems immediately or take time to think?", "category": "communication", "weight": 1.3, "order": 7},
    {"text": "How important is verbal affirmation to you?", "category": "communication", "weight": 1.1, "order": 8},
    {"text": "How comfortable are you expressing emotions?", "category": "communication", "weight": 1.0, "order": 9},

    {"text": "How do you handle disagreements?", "category": "conflict", "weight": 1.4, "order": 10},
    {"text": "Can you admit when you are wrong?", "category": "conflict", "weight": 1.3, "order": 11},
    {"text": "How important is it to resolve conflicts the same day?", "category": "conflict", "weight": 1.0, "order": 12},
    {"text": "Do you believe in compromise or standing your ground?", "category": "conflict", "weight": 1.2, "order": 13},

    {"text": "How important is physical touch to you?", "category": "love_language", "weight": 1.1, "order": 14},
    {"text": "How important is receiving gifts?", "category": "love_language", "weight": 0.8, "order": 15},
    {"text": "How important is quality time together?", "category": "love_language", "weight": 1.3, "order": 16},
    {"text": "How important are acts of service?", "category": "love_language", "weight": 1.0, "order": 17},

    {"text": "How active do you prefer your weekends to be?", "category": "lifestyle", "weight": 0.9, "order": 18},
    {"text": "How do you feel about nightlife and socializing?", "category": "lifestyle", "weight": 0.8, "order": 19},
    {"text": "How important is maintaining a fitness routine?", "category": "lifestyle", "weight": 0.9, "order": 20},
    {"text": "How do you feel about work-life balance?", "category": "lifestyle", "weight": 1.1, "order": 21},

    {"text": "How ambitious are you about your career?", "category": "ambition", "weight": 1.0, "order": 22},
    {"text": "Do you want to start a business someday?", "category": "ambition", "weight": 0.8, "order": 23},
    {"text": "How important is your partner supporting your goals?", "category": "ambition", "weight": 1.2, "order": 24},
    {"text": "Where do you see yourself in 5 years?", "category": "ambition", "weight": 1.1, "order": 25},
]


class Command(BaseCommand):
    help = "Seed compatibility questions"

    def handle(self, *args, **options):
        created_count = 0
        for q_data in QUESTIONS:
            _, created = CompatibilityQuestion.objects.get_or_create(
                text=q_data["text"],
                defaults={
                    "category": q_data["category"],
                    "weight": q_data["weight"],
                    "order": q_data["order"],
                    "question_type": "scale_1_5",
                },
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {created_count} compatibility questions"))
