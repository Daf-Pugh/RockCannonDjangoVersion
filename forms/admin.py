from django.contrib import admin

from .models import RockCannon, Position, MetaData, Story, RockCannonImage

# Register your models here.


class StoryInline(admin.TabularInline):
    model = Story
    extra = 1


class ImageInline(admin.TabularInline):
    model = RockCannonImage
    extra = 1


class PositionInline(admin.StackedInline):
    model = Position
    can_delete = False


class MetaDataInline(admin.StackedInline):
    model = MetaData
    can_delete = False


@admin.register(RockCannon)
class RockCannonAdmin(admin.ModelAdmin):
    inlines = [PositionInline, MetaDataInline,
               StoryInline, ImageInline]
    list_display = ['__str__', 'name', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']

    class Media:
        css = {
            'all': ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css']
        }
        js = [
            # 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            # 'forms/js/geodesy-loader.js',
            'forms/js/admin.js',
        ]
