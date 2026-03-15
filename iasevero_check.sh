#!/bin/bash
set -e

PROJECT_ID="tactile-wave-483015-r9"
REGION="us-central1"
SERVICE="iasevero-core"

echo "=================================================="
echo "IASEVERO CHECK"
echo "Projeto : $PROJECT_ID"
echo "Região  : $REGION"
echo "Serviço : $SERVICE"
echo "=================================================="

echo
echo "[1/6] URL do serviço..."
SERVICE_URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')
echo "URL: $SERVICE_URL"

echo
echo "[2/6] Health check..."
curl -s "$SERVICE_URL"
echo

echo
echo "[3/6] Revisão ativa..."
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.latestReadyRevisionName)'
echo

echo
echo "[4/6] Webhook do Telegram..."
BOT_TOKEN=$(gcloud secrets versions access latest --secret=TELEGRAM_BOT_TOKEN)
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"
echo

echo
echo "[5/6] Últimos logs..."
gcloud run services logs read "$SERVICE" --region "$REGION" --limit 20
echo

echo
echo "[6/6] Últimos erros..."
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE} AND severity>=ERROR" \
  --limit 10 \
  --format='value(textPayload)'
echo

echo
echo "CHECK FINALIZADO."
