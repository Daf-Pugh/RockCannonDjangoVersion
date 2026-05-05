from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from .models import RockCannon, RockCannonImage
from .forms import ImageUploadForm
import json

# Create your views here.


def rock_cannon_home(request):
    return render(request, 'forms/rock_cannon_home.html')


def rock_cannon_detail(request, slug):
    rock_cannon = get_object_or_404(RockCannon, slug=slug)
    rock_cannons = RockCannon.objects.all().select_related('position', 'metadata')

    def tryExcept(rc):
        try:
            return rc.metadata
        except Exception:
            return None
    rock_cannons_json = [
        {
            'name': rock_cannon.name,
            'slug': rock_cannon.slug,
            'lat': rock_cannon.position.latitude if hasattr(rock_cannon, 'position') else None,
            'lng': rock_cannon.position.longitude if hasattr(rock_cannon, 'position') else None,
            'has_channels': tryExcept(rock_cannon).has_channels if tryExcept(rock_cannon) else None,
            'hole_count': tryExcept(rock_cannon).hole_count if tryExcept(rock_cannon) else None,
            'is_private': tryExcept(rock_cannon).is_on_private_land if tryExcept(rock_cannon) else None,
        }
        for rock_cannon in rock_cannons
    ]
    if request.method == 'POST' and request.user.is_authenticated:
        upload_form = ImageUploadForm(request.POST, request.FILES)
        if upload_form.is_valid():
            img = upload_form.save(commit=False)
            img.rock_cannon = rock_cannon
            img.uploaded_by = request.user
            img.credit = request.user.username
            img.save()
            return redirect('rock_cannon_detail', slug=slug)
    else:
        upload_form = ImageUploadForm()

    context = {
        'rock_cannon': rock_cannon,
        'stories': rock_cannon.stories.all(),
        'rock_cannons': rock_cannons,
        'rock_cannons_json': rock_cannons_json,
        'upload_form': upload_form,
    }
    return render(request, "forms/rock_cannon_detail.html", context)


def rock_cannon_search(request):
    rock_cannons = RockCannon.objects.all().select_related('position', 'metadata')

    def tryExcept(rc):
        try:
            return rc.metadata
        except Exception:
            return None
    rock_cannons_json = [
        {
            'name': rock_cannon.name,
            'slug': rock_cannon.slug,
            'lat': rock_cannon.position.latitude if hasattr(rock_cannon, 'position') else None,
            'lng': rock_cannon.position.longitude if hasattr(rock_cannon, 'position') else None,
            'has_channels': tryExcept(rock_cannon).has_channels if tryExcept(rock_cannon) else None,
            'hole_count': tryExcept(rock_cannon).hole_count if tryExcept(rock_cannon) else None,
            'is_private': tryExcept(rock_cannon).is_on_private_land if tryExcept(rock_cannon) else None,
        }
        for rock_cannon in rock_cannons
    ]
    context = {
        'rock_cannons': rock_cannons,
        'rock_cannons_json': rock_cannons_json,
    }
    return render(request, "forms/rock_cannon_search.html", context)


def rock_cannon_gallery(request):
    # images = RockCannonImage.objects.all().select_related('rock_cannon')
    context = {
        # 'images': images,
    }
    return render(request, 'forms/rock_cannon_gallery.html', context)


def register(request):
    if request.method == 'POST':
        register_form = UserCreationForm(request.POST)
        if register_form.is_valid():
            user = register_form.save()
            login(request, user)
            return redirect('/')
    else:
        register_form = UserCreationForm()
    return render(request, 'forms/rock_cannon_create_account.html', {'register_form': register_form})
