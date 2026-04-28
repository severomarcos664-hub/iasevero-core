#!/usr/bin/env bash
set -e

echo "1/3 Verificando comandos perigosos..."
! grep -R "rm -rf /" app || { echo "ERRO: comando perigoso encontrado"; exit 1; }

echo "2/3 Verificando imports duplicados críticos..."
! grep -R "import { tickJobs }" app/api/chat/route.ts | awk 'NR>1 {exit 1}'

echo "3/3 Verificação de segurança OK."
