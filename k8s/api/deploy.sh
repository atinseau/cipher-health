#!/bin/bash

# Variables
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/../.. && pwd )

source $SCRIPT_DIR/../_utils.sh

set -o allexport
source apps/api/.env
set +o allexport

# Change directory to script directory
cd $SCRIPT_DIR

# Build docker image

API_IMAGE="ch-api-local"
API_TAG="latest" # Only for ghcr
API_RELEASE="${API_IMAGE}-release"

local_deploy \
  api \
  $USE_GHCR \
  $API_IMAGE \
  $API_TAG \
  docker/build.Dockerfile \
  $ROOT_DIR \
  $API_RELEASE

HELM_IMAGE_ARGS=$LOCAL_DEPLOY_RETURN

# Crappy way to pass secrets to helm because helm cli --set doesn't support multiline
# And whitespace in cli came from a function call
VIRTUAL_VALUES_FILE=$(mktemp)
cat <<EOF > $VIRTUAL_VALUES_FILE
nestjs:
  secrets:
    ACCESS_TOKEN_SECRET: $ACCESS_TOKEN_SECRET
    REFRESH_TOKEN_SECRET: $REFRESH_TOKEN_SECRET
    STWT_SECRET: $STWT_SECRET
    TWO_FACTOR_SECRET: $TWO_FACTOR_SECRET
    TWILIO_AUTH_TOKEN: $TWILIO_AUTH_TOKEN
    TWILIO_ACCOUNT_SID: $TWILIO_ACCOUNT_SID
    MAIL_PASSWORD: $MAIL_PASSWORD
    MAIL_USER: $MAIL_USER
    ADMIN_PASSWORD: $ADMIN_PASSWORD
    ADMIN_EMAIL: $ADMIN_EMAIL
  configs:
    ACCESS_TOKEN_EXPIRY: $ACCESS_TOKEN_EXPIRY
    REFRESH_TOKEN_EXPIRY: $REFRESH_TOKEN_EXPIRY
    STWT_EXPIRY: $STWT_EXPIRY
    ADMIN_PANEL_URL: $ADMIN_PANEL_URL
postgres:
  secrets:
    POSTGRES_PASSWORD: $POSTGRES_PASSWORD
    POSTGRES_USER: $POSTGRES_USER
EOF

helm_install \
  $API_RELEASE \
  $ROOT_DIR/k8s/values.yaml \
  ${HELM_PRINT_TEMPLATE:-0} \
  $HELM_IMAGE_ARGS \
  -f $VIRTUAL_VALUES_FILE \
  --set api.ingress.host=api-local.hygiie.com

rm $VIRTUAL_VALUES_FILE