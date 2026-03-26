from django.shortcuts import render, get_object_or_404
from .models import RockCannon
from django.http import HttpResponse

# Create your views here.


def index(request):
    return HttpResponse(
        "<h1>Test from forms application in Rock-Cannon-Tracker-Application Site</h1>"
    )


def rock_cannon_detail(request, slug):
    rock_cannon = get_object_or_404(RockCannon, slug=slug)
    context = {
        'rock_cannon': rock_cannon,
        'names': rock_cannon.names.all(),
        'stories': rock_cannon.stories.all(),
    }
    return render(request, "forms/rock_cannon_detail.html", context)
