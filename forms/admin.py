from django.contrib import admin

from .models import RockCannon, RCName, Position, MetaData, Story

# Register your models here.


class RCNameInline(admin.TabularInline):
    model = RCName
    extra = 1


class StoryInline(admin.TabularInline):
    model = Story
    extra = 1


'''
class ImageInline(admin.TabularInline):
    model = RockCannonImage
    extra = 1
'''


class PositionInline(admin.StackedInline):
    model = Position
    can_delete = False


class MetaDataInline(admin.StackedInline):
    model = MetaData
    can_delete = False


@admin.register(RockCannon)
class RockCannonAdmin(admin.ModelAdmin):
    inlines = [RCNameInline, PositionInline,
               MetaDataInline, StoryInline]
    list_display = ['__str__', 'slug', 'created_at']
    prepopulated_fields = {'slug': []}
    readonly_fields = ['created_at', 'updated_at']
