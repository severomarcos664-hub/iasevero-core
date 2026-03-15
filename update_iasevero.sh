#!/bin/bash
set -e

PROJECT_ID="tactile-wave-483015-r9"
REGION="us-central1"
SERVICE="iasevero-core"
IMAGE="us-central1-docker.pkg.dev/${PROJECT_ID}/iasevero-repo/iasevero-core:latest"

echo "==> Build da imagem..."
gcloud builds submit --tag "$IMAGE"

echo "==> Deploy no Cloud Run..."
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated

echo "==> Status final:"
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)'
echo
echo "Atualização concluída com sucesso."
