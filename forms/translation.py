from modeltranslation.translator import register, TranslationOptions
from .models import RockCannon, Story, HomePage, GalleryPage


@register(RockCannon)
class RockCannonTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Story)
class StoryTranslationOptions(TranslationOptions):
    fields = ('story_text',)


@register(HomePage)
class HomePageAdminTranslationOptions(TranslationOptions):
    fields = ('title', 'intro_text', 'content_title', 'content_subtitle_1',
              'content_paragraph_1', 'content_subtitle_2', 'content_paragraph_2',)


# @register(GalleryPage)
# class GalleryPageAdminTranslationOptions(TranslationOptions):
#     fields = ('',)
