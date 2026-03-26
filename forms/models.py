from django.db import models

# Create your models here.
# RockCannon
#   - Attributes
#
#       -Name
#
#       -AssetFilePath
#
#       -Lat -Lon
#
#       -MetaData
#           -HoleCount
#           -Connectedness
#
#       -Lore/Story


class RockCannon(models.Model):
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        primary_name = self.names.filter(language='en').first()
        return primary_name.name if primary_name else f"RockCannon #{self.pk}"

    class Meta:
        verbose_name = "Rock Cannon"
        verbose_name_plural = "Rock Cannons"


class RCName(models.Model):
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.CASCADE, related_name='names'
    )
    name = models.CharField(max_length=255)
    language = models.CharField(max_length=10)  # e.g. 'en', 'cy', 'gd'

    def __str__(self):
        return f"{self.name} ({self.language})"

    class Meta:
        verbose_name = "RC Name"


class Position(models.Model):
    rock_cannon = models.OneToOneField(
        RockCannon, on_delete=models.CASCADE, related_name='position'
    )
    # Latitude & Longitude
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    # UK Ordinance Survey Grid Referance
    #  SH  |  58324  |   72394
    # GRID | EASTING | NORTHING
    os_grid = models.CharField(max_length=3, null=True, blank=True)
    os_easting = models.IntegerField(null=True, blank=True)
    os_northing = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Position for {self.rock_cannon}"


class MetaData(models.Model):
    rock_cannon = models.OneToOneField(
        RockCannon, on_delete=models.CASCADE, related_name='metadata'
    )
    # Find if we want this to accept ranges as opposed to a fixed number due to
    # uncertainty due to them being covered
    # Connectedness How to represent this matrix ???
    # yes or no bool
    # ask about how it ought to be defaulted too ???
    # publicallu accesible
    hole_count = models.IntegerField(null=True, blank=True)
    is_on_private_land = models.BooleanField(default=False)

    def __str__(self):
        return f"Metadata for {self.rock_cannon}"

    class Meta:
        verbose_name = "Metadata"


class Story(models.Model):
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.CASCADE, related_name='stories'
    )
    story_text = models.TextField()
    language = models.CharField(max_length=10)

    def __str__(self):
        return f"Story ({self.language}) for {self.rock_cannon}"

    class Meta:
        verbose_name_plural = "Stories"


'''
class RockCannonImage(models.Model):
    rock_cannon = models.ForeignKey(
        RockCannon, on_delete=models.CASCADE, related_name='images'
    )
    # image_url = models.URLField(max_length=500)
    image = models.ImageField(upload_to='rock_cannons/', null=True)
    caption = models.CharField(max_length=255, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.rock_cannon}"
'''
