#!/usr/bin/env bash
set -e

echo "1/4 Limpando build..."
rm -rf .next

echo "2/4 Validando TypeScript/build..."
npm run build

echo "3/4 Verificando arquivos críticos..."
test -f app/lib/iasevero-core.ts
test -f app/lib/executor.ts
test -f app/lib/queue.ts
test -f app/lib/runner.ts
test -f app/api/chat/route.ts

echo "4/4 Verificação concluída."
echo "IASevero OK: build, core, executor, queue, runner e API presentes."
