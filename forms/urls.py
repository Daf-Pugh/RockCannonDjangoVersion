from . import views
from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='forms/rock_cannon_login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('register/', views.register, name='register'),
    path('', views.rock_cannon_home, name='rock_cannon_home'),
    path('gallery/', views.rock_cannon_gallery,
         name='rock_cannon_gallery'),
    path('search/', views.rock_cannon_search,
         name='rock_cannon_search'),
    path('<slug:slug>/', views.rock_cannon_detail,
         name='rock_cannon_detail'),
]
