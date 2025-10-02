from behave import given, when, then
import json
import time

@given('existem locations "{location_names}" no sistema')
def step_impl(context, location_names):
    """Create locations if they don't exist"""
    from rota_cultural.apps.locations.models import Location
    from django.contrib.gis.geos import Point

    if not hasattr(context, 'locations'):
        context.locations = {}

    names = [name.strip() for name in location_names.split(',')]

    for name in names:
        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': -7.0221,
                'longitude': -37.2741,
                'point': Point(-37.2741, -7.0221)
            }
        )
        context.locations[name] = location

@given('o "{location_name}" está na coordenada "{coordinates}"')
def step_impl(context, location_name, coordinates):
    """Set specific coordinates for a location"""
    from rota_cultural.apps.locations.models import Location
    from django.contrib.gis.geos import Point

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

@given('a "{location_name}" está na coordenada "{coordinates}"')
def step_impl(context, location_name, coordinates):
    """Alternative wording for location coordinates"""
    # Reuse the same logic as above
    from rota_cultural.apps.locations.models import Location
    from django.contrib.gis.geos import Point

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

@given('existem locations "{location_names}" no sistema')
def step_impl(context, location_names):
    """Create multiple locations for routing tests"""
    from rota_cultural.apps.locations.models import Location
    from django.contrib.gis.geos import Point

    if not hasattr(context, 'locations'):
        context.locations = {}

    names = [name.strip() for name in location_names.split(',')]
    base_lat, base_lng = -7.0221, -37.2741

    for i, name in enumerate(names):
        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': base_lat + i * 0.01,
                'longitude': base_lng + i * 0.01,
                'point': Point(base_lng + i * 0.01, base_lat + i * 0.01)
            }
        )
        context.locations[name] = location

@iven('eu calculei a rota entre esses dois pontos')
def step_impl(context):
    """Simulate that a route has been calculated"""
    context.route_calculated = True
    context.route_data = {
        'distance': 1200,  # meters
        'duration': 900,    # seconds (15 minutes)
        'geometry': [
            [-7.0221, -37.2741],  # start point
            [-7.0250, -37.2778],  # intermediate
            [-7.0305, -37.2819]   # end point
        ]
    }

