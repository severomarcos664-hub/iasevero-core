#!/bin/bash
set -e

PROJECT_ID="tactile-wave-483015-r9"
REGION="us-central1"
SERVICE="iasevero-core"
IMAGE="us-central1-docker.pkg.dev/${PROJECT_ID}/iasevero-repo/iasevero-core:latest"

echo "=================================================="
echo "IASEVERO MASTER UPDATE"
echo "Projeto : $PROJECT_ID"
echo "Região  : $REGION"
echo "Serviço : $SERVICE"
echo "Imagem  : $IMAGE"
echo "=================================================="

echo
echo "[1/5] Build da imagem..."
cd ~/iasevero-core
gcloud builds submit --tag "$IMAGE"

echo
echo "[2/5] Deploy no Cloud Run..."
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated

echo
echo "[3/5] Consultando URL do serviço..."
SERVICE_URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')
echo "URL: $SERVICE_URL"

echo
echo "[4/5] Testando saúde do serviço..."
curl -s "$SERVICE_URL"
echo

echo
echo "[5/5] Finalizado."
echo "IASevero atualizada com sucesso."
echo "Serviço ativo em: $SERVICE_URL"
