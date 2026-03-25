from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def index(request):
    return HttpResponse("<h1>Test from forms application in Rock-Cannon-Tracker-Application Site")
