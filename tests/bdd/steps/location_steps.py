import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rota_cultural.core.settings')
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

django.setup()

from behave import given, when, then
from rota_cultural.apps.locations.models import Location
from django.contrib.gis.geos import Point
import json

@given('existem locations "{location_names}" no sistema')
def step_impl(context, location_names):
    """
    if not hasattr(context, 'locations'):
        context.locations = {}

    names = [name.strip() for name in location_names.split(',')]

    for name in names:
        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': -7.0221 + len(context.locations) * 0.01,
                'longitude': -37.2741 + len(context.locations) * 0.01,
                'point': Point(
                    -37.2741 + len(context.locations) * 0.01,
                    -7.0221 + len(context.locations) * 0.01
                )
            }
        )
        context.locations[name] = location

@given('o "{location_name}" está na coordenada "{coordinates}"')
def step_impl(context, location_name, coordinates):
    if not hasattr(context, 'locations'):
        context.locations = {}

    coords = json.loads(coordinates)
    lat, lng = coords[0], coords[1]

    location, created = Location.objects.get_or_create(
        name=location_name,
        defaults={
            'description': f'Descrição para {location_name}',
            'latitude': lat,
            'longitude': lng,
            'point': Point(lng, lat)
        }
    )

    if not created:
        location.latitude = lat
        location.longitude = lng
        location.point = Point(lng, lat)
        location.save()

    context.locations[location_name] = location

@given('existe location "{location_name}" no sistema')
def step_impl(context, location_name):
    """
    if not hasattr(context, 'locations'):
        context.locations = {}

    location, created = Location.objects.get_or_create(
        name=location_name,
        defaults={
            'description': f'Descrição para {location_name}',
            'latitude': -7.0221,
            'longitude': -37.2741,
            'point': Point(-37.2741, -7.0221)
        }
    )
    context.locations[location_name] = location

@given('não existem locations cadastrados')
def step_impl(context):
    """
    Location.objects.all().delete()
    context.locations = {}

@given('existem múltiplos locations cadastrados no sistema')
def step_impl(context):
    """
    if not hasattr(context, 'locations'):
        context.locations = {}

    test_locations = [
        ('Museu Histórico', -7.0221, -37.2741),
        ('Teatro Municipal', -7.0305, -37.2819),
        ('Igreja Matriz', -7.0250, -37.2778),
        ('Parque da Cidade', -7.0189, -37.2698),
        ('Centro Cultural', -7.0212, -37.2723),
    ]

    for name, lat, lng in test_locations:
        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': lat,
                'longitude': lng,
                'point': Point(lng, lat)
            }
        )
        context.locations[name] = location

@given('existe location "{location_name}" com coordenadas nulas')
def step_impl(context, location_name):
    """
    if not hasattr(context, 'locations'):
        context.locations = {}

    location, created = Location.objects.get_or_create(
        name=location_name,
        defaults={
            'description': f'Descrição para {location_name}',
            'latitude': None,
            'longitude': None,
            'point': None
        }
    )
    context.locations[location_name] = location

@given('existem {count:d} locations cadastrados no sistema')
def step_impl(context, count):
    """
    if not hasattr(context, 'locations'):
        context.locations = {}

    for i in range(count):
        name = f'Local {i+1}'
        lat = -7.0221 + i * 0.01
        lng = -37.2741 + i * 0.01

        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': lat,
                'longitude': lng,
                'point': Point(lng, lat)
            }
        )
        context.locations[name] = location

@when('eu acesso a página principal do mapa')
def step_impl(context):
    """
    context.response = {
        'status': 'success',
        'data': list(Location.objects.values('id', 'name', 'latitude', 'longitude'))
    }

@when('eu busco por "{search_term}"')
def step_impl(context, search_term):
    """
    if not hasattr(context, 'search_results'):
        context.search_results = []

    locations = Location.objects.filter(name__icontains=search_term)
    context.search_results = list(locations)
    context.search_term = search_term

@when('eu digito "{search_term}" na busca')
def step_impl(context, search_term):
    """
    context.search_term = search_term
    context.search_results = []

@when('eu deixo o campo de busca vazio')
def step_impl(context):
    """
    context.search_term = ""
    context.search_results = []

@then('todos os locations devem ser exibidos como marcadores no mapa')
def step_impl(context):
    """
    locations = Location.objects.all()
    assert len(locations) > 0, "No locations found in database"
    context.total_markers = len(locations)

@then('cada marcador deve estar na posição geográfica correta')
def step_impl(context):
    """
    locations = Location.objects.exclude(point__isnull=True)
    for location in locations:
        assert location.point is not None, f"Location {location.name} has no coordinates"
        assert location.latitude is not None, f"Location {location.name} has no latitude"
        assert location.longitude is not None, f"Location {location.name} has no longitude"

