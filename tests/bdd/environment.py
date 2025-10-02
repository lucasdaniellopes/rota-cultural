import os
import sys
import django
from django.conf import settings
from django.test.runner import DiscoverRunner
from django.test.utils import setup_test_environment
from behave import use_fixture

# Try to import behave_django if available
try:
    from behave_django.fixture import DjangoTestSetup
    HAS_BEHAVE_DJANGO = True
except ImportError:
    HAS_BEHAVE_DJANGO = False
    print("Warning: behave_django not available, using manual Django setup")

def before_all(context):
    """
    Setup Django environment before all tests
    """
    # Adicionar backend ao Python path
    backend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend')
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)

    # Configurar Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rota_cultural.core.settings')

    # Setup Django
    django.setup()

    # Setup test environment
    setup_test_environment()

    # Use Django test setup if available
    if HAS_BEHAVE_DJANGO:
        use_fixture(DjangoTestSetup, context)

    # Store test runner
    context.runner = DiscoverRunner()

    # Store fixtures container
    context.fixtures = {}

def before_scenario(context, scenario):
    """
    Setup before each scenario
    """
    # Reset fixtures
    context.fixtures = {}

def after_scenario(context, scenario):
    """
    Cleanup after each scenario
    """
    # Cleanup test data if needed
    pass

def before_step(context, step):
    """
    Setup before each step
    """
    pass

def after_step(context, step):
    """
    Cleanup after each step
    """
    pass

def after_all(context):
    """
    Cleanup after all tests
    """
    # Cleanup Django test environment
    pass