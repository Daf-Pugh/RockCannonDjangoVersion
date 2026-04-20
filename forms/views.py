from django.shortcuts import render, get_object_or_404
from .models import RockCannon
import json

# Create your views here.


def rock_cannon_home(request):
    return render(request, 'forms/rock_cannon_home.html')


def rock_cannon_detail(request, slug):
    rock_cannon = get_object_or_404(RockCannon, slug=slug)
    rock_cannons = RockCannon.objects.all().select_related('position')
    rock_cannons_json = [
        {
            'name': rock_cannon.name,
            'slug': rock_cannon.slug,
            'lat': rock_cannon.position.latitude
            if hasattr(rock_cannon, 'position') else None,
            'lng': rock_cannon.position.longitude
            if hasattr(rock_cannon, 'position') else None,

        }
        for rock_cannon in rock_cannons
    ]
    context = {
        'rock_cannon': rock_cannon,
        'stories': rock_cannon.stories.all(),
        'rock_cannons': rock_cannons,
        'rock_cannons_json': rock_cannons_json,
    }
    return render(request, "forms/rock_cannon_detail.html", context)


def rock_cannon_search(request):
    rock_cannons = RockCannon.objects.all().select_related('position')
    rock_cannons_json = [
        {
            'name': rock_cannon.name,
            'slug': rock_cannon.slug,
            'lat': rock_cannon.position.latitude
            if hasattr(rock_cannon, 'position') else None,
            'lng': rock_cannon.position.longitude
            if hasattr(rock_cannon, 'position') else None,

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
