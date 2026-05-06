from django.db import models
from OSGridConverter import latlong2grid, grid2latlong
from googletrans import Translator
from django.contrib.auth.models import User


class RockCannon(models.Model):
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name or self.slug

    class Meta:
        verbose_name = "Rock Cannon"
        verbose_name_plural = "Rock Cannons"


class Position(models.Model):
    rock_cannon = models.OneToOneField(
        RockCannon, on_delete=models.CASCADE, related_name="position")
    grid_ref = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)

# Kinda pointless now but it'll help for the xlsx import i think the JS geodesy thing does this now
    def save(self, *args, **kwargs):
        has_grid = bool(self.grid_ref)
        has_coords = self.latitude is not None and self.longitude is not None
        if has_grid and not has_coords:
            try:
                p = grid2latlong(self.grid_ref)
                self.latitude = p.latitude
                self.longitude = p.longitude
            except Exception:
                pass
        if has_coords and not has_grid:
            print("SAVE CALLED")
            try:
                grid = latlong2grid(float(self.latitude),
                                    float(self.longitude))
                self.grid_ref = grid
            except Exception:
                pass

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rock_cannon} ({self.grid_ref or 'No grid'})"


class MetaData(models.Model):

    class Status(models.TextChoices):
        YES = "yes", "Yes"
        NO = "no", "No"
        SOME = "some", "Some"

    rock_cannon = models.OneToOneField(
        RockCannon, on_delete=models.CASCADE, related_name='metadata'
    )
    hole_count = models.IntegerField(null=True, blank=True)
    is_on_private_land = models.BooleanField(
        null=True,
        blank=True
    )
    has_channels = models.CharField(
        max_length=10,
        choices=Status.choices,
        null=True,
        blank=True,
        help_text="These are the field values used in the Book The Rock Cannon of Gwynedd"
    )

#    def __str__(self):
#        return f"Metadata for {self.rock_cannon}"

    class Meta:
        verbose_name = "Metadata"


class Story(models.Model):
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.CASCADE, related_name='stories'
    )
    story_text = models.TextField(
        help_text="This field will auto-translate into welsh when you save \n(Using Google Translate | Please check for correctness)"
    )

    def save(self, *args, **kwargs):
        if self.story_text and not self.story_text_cy:
            try:
                translator = Translator()
                self.story_text_cy = translator.translate(
                    self.story_text, dest='cy').text
            except Exception:
                pass
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Stories"


class RockCannonImage(models.Model):
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to='rock_cannons/', null=True)
    caption = models.CharField(max_length=255, null=True, blank=True)
    credit = models.CharField(max_length=255, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"Image for {self.rock_cannon}"


class HomePage(models.Model):
    title = models.CharField(max_length=200)
    intro_text = models.TextField(blank=True)
    content_title = models.CharField(max_length=200, blank=True)
    content_subtitle_1 = models.CharField(max_length=200, blank=True)
    content_paragraph_1 = models.TextField(blank=True)
    content_subtitle_2 = models.CharField(max_length=200, blank=True)
    content_paragraph_2 = models.TextField(blank=True)
    is_active = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_active:
            # deactivate all others when this one is set active
            HomePage.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} {'(active)' if self.is_active else ''}"

    class Meta:
        verbose_name = 'Home Page'


class GalleryPage(models.Model):
    title = models.CharField(max_length=200)
    intro_text = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return 'Gallery Page'

    class Meta:
        verbose_name = 'Gallery Page'


class GalleryItem(models.Model):
    gallery = models.ForeignKey(
        GalleryPage, on_delete=models.CASCADE, related_name='items')
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.rock_cannon.name if self.rock_cannon else 'No cannon'}"
