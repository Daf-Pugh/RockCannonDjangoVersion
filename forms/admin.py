from django.contrib import admin
from django.utils.html import format_html
from .models import RockCannon, Position, MetaData, Story, RockCannonImage, GalleryItem, GalleryPage, HomePage


def flag_duplicates(modeladmin, request, queryset):
    from django.contrib import messages
    seen = {}
    dupes = []
    for cannon in queryset.select_related('position'):
        try:
            key = (cannon.position.latitude, cannon.position.longitude)
            if key in seen:
                dupes.append(cannon.name)
            else:
                seen[key] = cannon
        except Exception:
            pass
    if dupes:
        messages.warning(request, f'Possible duplicates: {", ".join(dupes)}')


flag_duplicates.short_description = 'Flag duplicate locations'


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
    def get_image(self, obj):
        img = obj.images.first()
        if img:
            return format_html('<img src="{}" style="height: 50px; border-radius: 4px;">', img.image.url)
        return '—'
    get_image.short_description = 'Image'

    def get_lat(self, obj):
        try:
            return obj.position.latitude
        except Exception:
            return None
    get_lat.short_description = 'Latitude'
    get_lat.admin_order_field = 'position__latitude'

    def get_lng(self, obj):
        try:
            return obj.position.longitude
        except Exception:
            return None
    get_lng.short_description = 'Longitude'
    get_lng.admin_order_field = 'position__longitude'

    def get_story(self, obj):
        story = obj.stories.first()
        if story:
            return story.story_text[:50] + '...' if len(story.story_text) > 50 else story.story_text
        return '—'
    get_story.short_description = 'Story'
    search_fields = [
        'name',
        'slug',
        'position__grid_ref',
        'stories__story_text',
    ]
    list_display = [
        'name',
        'slug',
        'get_lat',
        'get_lng',
        'get_image',
        'get_story',
    ]
    ordering = ['position__latitude', 'position__longitude']
    actions = ['delete_selected', flag_duplicates]
    inlines = [PositionInline, MetaDataInline,
               StoryInline, ImageInline]
    # list_display = ['__str__', 'name', 'created_at']
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


class GalleryItemInline(admin.TabularInline):
    model = GalleryItem
    extra = 1


@admin.register(GalleryPage)
class GalleryPageAdmin(admin.ModelAdmin):
    inlines = [GalleryItemInline]


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active']
    list_editable = ['is_active']
