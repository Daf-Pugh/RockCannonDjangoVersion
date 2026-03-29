from modeltranslation.translator import register, TranslationOptions
from .models import RockCannon, Story


@register(RockCannon)
class RockCannonTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Story)
class StoryTranslationOptions(TranslationOptions):
    fields = ('story_text',)
