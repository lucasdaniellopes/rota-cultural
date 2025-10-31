from rest_framework import serializers


class NominatimAddressSerializer(serializers.Serializer):
    house_number = serializers.CharField(allow_null=True, required=False)
    road = serializers.CharField(allow_null=True, required=False)
    suburb = serializers.CharField(allow_null=True, required=False)
    city = serializers.CharField(allow_null=True, required=False)
    town = serializers.CharField(allow_null=True, required=False)
    county = serializers.CharField(allow_null=True, required=False)
    state = serializers.CharField(allow_null=True, required=False)
    postcode = serializers.CharField(allow_null=True, required=False)
    country = serializers.CharField(allow_null=True, required=False)
    country_code = serializers.CharField(allow_null=True, required=False)
    amenity = serializers.CharField(allow_null=True, required=False)
    tourism = serializers.CharField(allow_null=True, required=False)


class NominatimResultSerializer(serializers.Serializer):
    place_id = serializers.CharField()
    osm_type = serializers.CharField()
    osm_id = serializers.CharField()
    display_name = serializers.CharField()
    address = NominatimAddressSerializer()
    lat = serializers.CharField()
    lon = serializers.CharField()
    importance = serializers.FloatField(allow_null=True, required=False)
    bbox = serializers.ListField(child=serializers.CharField(), allow_null=True, required=False)
    class_ = serializers.CharField(source='class', allow_null=True, required=False)
    type = serializers.CharField(allow_null=True, required=False)
    name = serializers.CharField(allow_null=True, required=False)
    extratags = serializers.DictField(allow_null=True, required=False)
    namedetails = serializers.DictField(allow_null=True, required=False)
    boundingbox = serializers.ListField(child=serializers.CharField(), allow_null=True, required=False)


class ReverseGeocodeResultSerializer(NominatimResultSerializer):
    pass