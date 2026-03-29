from django.shortcuts import render, get_object_or_404
from .models import RockCannon

# Create your views here.


def index(request):
    return render(request, 'forms/index.html')


def rock_cannon_detail(request, slug):
    rock_cannon = get_object_or_404(RockCannon, slug=slug)
    context = {
        'rock_cannon': rock_cannon,
        'stories': rock_cannon.stories.all(),
    }
    return render(request, "forms/rock_cannon_detail.html", context)
