from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('rockcannon/<slug:slug>/', views.rock_cannon_detail,
         name='rock_cannon_detail'),
]
