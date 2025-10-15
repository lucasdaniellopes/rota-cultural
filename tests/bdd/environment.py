import os
import sys
import django
from django.conf import settings
from django.test.runner import DiscoverRunner
from django.test.utils import setup_test_environment
from behave import use_fixture

try:
    from behave_django.fixture import DjangoTestSetup
    HAS_BEHAVE_DJANGO = True
except ImportError:
    HAS_BEHAVE_DJANGO = False
    print("Warning: behave_django not available, using manual Django setup")

def before_all(context):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rota_cultural.core.settings')

    backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)

    print(f"Backend path: {backend_path}")
    print(f"Django Settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

    try:
        django.setup()
        print("Django setup successful")
    except Exception as e:
        print(f"Django setup failed: {e}")
        raise

    setup_test_environment()

    if HAS_BEHAVE_DJANGO:
        use_fixture(DjangoTestSetup, context)

    context.runner = DiscoverRunner()
    context.fixtures = {}

def before_scenario(context, scenario):
    context.fixtures = {}

def after_scenario(context, scenario):
    pass

def before_step(context, step):
    pass

def after_step(context, step):
    pass

def after_all(context):
    pass