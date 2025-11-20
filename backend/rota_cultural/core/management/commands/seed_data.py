from django.core.management.base import BaseCommand
from django.core.management import call_command
import os


class Command(BaseCommand):
    help = 'Load initial seed data for the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Loading initial seed data...'))

        fixtures_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'fixtures')

        try:
            # Load categories first
            categories_file = os.path.join(fixtures_dir, 'categories.json')
            if os.path.exists(categories_file):
                call_command('loaddata', categories_file)
                self.stdout.write(self.style.SUCCESS('Categories loaded successfully'))

            # Load locations
            locations_file = os.path.join(fixtures_dir, 'locations.json')
            if os.path.exists(locations_file):
                call_command('loaddata', locations_file)
                self.stdout.write(self.style.SUCCESS('Locations loaded successfully'))

            self.stdout.write(self.style.SUCCESS('All seed data loaded successfully!'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading seed data: {str(e)}'))
            raise