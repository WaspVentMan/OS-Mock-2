from django.urls import path
from .views import *

urlpatterns = [
    path("", HomePageView.as_view(), name="home"),
    path("settings", SettingsPageView.as_view(), name="settings")
]
