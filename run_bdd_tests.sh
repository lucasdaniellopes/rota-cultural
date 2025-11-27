#!/bin/bash

# Script para rodar testes BDD (Behave)
# Uso: ./run_bdd_tests.sh [feature_file]

cd backend
export DJANGO_SETTINGS_MODULE=rota_cultural.core.settings

if [ -z "$1" ]; then
    # Rodar todos os testes
    uv run behave ../tests/bdd
else
    # Rodar feature específica
    uv run behave ../tests/bdd/features/$1
fi
