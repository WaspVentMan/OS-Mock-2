from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse

from django.views.generic import TemplateView

class HomePageView(TemplateView):
	template_name = "index.html"

class SettingsPageView(TemplateView):
	template_name = "settings.html"