from django.db import models
from OSGridConverter import latlong2grid, grid2latlong
from googletrans import Translator


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
    story_text = models.TextField()

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
    # image_url = models.URLField(max_length=500)
    image = models.ImageField(upload_to='rock_cannons/', null=True)
    caption = models.CharField(max_length=255, null=True, blank=True)
    credit = models.CharField(max_length=255, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.rock_cannon}"
