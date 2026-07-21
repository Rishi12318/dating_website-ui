from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import os


def photo_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    return f"photos/{instance.profile.user.id}/{uuid.uuid4().hex[:12]}.{ext}"


class Interest(models.Model):
    CATEGORY_CHOICES = [
        ("hobby", "Hobby"),
        ("sport", "Sport"),
        ("music", "Music"),
        ("food", "Food"),
        ("travel", "Travel"),
        ("film", "Film & TV"),
        ("art", "Art"),
        ("tech", "Technology"),
        ("lifestyle", "Lifestyle"),
        ("values", "Values"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="hobby")

    class Meta:
        db_table = "interests"
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Profile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("NB", "Non-Binary"),
        ("O", "Other"),
    ]

    GENDER_PREF_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("NB", "Non-Binary"),
        ("O", "Other"),
        ("A", "All"),
    ]

    RELATIONSHIP_GOAL_CHOICES = [
        ("long_term", "Long-term relationship"),
        ("short_term", "Short-term dating"),
        ("friendship", "Friendship"),
        ("unsure", "Not sure yet"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=50)
    birth_date = models.DateField()
    gender = models.CharField(max_length=2, choices=GENDER_CHOICES)
    gender_preference = models.CharField(max_length=2, choices=GENDER_PREF_CHOICES, default="A")
    bio = models.TextField(max_length=500, blank=True, default="")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True, default="")
    occupation = models.CharField(max_length=100, blank=True, default="")
    education = models.CharField(max_length=200, blank=True, default="")
    height = models.PositiveIntegerField(null=True, blank=True, help_text="Height in cm")
    relationship_goal = models.CharField(max_length=20, choices=RELATIONSHIP_GOAL_CHOICES, default="unsure")
    lifestyle_tags = models.JSONField(default=list, blank=True, help_text="e.g. ['non-smoker', 'social-drinker', 'vegetarian']")
    personality_tags = models.JSONField(default=list, blank=True)
    interests = models.ManyToManyField(Interest, blank=True, related_name="profiles")
    profile_completion_score = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "profiles"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.display_name}'s profile"

    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.birth_date.year - (
            (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
        )

    def calculate_completion_score(self):
        fields = [
            self.display_name, self.birth_date, self.gender,
            self.bio, self.city, self.occupation, self.height,
            self.relationship_goal,
        ]
        filled = sum(1 for f in fields if f)
        score = int((filled / len(fields)) * 100)
        if self.interests.exists():
            score += 10
        if hasattr(self, "photos") and self.photos.exists():
            score += 10
        return min(score, 100)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        new_score = self.calculate_completion_score()
        if new_score != self.profile_completion_score:
            Profile.objects.filter(pk=self.pk).update(profile_completion_score=new_score)
            self.profile_completion_score = new_score


class Photo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to=photo_upload_path)
    is_primary = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "photos"
        ordering = ["-is_primary", "-uploaded_at"]

    def __str__(self):
        return f"Photo {self.id} for {self.profile.display_name}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            Photo.objects.filter(profile=self.profile, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
