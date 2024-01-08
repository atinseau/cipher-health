#!/bin/bash

# Variables
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( cd $SCRIPT_DIR/../.. && pwd )

# Change directory to script directory
cd $SCRIPT_DIR

# Build docker image

FRONTEND_IMAGE="ch-frontend-local"
FRONTEND_TAG="latest"
FRONTEND_RELEASE="${FRONTEND_IMAGE}-release"

if [[ "$USE_GHCR" == 1 ]]; then

  if [[ -z "$CR_PAT" ]]; then
    echo "CR_PAT is not set"
    exit 1
  fi

  GHCR_IMAGE_NAME="atinseau/${FRONTEND_IMAGE}:${FRONTEND_TAG}"

  docker build \
    -t $GHCR_IMAGE_NAME \
    -f docker/build.Dockerfile \
    $ROOT_DIR

  echo $CR_PAT | docker login ghcr.io -u atinseau --password-stdin
  IMAGE_ID=$(docker images -q $GHCR_IMAGE_NAME)
  docker tag $IMAGE_ID ghcr.io/$GHCR_IMAGE_NAME
  docker push ghcr.io/$GHCR_IMAGE_NAME

  LAST_DIGEST=$(docker manifest inspect ghcr.io/$GHCR_IMAGE_NAME -v | jq -r '.Descriptor.digest')

  HELM_IMAGE_ARGS="\
    --set frontend.image.name=ghcr.io/atinseau/${FRONTEND_IMAGE}@${LAST_DIGEST} \
    --set frontend.image.pullSecrets.name=regcred \
    --set frontend.image.pullPolicy=Always \
  "

  kubectl create secret docker-registry regcred \
    -n local \
    --docker-server=https://ghcr.io \
    --docker-username=atinseau \
    --docker-password=$CR_PAT \
    --docker-email=arthurtinseau@live.fr || true
else
  docker build \
    -t $FRONTEND_IMAGE:$FRONTEND_TAG \
    -f docker/build.Dockerfile \
    $ROOT_DIR

  HELM_IMAGE_ARGS="\
    --set frontend.image.name=$FRONTEND_IMAGE:$FRONTEND_TAG \
    --set frontend.image.pullPolicy=Never \
  "
fi

# Helm install
HELM_ARGS="\
  $FRONTEND_RELEASE ./helm/ \
  -n local \
  -f $ROOT_DIR/k8s/values.yaml \
  --set frontend.ingress.host=ch-frontend.local.com \
  $HELM_IMAGE_ARGS \
"
HELM_DIFF=$(helm diff upgrade $HELM_ARGS --allow-unreleased | wc -l)

if [ "$HELM_DIFF" -gt 0 ]; then
  helm upgrade \
    $HELM_ARGS \
    --create-namespace \
    --install
else
  echo "No changes detected"
fi