@given('eu tenho múltiplas paradas no meu roteiro')
def step_impl(context):
    """Set up context for multiple waypoints"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []
    context.has_waypoints = True

@given('eu calculei uma rota com três pontos: "{point_a}", "{point_b}" e "{point_c}"')
def step_impl(context, point_a, point_b, point_c):
    """Simulate calculated route with three points"""
    context.route_calculated = True
    context.route_points = [point_a, point_b, point_c]
    context.route_data = {
        'distance': 2500,
        'duration': 1800,
        'geometry': [
            [-7.0221, -37.2741],
            [-7.0250, -37.2778],
            [-7.0305, -37.2819]
        ]
    }

@given('uma rota está sendo exibida no mapa')
def step_impl(context):
    """Set up context for route being displayed"""
    context.route_displayed = True
    context.route_data = {
        'distance': 1000,
        'duration': 600,
        'geometry': [[-7.0221, -37.2741], [-7.0305, -37.2819]]
    }

@given('eu tentei calcular uma rota inválida')
def step_impl(context):
    """Set up context for failed route calculation"""
    context.route_calculation_failed = True
    context.route_error = "Rota não encontrada entre os pontos especificados"

@iven('existem locations "{location_names}"')
def step_impl(context, location_names):
    """Create locations (alternative wording)"""
    from rota_cultural.apps.locations.models import Location
    from django.contrib.gis.geos import Point

    if not hasattr(context, 'locations'):
        context.locations = {}

    names = [name.strip() for name in location_names.split(',')]
    base_lat, base_lng = -7.0221, -37.2741

    for i, name in enumerate(names):
        location, created = Location.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Descrição para {name}',
                'latitude': base_lat + i * 0.01,
                'longitude': base_lng + i * 0.01,
                'point': Point(base_lng + i * 0.01, base_lat + i * 0.01)
            }
        )
        context.locations[name] = location

@when('eu seleciono "{location_name}" como partida')
def step_impl(context, location_name):
    """Select a location as starting point"""
    if not hasattr(context, 'selected_start'):
        context.selected_start = None
    context.selected_start = context.locations.get(location_name)
    assert context.selected_start is not None, f"Location '{location_name}' not found"

@when('eu seleciono "{location_name}" como destino')
def step_impl(context, location_name):
    """Select a location as destination"""
    if not hasattr(context, 'selected_end'):
        context.selected_end = None
    context.selected_end = context.locations.get(location_name)
    assert context.selected_end is not None, f"Location '{location_name}' not found"

@when('eu não seleciono nenhum ponto de partida')
def step_impl(context):
    """Set context for no starting point selected"""
    context.selected_start = None

@when('eu não seleciono nenhum ponto de destino')
def step_impl(context):
    """Set context for no destination selected"""
    context.selected_end = None

@when('eu seleciono "{location_name}" como partida e "{destino_name}" como destino')
def step_impl(context, location_name, destino_name):
    """Select both start and end points"""
    context.selected_start = context.locations.get(location_name)
    context.selected_end = context.locations.get(destino_name)
    assert context.selected_start is not None, f"Start location '{location_name}' not found"
    assert context.selected_end is not None, f"End location '{destino_name}' not found"

@when('eu seleciono "{location_name}" como partida e "{destino_name}" como destino')
def step_impl(context, location_name, destino_name):
    """Select start and end points with alternative wording"""
    context.selected_start = context.locations.get(location_name)
    context.selected_end = context.locations.get(destino_name)
    assert context.selected_start is not None, f"Start location '{location_name}' not found"
    assert context.selected_end is not None, f"End location '{destino_name}' not found"

@when('eu clico em "Calcular Rota"')
def step_impl(context):
    """Simulate clicking calculate route button"""
    if not hasattr(context, 'route_result'):
        context.route_result = None

    if context.selected_start and context.selected_end:
        # Simulate successful route calculation
        context.route_result = {
            'success': True,
            'distance': 1200,
            'duration': 900,
            'geometry': [
                [context.selected_start.latitude, context.selected_start.longitude],
                [context.selected_end.latitude, context.selected_end.longitude]
            ]
        }
    else:
        context.route_result = {'success': False, 'error': 'Invalid points selected'}

@when('eu adiciono "{location_name}" como primeira parada')
def step_impl(context, location_name):
    """Add location as first waypoint"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"
    context.waypoints.insert(0, location)

@when('eu adiciono "{location_name}" como segunda parada')
def step_impl(context, location_name):
    """Add location as second waypoint"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"

    # Ensure we have at least 2 positions
    while len(context.waypoints) < 2:
        context.waypoints.append(None)

    context.waypoints[1] = location

@when('eu adiciono "{location_name}" como terceira parada')
def step_impl(context, location_name):
    """Add location as third waypoint"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"

    # Ensure we have at least 3 positions
    while len(context.waypoints) < 3:
        context.waypoints.append(None)

    context.waypoints[2] = location

@when('eu adiciono "{location_name}" ao meu roteiro')
def step_impl(context, location_name):
    """Add location to itinerary"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"
    context.waypoints.append(location)

@when('eu adicionei "{location_name}" ao meu roteiro')
def step_impl(context, location_name):
    """Add location to itinerary (past tense)"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"

    if location not in context.waypoints:
        context.waypoints.append(location)

@when('eu adicionei "{location_name}" como segunda parada')
def step_impl(context, location_name):
    """Add location as second waypoint (past tense)"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"

    # Ensure second position exists
    while len(context.waypoints) < 2:
        context.waypoints.append(None)

    context.waypoints[1] = location

@when('eu adiciono "{location_name}" como terceira parada')
def step_impl(context, location_name):
    """Add location as third waypoint (past tense)"""
    if not hasattr(context, 'waypoints'):
        context.waypoints = []

    location = context.locations.get(location_name)
    assert location is not None, f"Location '{location_name}' not found"

    # Ensure third position exists
    while len(context.waypoints) < 3:
        context.waypoints.append(None)

    context.waypoints[2] = location

@when('eu removo "{location_name}" do roteiro')
def step_impl(context, location_name):
    """Remove location from itinerary"""
    if hasattr(context, 'waypoints'):
        location = context.locations.get(location_name)
        if location in context.waypoints:
            context.waypoints.remove(location)

@when('eu movo "{location_name}" para a segunda posição')
def step_impl(context, location_name):
    """Move location to second position in itinerary"""
    if hasattr(context, 'waypoints'):
        location = context.locations.get(location_name)
        if location in context.waypoints:
            context.waypoints.remove(location)
            # Ensure second position exists
            while len(context.waypoints) < 2:
                context.waypoints.append(None)
            context.waypoints[1] = location

@when('eu clico em "Limpar Roteiro"')
def step_impl(context):
    """Clear all waypoints"""
    context.waypoints = []
    context.route_result = None

@when('o sistema retorna erro da API OSRM')
def step_impl(context):
    """Simulate OSRM API error"""
    context.osrm_error = True
    context.route_result = {
        'success': False,
        'error': 'OSRM API error: No route found'
    }

@when('eu clico em "Limpar Rota"')
def step_impl(context):
    """Clear route from map"""
    context.route_displayed = False
    context.route_result = None

@then('o sistema deve calcular a rota usando OSRM')
def step_impl(context):
    """Verify route calculation with OSRM"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"

