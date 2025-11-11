import pytest
from decimal import Decimal


@pytest.mark.routing
def test_coordinate_conversion_accuracy_standalone():
    lat_decimal = Decimal("-7.026368")
    lng_decimal = Decimal("-37.277010")

    lat_float = float(lat_decimal)
    lng_float = float(lng_decimal)

    assert lat_float == -7.026368
    assert lng_float == -37.27701


@pytest.mark.routing
def test_route_geometry_validation_standalone():
    valid_geometry = [
        [-37.277010, -7.026368],
        [-37.276500, -7.026700],
        [-37.276000, -7.027000]
    ]

    for point in valid_geometry:
        assert len(point) == 2
        assert isinstance(point[0], (int, float))
        assert isinstance(point[1], (int, float))
        assert -180 <= point[0] <= 180
        assert -90 <= point[1] <= 90