from django.urls import path
from . import views

urlpatterns = [
    path("", views.ProfileCreateUpdateView.as_view(), name="profile"),
    path("list/", views.ProfileListView.as_view(), name="profile_list"),
    path("<uuid:pk>/", views.ProfileDetailView.as_view(), name="profile_detail"),
    path("photos/upload/", views.PhotoUploadView.as_view(), name="photo_upload"),
    path("photos/<uuid:photo_id>/set-primary/", views.set_primary_photo, name="set_primary_photo"),
    path("photos/<uuid:pk>/delete/", views.PhotoDeleteView.as_view(), name="photo_delete"),
    path("interests/", views.InterestListView.as_view(), name="interest_list"),
    path("interests/create/", views.InterestCreateView.as_view(), name="interest_create"),
]
