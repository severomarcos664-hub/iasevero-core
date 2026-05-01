#!/usr/bin/env bash
set -e

mkdir -p backups/memory

if [ -f learning.json ]; then
  cp learning.json "backups/memory/learning-$(date +%Y%m%d-%H%M%S).json"
  echo "Backup da memória criado."
else
  echo "learning.json não encontrado."
fi
