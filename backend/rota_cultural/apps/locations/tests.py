import pytest
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError
from unittest.mock import patch, MagicMock
from .models import Location


@pytest.mark.django_db
def test_create_location_with_valid_data():
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    location = Location.objects.create(**valid_location_data)

    assert location.name == "Praca Getulio Vargas"
    assert location.description == "Principal praca da cidade de Patos-PB"
    assert location.latitude == Decimal("-7.026368")
    assert location.longitude == Decimal("-37.277010")
    assert location.id is not None
    assert location.created_at is not None
    assert location.updated_at is not None

@pytest.mark.django_db
def test_location_str_method():
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    location = Location.objects.create(**valid_location_data)
    assert str(location) == "Praca Getulio Vargas"

@pytest.mark.django_db
def test_location_ordering():
    names = ["Zoo Municipal", "Igreja Matriz", "Museu do Cariri", "Biblioteca Publica"]

    for name in names:
        Location.objects.create(
            name=name,
            description=f"Description for {name}",
            latitude=Decimal("-7.026000"),
            longitude=Decimal("-37.277000")
        )

    locations = list(Location.objects.all())
    location_names = [loc.name for loc in locations]
    expected_order = ["Biblioteca Publica", "Igreja Matriz", "Museu do Cariri", "Zoo Municipal"]

    assert location_names == expected_order

@pytest.mark.django_db
@pytest.mark.gis
def test_valid_latitude_ranges():
    valid_latitudes = [
        Decimal("-90.000000"),
        Decimal("-7.026368"),
        Decimal("0.000000"),
        Decimal("45.123456"),
        Decimal("90.000000")
    ]

    for lat in valid_latitudes:
        location = Location.objects.create(
            name="Test Location",
            description="Test",
            latitude=lat,
            longitude=Decimal("-37.277010")
        )
        assert location.latitude == lat
        location.delete()

@pytest.mark.django_db
@pytest.mark.gis
def test_valid_longitude_ranges():
    valid_longitudes = [
        Decimal("-180.000000"),
        Decimal("-37.277010"),
        Decimal("0.000000"),
        Decimal("75.123456"),
        Decimal("180.000000")
    ]

    for lng in valid_longitudes:
        location = Location.objects.create(
            name="Test Location",
            description="Test",
            latitude=Decimal("-7.026368"),
            longitude=lng
        )
        assert location.longitude == lng
        location.delete()

@pytest.mark.django_db
def test_decimal_precision_preservation():
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    high_precision_data = valid_location_data.copy()
    high_precision_data.update({
        "latitude": Decimal("-7.02636812"),
        "longitude": Decimal("-37.27701099")
    })

    location = Location.objects.create(**high_precision_data)

    expected_lat = Decimal("-7.02636812")
    expected_lng = Decimal("-37.27701099")

    assert location.latitude == expected_lat
    assert location.longitude == expected_lng

@pytest.mark.django_db
def test_required_fields():
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    required_fields = ["name", "description", "latitude", "longitude"]

    for field in required_fields:
        data = valid_location_data.copy()
        data[field] = None

        with pytest.raises(Exception):
            Location.objects.create(**data)

@pytest.mark.django_db
def test_max_length_name():
    long_name = "A" * 101

    with pytest.raises(ValidationError):
        location = Location(
            name=long_name,
            description="Test",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )
        location.full_clean()

@pytest.mark.django_db
def test_blank_description():
    location = Location.objects.create(
        name="Test Location",
        description="",
        latitude=Decimal("-7.026368"),
        longitude=Decimal("-37.277010")
    )

    assert location.description == ""

@pytest.mark.django_db
def test_timestamps_auto_update():
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    location = Location.objects.create(**valid_location_data)
    original_created = location.created_at
    original_updated = location.updated_at

    import time
    time.sleep(0.01)

    location.name = "Updated Location"
    location.save()

    location.refresh_from_db()

    assert location.created_at == original_created
    assert location.updated_at > original_updated

@pytest.mark.django_db
def test_bulk_create_locations():
    locations_data = [
        {
            "name": f"Location {i}",
            "description": f"Description {i}",
            "latitude": Decimal(f"-7.02{i}000"),
            "longitude": Decimal(f"-37.27{i}000")
        }
        for i in range(5)
    ]

    locations = Location.objects.bulk_create(
        [Location(**data) for data in locations_data]
    )

    assert len(locations) == 5
    assert Location.objects.count() == 5

@pytest.mark.django_db
@patch('rota_cultural.apps.locations.models.Location.save')
def test_model_save_with_side_effects(mock_save):
    valid_location_data = {
        "name": "Praca Getulio Vargas",
        "description": "Principal praca da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }

    mock_save.return_value = None

    location = Location(**valid_location_data)
    location.save()

    mock_save.assert_called_once()


@pytest.mark.django_db
def test_basic_queryset_filtering():
    praca = Location.objects.create(
        name="Praca Getulio Vargas",
        description="Praca central",
        latitude=Decimal("-7.026368"),
        longitude=Decimal("-37.277010")
    )

    igreja = Location.objects.create(
        name="Igreja Matriz",
        description="Igreja historica",
        latitude=Decimal("-7.027000"),
        longitude=Decimal("-37.276000")
    )

    museu = Location.objects.create(
        name="Museu do Cariri",
        description="Museu cultural",
        latitude=Decimal("-7.025000"),
        longitude=Decimal("-37.278000")
    )

    pracas = Location.objects.filter(name__icontains="praca")
    assert pracas.count() == 1
    assert pracas.first().name == "Praca Getulio Vargas"

@pytest.mark.django_db
@pytest.mark.gis
def test_coordinate_filtering():
    praca = Location.objects.create(
        name="Praca Getulio Vargas",
        description="Praca central",
        latitude=Decimal("-7.026368"),
        longitude=Decimal("-37.277010")
    )

    igreja = Location.objects.create(
        name="Igreja Matriz",
        description="Igreja historica",
        latitude=Decimal("-7.027000"),
        longitude=Decimal("-37.276000")
    )

    museu = Location.objects.create(
        name="Museu do Cariri",
        description="Museu cultural",
        latitude=Decimal("-7.025000"),
        longitude=Decimal("-37.278000")
    )

    locations_in_range = Location.objects.filter(
        latitude__gte=Decimal("-7.027000"),
        latitude__lte=Decimal("-7.025000")
    )
    assert locations_in_range.count() == 3

    locations_in_lng_range = Location.objects.filter(
        longitude__gte=Decimal("-37.278000"),
        longitude__lte=Decimal("-37.276000")
    )
    assert locations_in_lng_range.count() == 3