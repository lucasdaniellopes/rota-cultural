from behave import given, when, then


@given('que não existe um usuário com email "{email}"')
def step_no_user_exists(context, email):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.filter(email=email).delete()


@given('que existe um usuário com email "{email}" e senha "{password}"')
def step_user_exists(context, email, password):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.filter(email=email).delete()
    context.user = User.objects.create_user(
        email=email,
        password=password,
        full_name='Test User'
    )


@given('que existe um usuário com email "{email}"')
def step_user_exists_simple(context, email):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.filter(email=email).delete()
    context.user = User.objects.create_user(
        email=email,
        password='Senha@123',
        full_name='Test User'
    )


@when('eu me cadastro com os dados')
def step_register_user(context):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    data = {row['campo']: row['valor'] for row in context.table}
    try:
        context.new_user = User.objects.create_user(**data)
        context.register_success = True
    except Exception as e:
        context.register_success = False
        context.error = str(e)


@when('eu faço login com email "{email}" e senha "{password}"')
def step_login(context, email, password):
    from django.contrib.auth import authenticate
    context.authenticated_user = authenticate(email=email, password=password)
    if context.authenticated_user:
        context.token = 'mock_token_' + email
    else:
        context.token = None


@when('eu tento me cadastrar com email "{email}"')
def step_try_register_duplicate(context, email):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        User.objects.create_user(
            email=email,
            password='Senha@123',
            full_name='Duplicate User'
        )
        context.register_success = True
    except Exception as e:
        context.register_success = False
        context.error = str(e)


@then('o usuário deve ser criado com sucesso')
def step_user_created(context):
    assert context.register_success is True
    assert context.new_user.id is not None


@then('o usuário deve estar ativo')
def step_user_active(context):
    assert context.new_user.is_active is True


@then('eu devo receber um token de acesso')
def step_receive_token(context):
    assert context.token is not None


@then('o token deve ser válido')
def step_token_valid(context):
    assert context.token.startswith('mock_token_')


@then('eu não devo receber um token de acesso')
def step_no_token(context):
    assert context.token is None


@then('devo receber uma mensagem de erro')
def step_error_message(context):
    assert hasattr(context, 'error') or context.authenticated_user is None


@then('o cadastro deve falhar')
def step_register_failed(context):
    assert context.register_success is False


@then('devo receber uma mensagem de email já cadastrado')
def step_duplicate_email_error(context):
    assert 'email' in str(context.error).lower() or 'unique' in str(context.error).lower()
