from django import forms
from .models import RockCannonImage


class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = RockCannonImage
        fields = ['image', 'caption']