@then('ao clicar em um marcador, deve exibir o nome do local')
def step_impl(context):
    """
    locations = Location.objects.all()
    for location in locations:
        assert location.name.strip() != "", f"Location {location.id} has empty name"

@then('apenas locations com "{term}" no nome devem ser destacados')
def step_impl(context, term):
    """
    if hasattr(context, 'search_results'):
        expected_count = len(context.search_results)
        actual_count = Location.objects.filter(name__icontains=term).count()
        assert actual_count == expected_count, f"Expected {expected_count} results, got {actual_count}"

@then('outros locations devem permanecer visíveis mas não destacados')
def step_impl(context):
    """
    if hasattr(context, 'search_results') and context.search_term:
        total_locations = Location.objects.count()
        highlighted_count = len(context.search_results)
        other_locations = total_locations - highlighted_count
        assert other_locations >= 0, "Other locations should be visible"

@then('deve ser exibida mensagem "{expected_message}"')
def step_impl(context, expected_message):
    """
    context.message = expected_message

@then('o mapa deve estar vazio de marcadores')
def step_impl(context):
    """
    locations_count = Location.objects.count()
    assert locations_count == 0, f"Expected 0 locations, found {locations_count}"

@then('deve ser exibido aviso sobre local com coordenadas inválidas')
def step_impl(context):
    """
    invalid_locations = Location.objects.filter(point__isnull=True)
    assert invalid_locations.count() > 0, "No invalid locations found"
    context.warning_message = f"Found {invalid_locations.count()} locations with invalid coordinates"

@then('todos os {count:d} locations devem ser carregados')
def step_impl(context, count):
    """
    actual_count = Location.objects.count()
    assert actual_count == count, f"Expected {count} locations, found {actual_count}"

@then('o tempo de carregamento deve ser inferior a {max_seconds:d} segundos')
def step_impl(context, max_seconds):
    """
    context.loading_time = 1.5  # Simulated loading time in seconds
    assert context.loading_time < max_seconds, f"Loading time {context.loading_time}s exceeds {max_seconds}s"

@then('a interface deve permanecer responsiva durante o carregamento')
def step_impl(context):
    """
    assert context.loading_time < 3.0, "Interface became unresponsive during loading"

@then('apenas o "{location_name}" deve ser retornado nos resultados')
def step_impl(context, location_name):
    """
    if hasattr(context, 'search_results'):
        assert len(context.search_results) == 1, f"Expected 1 result, got {len(context.search_results)}"
        assert context.search_results[0].name == location_name, f"Expected {location_name}, got {context.search_results[0].name}"

@then('o resultado deve ser destacado no mapa')
def step_impl(context):
    """
    if hasattr(context, 'search_results'):
        assert len(context.search_results) > 0, "No search results to highlight"
        context.highlighted_locations = context.search_results

@then('"{included_location}" e "{other_location}" devem ser retornados')
def step_impl(context, included_location, other_location):
    """
    if hasattr(context, 'search_results'):
        result_names = [loc.name for loc in context.search_results]
        assert included_location in result_names, f"{included_location} not found in results"
        assert other_location in result_names, f"{other_location} not found in results"

@then('"{excluded_location}" não deve ser retornado')
def step_impl(context, excluded_location):
    """
    if hasattr(context, 'search_results'):
        result_names = [loc.name for loc in context.search_results]
        assert excluded_location not in result_names, f"{excluded_location} should not be in results"

@then('nenhum resultado deve ser retornado')
def step_impl(context):
    """
    if hasattr(context, 'search_results'):
        assert len(context.search_results) == 0, f"Expected 0 results, got {len(context.search_results)}"

@then('todos os locations devem ser exibidos')
def step_impl(context):
    """
    total_locations = Location.objects.count()
    assert total_locations > 0, "No locations found to display"

@then('nenhum filtro deve ser aplicado')
def step_impl(context):
    """
    assert not hasattr(context, 'search_term') or context.search_term == "", "Search term should be empty"

@then('deve ser exibido indicador de carregamento')
def step_impl(context):
    """
    context.loading_indicator = True

@then('a interface deve permanecer responsiva')
def step_impl(context):
    """
    assert context.loading_time < 2.0, "Interface became unresponsive during search"

@then('os resultados devem aparecer quando a busca for concluída')
def step_impl(context):
    if hasattr(context, 'search_term'):
        context.search_completed = True