import pytest
import os
import sys

# Adicionar o diretório do projeto ao Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configurar Django settings antes de importar qualquer coisa do Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rota_cultural.core.settings")

import django
django.setup()

# Agora pode importar fixtures e configurações do pytest-django