#!/bin/bash

echo "================================"
echo "IASevero Deploy Check"
echo "================================"

echo "1. Verificando sintaxe Python..."

python -m py_compile app/main.py
if [ $? -ne 0 ]; then
  echo "Erro de sintaxe encontrado!"
  exit 1
fi

echo "2. Verificando imports..."

python - <<PY
import sys
import importlib

modules = ["fastapi", "openai"]

for m in modules:
    try:
        importlib.import_module(m)
        print(f"OK: {m}")
    except:
        print(f"ERRO: modulo {m} não encontrado")
        sys.exit(1)

print("Imports OK")
PY

echo "3. Estrutura do projeto..."

if [ ! -f app/main.py ]; then
  echo "main.py não encontrado"
  exit 1
fi

echo "================================"
echo "CHECK OK - Deploy seguro"
echo "================================"
