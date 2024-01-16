#!/bin/bash

# LOCAL PURPOSES ONLY

export USE_GHCR=0
export HELM_PRINT_TEMPLATE=0

for i in "$@"; do
  if [[ $i == "--ghcr" ]]; then
    export USE_GHCR=1
  elif [[ $i == "--template" ]]; then
    export HELM_PRINT_TEMPLATE=1
  fi
done

##########################

# Configuring script environment

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/.. && pwd )

echo "Deploying to local k8s cluster"

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

bash $SCRIPT_DIR/api/deploy.sh
bash $SCRIPT_DIR/frontend/deploy.sh

##########################