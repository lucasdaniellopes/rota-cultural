from behave import given, when, then


def _create_spot_for_favorite(context, name):
    from django.contrib.gis.geos import Point
    from rota_cultural.apps.places.models import TouristSpot
    from rota_cultural.apps.categories.models import Category
    from rota_cultural.apps.addresses.models import Address
    
    if not hasattr(context, 'user'):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        context.user = User.objects.create_user(
            email='usuario@teste.com',
            password='Senha@123',
            full_name='Test User'
        )
    
    address = Address.objects.create(
        street='Rua Teste',
        number='123',
        neighborhood='Centro',
        city='Patos',
        state='PB',
        postal_code='58700-000',
        point=Point(-37.2744, -7.0227, srid=4326)
    )
    
    category, _ = Category.objects.get_or_create(
        name='Museu',
        item_type='tourist_spot'
    )
    
    context.spot = TouristSpot.objects.create(
        name=name,
        description='Descrição teste',
        category=category,
        address=address,
        opening_time='08:00:00',
        closing_time='18:00:00',
        organizer=context.user
    )


@given('que tenho um ponto turístico "{name}" nos favoritos')
def step_spot_in_favorites(context, name):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    _create_spot_for_favorite(context, name)
    content_type = ContentType.objects.get_for_model(context.spot)
    context.favorite = Favorite.objects.create(
        user=context.user,
        content_type=content_type,
        object_id=context.spot.id
    )


@given('o ponto já está nos meus favoritos')
def step_spot_already_favorited(context):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    content_type = ContentType.objects.get_for_model(context.spot)
    context.favorite = Favorite.objects.create(
        user=context.user,
        content_type=content_type,
        object_id=context.spot.id
    )


@given('que tenho {count:d} itens nos favoritos')
def step_multiple_favorites(context, count):
    from django.contrib.gis.geos import Point
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.places.models import TouristSpot
    from rota_cultural.apps.categories.models import Category
    from rota_cultural.apps.addresses.models import Address
    from rota_cultural.apps.favorites.models import Favorite
    
    address = Address.objects.create(
        street='Rua Teste',
        number='123',
        neighborhood='Centro',
        city='Patos',
        state='PB',
        postal_code='58700-000',
        point=Point(-37.2744, -7.0227, srid=4326)
    )
    
    category, _ = Category.objects.get_or_create(
        name='Museu',
        item_type='tourist_spot'
    )
    
    for i in range(count):
        spot = TouristSpot.objects.create(
            name=f'Ponto {i+1}',
            description='Descrição',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=context.user
        )
        content_type = ContentType.objects.get_for_model(spot)
        Favorite.objects.create(
            user=context.user,
            content_type=content_type,
            object_id=spot.id
        )


@when('eu adiciono o ponto aos favoritos')
def step_add_to_favorites(context):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    content_type = ContentType.objects.get_for_model(context.spot)
    context.favorite = Favorite.objects.create(
        user=context.user,
        content_type=content_type,
        object_id=context.spot.id
    )


@when('eu removo o ponto dos favoritos')
def step_remove_from_favorites(context):
    context.favorite_id = context.favorite.id
    context.favorite.delete()


@when('eu listo meus favoritos')
def step_list_favorites(context):
    from rota_cultural.apps.favorites.models import Favorite
    context.favorites = Favorite.objects.filter(user=context.user)


@when('eu tento adicionar o mesmo ponto novamente')
def step_try_add_duplicate_favorite(context):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    content_type = ContentType.objects.get_for_model(context.spot)
    try:
        Favorite.objects.create(
            user=context.user,
            content_type=content_type,
            object_id=context.spot.id
        )
        context.duplicate_success = True
    except Exception as e:
        context.duplicate_success = False
        context.error = str(e)


@then('o ponto deve estar na minha lista de favoritos')
def step_spot_in_favorites_list(context):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    content_type = ContentType.objects.get_for_model(context.spot)
    assert Favorite.objects.filter(
        user=context.user,
        content_type=content_type,
        object_id=context.spot.id
    ).exists()


@then('o ponto não deve mais estar nos favoritos')
def step_spot_not_in_favorites(context):
    from rota_cultural.apps.favorites.models import Favorite
    assert not Favorite.objects.filter(id=context.favorite_id).exists()


@then('devo ver {count:d} itens favoritos')
def step_see_favorites_count(context, count):
    assert context.favorites.count() == count


@then('deve continuar tendo apenas 1 favorito deste item')
def step_only_one_favorite(context):
    from django.contrib.contenttypes.models import ContentType
    from rota_cultural.apps.favorites.models import Favorite
    content_type = ContentType.objects.get_for_model(context.spot)
    count = Favorite.objects.filter(
        user=context.user,
        content_type=content_type,
        object_id=context.spot.id
    ).count()
    assert count == 1
