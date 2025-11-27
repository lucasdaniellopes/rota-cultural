from behave import given, when, then


@given('que estou autenticado como "{email}"')
def step_authenticated_as(context, email):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.filter(email=email).delete()
    context.user = User.objects.create_user(
        email=email,
        password='Senha@123',
        full_name='Test User'
    )


@given('existe uma categoria "{name}" do tipo "{item_type}"')
def step_category_exists(context, name, item_type):
    from rota_cultural.apps.categories.models import Category
    context.category, _ = Category.objects.get_or_create(
        name=name,
        item_type=item_type
    )


@given('que existem {count:d} pontos turísticos cadastrados')
def step_multiple_spots_exist(context, count):
    from django.contrib.gis.geos import Point
    from rota_cultural.apps.places.models import TouristSpot
    from rota_cultural.apps.categories.models import Category
    from rota_cultural.apps.addresses.models import Address
    
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
        TouristSpot.objects.create(
            name=f'Ponto {i+1}',
            description=f'Descrição {i+1}',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=context.user
        )


@given('que existe um ponto turístico chamado "{name}"')
def step_spot_exists(context, name):
    from django.contrib.gis.geos import Point
    from rota_cultural.apps.places.models import TouristSpot
    from rota_cultural.apps.categories.models import Category
    from rota_cultural.apps.addresses.models import Address
    
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


@when('eu crio um ponto turístico com os dados')
def step_create_spot(context):
    from django.contrib.gis.geos import Point
    from rota_cultural.apps.places.models import TouristSpot
    from rota_cultural.apps.addresses.models import Address
    
    data = {row['campo']: row['valor'] for row in context.table}
    
    address = Address.objects.create(
        street='Rua Teste',
        number='123',
        neighborhood='Centro',
        city='Patos',
        state='PB',
        postal_code='58700-000',
        point=Point(-37.2744, -7.0227, srid=4326)
    )
    
    context.new_spot = TouristSpot.objects.create(
        name=data['name'],
        description=data['description'],
        opening_time=data['opening_time'],
        closing_time=data['closing_time'],
        category=context.category,
        address=address,
        organizer=context.user
    )


@when('eu listo os pontos turísticos')
def step_list_spots(context):
    from rota_cultural.apps.places.models import TouristSpot
    context.spots = TouristSpot.objects.all()


@when('eu busco por "{search_term}"')
def step_search_spots(context, search_term):
    from rota_cultural.apps.places.models import TouristSpot
    context.search_results = TouristSpot.objects.filter(name__icontains=search_term)


@when('eu atualizo o nome para "{new_name}"')
def step_update_spot_name(context, new_name):
    context.spot.name = new_name
    context.spot.save()


@when('eu deleto o ponto turístico')
def step_delete_spot(context):
    context.deleted_spot_id = context.spot.id
    context.spot.delete()


@then('o ponto turístico deve ser criado com sucesso')
def step_spot_created(context):
    assert context.new_spot.id is not None


@then('o ponto deve ter o nome "{name}"')
def step_spot_has_name(context, name):
    assert context.new_spot.name == name


@then('devo ver {count:d} pontos turísticos')
def step_see_spots_count(context, count):
    assert context.spots.count() == count


@then('todos devem ter nome e descrição')
def step_spots_have_data(context):
    for spot in context.spots:
        assert spot.name
        assert spot.description


@then('devo encontrar o ponto "{name}"')
def step_find_spot(context, name):
    assert context.search_results.filter(name=name).exists()


@then('o ponto deve ter o novo nome "{name}"')
def step_spot_updated_name(context, name):
    from rota_cultural.apps.places.models import TouristSpot
    updated_spot = TouristSpot.objects.get(id=context.spot.id)
    assert updated_spot.name == name


@then('o ponto não deve mais existir')
def step_spot_deleted(context):
    from rota_cultural.apps.places.models import TouristSpot
    assert not TouristSpot.objects.filter(id=context.deleted_spot_id).exists()