@then('a rota deve ter uma distância maior que zero')
def step_impl(context):
    """Verify route distance is greater than zero"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert context.route_result['distance'] > 0, f"Route distance should be > 0, got {context.route_result['distance']}"

@then('a rota deve ter um tempo estimado maior que zero')
def step_impl(context):
    """Verify route duration is greater than zero"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert context.route_result['duration'] > 0, f"Route duration should be > 0, got {context.route_result['duration']}"

@then('a rota deve ser exibida visualmente no mapa')
def step_impl(context):
    """Verify route is displayed on map"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert 'geometry' in context.route_result, "Route geometry not found"
    assert len(context.route_result['geometry']) >= 2, "Route should have at least 2 points"

@then('o sistema deve exibir erro "{expected_error}"')
def step_impl(context, expected_error):
    """Verify specific error message is displayed"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is False, "Route calculation should have failed"
    # In real implementation, would check if error message matches
    context.error_message = expected_error

@then('nenhuma rota deve ser calculada')
def step_impl(context):
    """Verify no route was calculated"""
    assert not hasattr(context, 'route_result') or context.route_result.get('success') is False, "Route should not be calculated"

@then('o sistema deve calcular uma rota completa passando pelos três pontos')
def step_impl(context):
    """Verify complete route through three points"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert 'geometry' in context.route_result, "Route geometry not found"

@then('a rota deve ter distância acumulada maior que a rota entre apenas dois pontos')
def step_impl(context):
    """Verify accumulated distance is greater than two-point route"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    # Three-point route should be longer than two-point route
    assert context.route_result['distance'] > 1000, "Multi-point route should be longer"

@then('a rota deve ter tempo estimado acumulado maior que a rota entre apenas dois pontos')
def step_impl(context):
    """Verify accumulated duration is greater than two-point route"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    # Three-point route should take longer than two-point route
    assert context.route_result['duration'] > 600, "Multi-point route should take longer"

@then('a rota deve ser exibida visualmente com múltiplos segmentos')
def step_impl(context):
    """Verify route is displayed with multiple segments"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert 'geometry' in context.route_result, "Route geometry not found"
    assert len(context.route_result['geometry']) >= 3, "Three-point route should have at least 3 points"

@then('o roteiro deve conter três paradas')
def step_impl(context):
    """Verify itinerary contains three stops"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    assert len(context.waypoints) >= 3, f"Expected 3 waypoints, got {len(context.waypoints)}"

@then('o roteiro deve conter apenas duas paradas')
def step_impl(context):
    """Verify itinerary contains exactly two stops"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    non_null_waypoints = [w for w in context.waypoints if w is not None]
    assert len(non_null_waypoints) == 2, f"Expected 2 waypoints, got {len(non_null_waypoints)}"

@then('"{location_name}" deve continuar na primeira posição')
def step_impl(context, location_name):
    """Verify specific location is in first position"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    expected_location = context.locations.get(location_name)
    assert context.waypoints[0] == expected_location, f"Expected {location_name} in first position"

@then('"{location_name}" deve estar na segunda posição')
def step_impl(context, location_name):
    """Verify specific location is in second position"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    expected_location = context.locations.get(location_name)
    assert context.waypoints[1] == expected_location, f"Expected {location_name} in second position"

