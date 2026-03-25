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


class Position(models.Model):
    # Latitude & Longitude
    Lat = models.FloatField()
    Lon = models.FloatField()
    # UK Ordinance Survey Grid Referance
    #  SH  |  58324  |   72394
    # GRID | EASTING | NORTHING
    OSGrid = models.CharField(max_length=2)
    OSEasting = models.IntegerField()
    OSNorthing = models.IntegerField()

    def __str__(self):
        out = f"{self.Lat}, {self.Lon}"
        return out


class RCName(models.Model):
    RockCannonID = models.ForeignKey(Position, on_delete=models.RESTRICT)
    Name = models.CharField(max_length=200)
    LangTag = models.CharField(max_length=2)

#    def __str__(self):
#        return self.Name

#    def language(self):
#        return self.LangTag


class MetaData(models.Model):
    RockCannonID = models.ForeignKey(Position, on_delete=models.RESTRICT)
    # Find if we want this to accept ranges as opposed to a fixed number due to
    # uncertainty due to them being covered
    HoleCount = models.IntegerField()
    # Connectedness How to represent this matrix ???
    # yes or no bool
    # ask about how it ought to be defaulted too ???
    # publicallu accesible
    IsOnPrivateLand = models.BooleanField()


class Story(models.Model):
    RockCannonID = models.ForeignKey(Position, on_delete=models.RESTRICT)
    Story = models.TextField()
    LangTag = models.CharField(max_length=2)
