from django.urls import path
from . import views

urlpatterns = [
    path('', views.rock_cannon_home, name='rock_cannon_home'),
    path('gallery/', views.rock_cannon_gallery,
         name='rock_cannon_gallery'),
    path('search/', views.rock_cannon_search,
         name='rock_cannon_search'),
    path('<slug:slug>/', views.rock_cannon_detail,
         name='rock_cannon_detail'),
]