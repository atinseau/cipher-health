#!/bin/bash

# Variables
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/../.. && pwd )

source $SCRIPT_DIR/../_utils.sh

# Change directory to script directory
cd $SCRIPT_DIR

# Build docker image

FRONTEND_IMAGE="ch-frontend-local"
FRONTEND_TAG="latest"
FRONTEND_RELEASE="${FRONTEND_IMAGE}-release"

local_deploy \
  frontend \
  $USE_GHCR \
  $FRONTEND_IMAGE \
  $FRONTEND_TAG \
  docker/build.Dockerfile \
  $ROOT_DIR \
  $FRONTEND_RELEASE \
  --build-arg NEXT_PUBLIC_API_HOST=http://ch-api.local.com \
  --build-arg API_HOST=http://nestjs-service

HELM_IMAGE_ARGS=$LOCAL_DEPLOY_RETURN

helm_install \
  $FRONTEND_RELEASE \
  $ROOT_DIR/k8s/values.yaml \
  ${HELM_PRINT_TEMPLATE:-0} \
  $HELM_IMAGE_ARGS \
  --set frontend.ingress.host=ch-frontend.local.com
