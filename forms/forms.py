from django import forms
from .models import RockCannonImage, Story


class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = RockCannonImage
        fields = ['image', 'caption', 'credit']


class StoryUploadForm(forms.ModelForm):
    class Meta:
        model = Story
        fields = ['story_text']
