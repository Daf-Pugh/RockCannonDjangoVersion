from django.urls import path
from . import views

urlpatterns = [
    path("rockcannon/<slug:slug>/",
         views.rock_cannon_detail,
         name="rock_cannon_detail"
         ),
]

