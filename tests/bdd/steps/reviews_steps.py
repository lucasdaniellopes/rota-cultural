from behave import given, when, then


def _create_spot_for_review(context, name):
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


@given('existem {count:d} avaliações para este ponto')
def step_multiple_reviews_exist(context, count):
    from django.contrib.auth import get_user_model
    from rota_cultural.apps.reviews.models import Review
    User = get_user_model()
    
    for i in range(count):
        user = User.objects.create_user(
            email=f'user{i}@teste.com',
            password='Senha@123',
            full_name=f'User {i}'
        )
        Review.objects.create(
            user=user,
            content_type_id=context.spot.id,
            object_id=context.spot.id,
            rating=5,
            title=f'Review {i}',
            comment=f'Comentário {i}'
        )


@given('que criei uma avaliação com nota {rating:d}')
def step_review_created_with_rating(context, rating):
    from rota_cultural.apps.reviews.models import Review
    
    # Criar um spot se não existir
    if not hasattr(context, 'spot'):
        _create_spot_for_review(context, 'Ponto Teste')
    
    context.review = Review.objects.create(
        user=context.user,
        content_type_id=context.spot.id,
        object_id=context.spot.id,
        rating=rating,
        title='Minha avaliação',
        comment='Meu comentário'
    )


@given('que criei uma avaliação para "{name}"')
def step_review_created_for_spot(context, name):
    from rota_cultural.apps.reviews.models import Review
    _create_spot_for_review(context, name)
    context.review = Review.objects.create(
        user=context.user,
        content_type_id=context.spot.id,
        object_id=context.spot.id,
        rating=5,
        title='Minha avaliação',
        comment='Meu comentário'
    )


@when('eu crio uma avaliação com')
def step_create_review(context):
    from rota_cultural.apps.reviews.models import Review
    data = {row['campo']: row['valor'] for row in context.table}
    context.new_review = Review.objects.create(
        user=context.user,
        content_type_id=context.spot.id,
        object_id=context.spot.id,
        rating=int(data['rating']),
        title=data['title'],
        comment=data['comment']
    )


@when('eu listo as avaliações do ponto')
def step_list_reviews(context):
    from rota_cultural.apps.reviews.models import Review
    context.reviews = Review.objects.filter(
        content_type_id=context.spot.id,
        object_id=context.spot.id
    )


@when('eu atualizo a nota para {rating:d}')
def step_update_review_rating(context, rating):
    context.review.rating = rating
    context.review.save()


@when('eu deleto minha avaliação')
def step_delete_review(context):
    context.deleted_review_id = context.review.id
    context.review.delete()


@when('eu tento criar uma avaliação com nota {rating:d}')
def step_try_create_invalid_review(context, rating):
    from rota_cultural.apps.reviews.models import Review
    try:
        Review.objects.create(
            user=context.user,
            content_type_id=context.spot.id,
            object_id=context.spot.id,
            rating=rating,
            title='Teste',
            comment='Teste'
        )
        context.review_created = True
    except Exception as e:
        context.review_created = False
        context.error = str(e)


@then('a avaliação deve ser criada com sucesso')
def step_review_created(context):
    assert context.new_review.id is not None


@then('a avaliação deve ter nota {rating:d}')
def step_review_has_rating(context, rating):
    from rota_cultural.apps.reviews.models import Review
    if hasattr(context, 'new_review'):
        assert context.new_review.rating == rating
    else:
        updated_review = Review.objects.get(id=context.review.id)
        assert updated_review.rating == rating


@then('devo ver {count:d} avaliações')
def step_see_reviews_count(context, count):
    assert context.reviews.count() == count


@then('a avaliação não deve mais existir')
def step_review_deleted(context):
    from rota_cultural.apps.reviews.models import Review
    assert not Review.objects.filter(id=context.deleted_review_id).exists()


@then('a avaliação não deve ser criada')
def step_review_not_created(context):
    assert context.review_created is False
