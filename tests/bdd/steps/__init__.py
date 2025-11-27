import os
import sys
import django

# Add backend to path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rota_cultural.core.settings')

# Setup Django
try:
    django.setup()
except RuntimeError:
    # Django already configured
    pass
