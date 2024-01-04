#!/bin/bash

##########################

# Configuring script environment

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/.. && pwd )

# Available develop, preprod, prod, local
export ENVIRONMENT="${1:-local}"
if [ "$ENVIRONMENT" != "local" ] && [ "$ENVIRONMENT" != "develop" ] && [ "$ENVIRONMENT" != "preprod" ] && [ "$ENVIRONMENT" != "prod" ]; then
  echo "Invalid environment. Available environments: develop, preprod, prod, local"
  exit 1
fi

echo "Deploying to ${ENVIRONMENT}"

##########################

# Prepare k8s cluster

# Check if helm-diff plugin is installed
if ! helm plugin list | grep -q "diff"; then
  echo "helm-diff plugin is not installed. Installing..."
  helm plugin install https://github.com/databus23/helm-diff
fi

helm install \
  ingress-nginx-release ingress-nginx/ingress-nginx \
  -n ingress-nginx \
  --create-namespace \
  2> /dev/null || echo "Ingress-nginx already installed"

##########################

# Run all deploy scripts

# Frontend
FRONTEND_HOST="ch-frontend.${ENVIRONMENT}.com"
if [[ "$ENVIRONMENT" == "prod" ]]; then
  echo "Domain is not ready yet"
fi

bash $SCRIPT_DIR/frontend/deploy.sh \
  --set frontend.ingress.host=$FRONTEND_HOST

# Api

##########################