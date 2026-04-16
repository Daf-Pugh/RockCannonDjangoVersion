import pandas as pd
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction

from forms.models import RockCannon, Position, MetaData, Story


def parse_int(value):
    return int(value) if pd.notna(value) else None


def parse_status(value):
    val = str(value).strip().lower()
    if val in ["yes", "no", "some"]:
        return val
    return None


def generate_unique_slug(base_slug):
    slug = base_slug
    counter = 1

    while RockCannon.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


class Command(BaseCommand):
    help = "Import rock cannons from Excel file"

    def add_arguments(self, parser):
        parser.add_argument('file', type=str, help='Path to Excel file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file']

        df = pd.read_excel(file_path)

        with transaction.atomic():
            for _, row in df.iterrows():
                # Create slug
                notUniqueSlug = slugify(f"{row['Name']}-{row['Grid Ref']}")
                slug = generate_unique_slug(notUniqueSlug)

                print(slug)
                # Create RockCannon
                rock = RockCannon.objects.create(
                    slug=slug,
                    name=row.get('Name')
                )

                # Create Position
                Position.objects.create(
                    rock_cannon=rock,
                    grid_ref=row.get('Grid Ref'),
                )

                # Create Metadata
                MetaData.objects.create(
                    rock_cannon=rock,
                    hole_count=parse_int(row.get('Holes')),
                    is_on_private_land=None,  # adjust if needed
                    has_channels=parse_status(row.get('Status'))
                )

                # Create Story
                if pd.notna(row.get('Story')):
                    Story.objects.create(
                        rock_cannon=rock,
                        story_text=row.get('Story')
                    )

        self.stdout.write(self.style.SUCCESS("Import completed successfully"))