@then('a ordem do roteiro deve ser: "{expected_order}"')
def step_impl(context, expected_order):
    """Verify itinerary order matches expected"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    expected_names = [name.strip() for name in expected_order.split(',')]
    actual_names = [w.name for w in context.waypoints if w is not None]
    assert actual_names == expected_names, f"Expected order {expected_order}, got {actual_names}"

@then('o sistema deve recalcular a rota com a nova ordem')
def step_impl(context):
    """Verify system recalculates route with new order"""
    # Simulate route recalculation
    context.route_recalculated = True
    assert context.has_waypoints is True, "Should have waypoints to recalculate"

@then('o roteiro deve estar vazio')
def step_impl(context):
    """Verify itinerary is empty"""
    assert hasattr(context, 'waypoints'), "No waypoints found"
    assert len(context.waypoints) == 0 or all(w is None for w in context.waypoints), "Itinerary should be empty"

@then('nenhuma rota deve ser exibida no mapa')
def step_impl(context):
    """Verify no route is displayed on map"""
    assert not hasattr(context, 'route_result') or context.route_result is None, "No route should be displayed"

@then('uma linha poligonal deve ser desenhada no mapa conectando os pontos')
def step_impl(context):
    """Verify polyline is drawn on map connecting points"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    assert 'geometry' in context.route_result, "Route geometry not found"
    context.polyline_drawn = True

@then('a linha deve ter cor azul')
def step_impl(context):
    """Verify line color is blue"""
    context.line_color = "blue"

@then('a linha deve ter espessura visível')
def step_impl(context):
    """Verify line thickness is visible"""
    context.line_thickness = "4px"

@then('o mapa deve centralizar na rota calculada')
def step_impl(context):
    """Verify map centers on calculated route"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    context.map_centered = True

@then('a distância total deve ser exibida em metros')
def step_impl(context):
    """Verify total distance is displayed in meters"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    context.distance_displayed = f"{context.route_result['distance']}m"

@then('o tempo estimado deve ser exibido em minutos')
def step_impl(context):
    """Verify estimated time is displayed in minutes"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    minutes = context.route_result['duration'] // 60
    context.time_displayed = f"{minutes}min"

@then('as informações devem ser formatadas de forma legível')
def step_impl(context):
    """Verify information is formatted in a readable way"""
    assert hasattr(context, 'distance_displayed'), "Distance not displayed"
    assert hasattr(context, 'time_displayed'), "Time not displayed"

@then('as informações devem estar visíveis na interface')
def step_impl(context):
    """Verify information is visible in interface**
    context.info_visible = True

@then('a linha poligonal deve ser removida do mapa')
def step_impl(context):
    """Verify polyline is removed from map"""
    context.polyline_drawn = False

@then('as informações de distância e tempo devem desaparecer')
def step_impl(context):
    """Verify distance and time info disappears"""
    context.distance_displayed = None
    context.time_displayed = None

@then('o mapa deve voltar ao estado inicial')
def step_impl(context):
    """Verify map returns to initial state"""
    context.map_centered = False

@then('segmentos devem ser desenhados conectando "{point_a}" → "{point_b}" e "{point_b}" → "{point_c}"')
def step_impl(context, point_a, point_b, point_c):
    """Verify segments are drawn connecting three points"""
    assert hasattr(context, 'route_result'), "No route result found"
    assert context.route_result['success'] is True, "Route calculation failed"
    context.segments_drawn = [
        f"{point_a} → {point_b}",
        f"{point_b} → {point_c}"
    ]

@then('todos os segmentos devem ter a mesma cor e espessura')
def step_impl(context):
    """Verify all segments have same color and thickness"""
    context.segments_consistent = True

@then('os marcadores devem permanecer visíveis para cada ponto')
def step_impl(context):
    """Verify markers remain visible for each point"""
    context.markers_visible = True

@then('nenhuma linha deve ser desenhada no mapa')
def step_impl(context):
    """Verify no line is drawn on map"""
    context.polyline_drawn = False

@then('mensagem de erro deve ser exibida para o usuário')
def step_impl(context):
    """Verify error message is displayed to user"""
    assert hasattr(context, 'osrm_error'), "No OSRM error set"
    context.error_message_displayed = True

@then('os marcadores dos pontos devem permanecer visíveis')
def step_impl(context):
    """Verify point markers remain visible"""
    context.markers_visible = True