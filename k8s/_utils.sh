eval $(minikube docker-env)

# Build and push a docker image to GHCR
# To use:
# DIGEST=$(build_ghcr $IMAGE_NAME $IMAGE_TAG)
# and then use $DIGEST in your helm chart to pulling the right image
# Returns the digest of the pushed image
function ghcr_build_and_push() {

  local IMAGE_NAME="atinseau/$1"
  local IMAGE_TAG=$2
  local DOCKERFILE=$3
  local CONTEXT=$4
  local DOCKER_BUILD_ARGS=${@:5}

  local GHCR_IMAGE_NAME="ghcr.io/$IMAGE_NAME:$IMAGE_TAG"

  if [[ -z "$CR_PAT" ]]; then
    echo "CR_PAT is not set"
    exit 1
  fi

  docker build \
    -t $IMAGE_NAME \
    -f $DOCKERFILE \
    $DOCKER_BUILD_ARGS \
    $CONTEXT

  echo $CR_PAT | docker login ghcr.io -u atinseau --password-stdin
  IMAGE_ID=$(docker images -q $IMAGE_NAME)
  docker tag $IMAGE_ID $GHCR_IMAGE_NAME
  docker push $GHCR_IMAGE_NAME 

  GHCR_BUILD_AND_PUSH_RETURN=$(docker manifest inspect $GHCR_IMAGE_NAME -v | jq -r '.Descriptor.digest')
}


# Create a secret to pull from GHCR
function ghcr_create_secret() {

  if [[ -z "$CR_PAT" ]]; then
    echo "CR_PAT is not set"
    exit 1
  fi

  kubectl create secret docker-registry regcred \
    -n local \
    --docker-server=https://ghcr.io \
    --docker-username=atinseau \
    --docker-password=$CR_PAT \
    --docker-email=arthurtinseau@live.fr 2> /dev/null || true
}


function ghcr_helm_image_args() {

  local NAMESPACE=$1
  local IMAGE_NAME=$2
  local IMAGE_DIGEST=$3

  GHCR_HELM_IMAGE_ARGS_RETURN="\
    --set ${NAMESPACE}.image.name=ghcr.io/atinseau/${IMAGE_NAME}@${IMAGE_DIGEST} \
    --set ${NAMESPACE}.image.pullSecrets.name=regcred \
    --set ${NAMESPACE}.image.pullPolicy=Always \
  "
}


function helm_install() {

  local RELEASE=$1
  local VALUES=$2
  local PRINT_TEMPLATE=$3
  local ARGS=${@:4}

  HELM_ARGS="\
    $RELEASE ./helm/ \
    -n local \
    -f $VALUES \
    $ARGS \
  "

  if [[ $PRINT_TEMPLATE == 1 ]]; then
    helm template --debug $HELM_ARGS --dry-run
    return
  fi

  HELM_DIFF=$(helm diff upgrade $HELM_ARGS --allow-unreleased | wc -l)
  if [ "$HELM_DIFF" -gt 0 ]; then
    helm upgrade \
      $HELM_ARGS \
      --create-namespace \
      --install
  else
    echo "No changes detected"
  fi
}

function local_deploy() {

  local NAMESPACE=$1
  local DEPLOY_USE_GHCR=$2
  local IMAGE_NAME=$3
  local IMAGE_TAG=$4
  local DOCKERFILE=$5
  local CONTEXT=$6
  local RELEASE=$7
  local DOCKER_BUILD_ARGS=${@:8}

  if [[ -z "$NAMESPACE" ]]; then
    echo "NAMESPACE is not set"
    exit 1
  fi

  if [[ -z "$DEPLOY_USE_GHCR" ]]; then
    echo "DEPLOY_USE_GHCR is not set"
    exit 1
  fi

  if [[ "$DEPLOY_USE_GHCR" != 0 ]] && [[ "$DEPLOY_USE_GHCR" != 1 ]]; then
    echo "DEPLOY_USE_GHCR must be 0 or 1"
    exit 1
  fi

  if [[ -z "$IMAGE_NAME" ]]; then
    echo "IMAGE_NAME is not set"
    exit 1
  fi

  if [[ -z "$IMAGE_TAG" ]]; then
    echo "IMAGE_TAG is not set"
    exit 1
  fi

  if [[ -z "$DOCKERFILE" ]]; then
    echo "DOCKERFILE is not set"
    exit 1
  fi

  if ! [[ -f "$DOCKERFILE" ]]; then
    echo "DOCKERFILE does not exist"
    exit 1
  fi

  if [[ -z "$CONTEXT" ]]; then
    echo "CONTEXT is not set"
    exit 1
  fi

  if ! [[ -d "$CONTEXT" ]]; then
    echo "CONTEXT does not exist"
    exit 1
  fi

  if [[ -z "$RELEASE" ]]; then
    echo "RELEASE is not set"
    exit 1
  fi

  local LOCAL_HELM_ARGS=""

  if [[ "$DEPLOY_USE_GHCR" == 1 ]]; then
    ghcr_build_and_push $IMAGE_NAME $IMAGE_TAG $DOCKERFILE $CONTEXT $DOCKER_BUILD_ARGS
    ghcr_create_secret
    ghcr_helm_image_args $NAMESPACE $IMAGE_NAME $GHCR_BUILD_AND_PUSH_RETURN
    LOCAL_HELM_ARGS=$GHCR_HELM_IMAGE_ARGS_RETURN
  else
    docker build \
      -t $IMAGE_NAME:$IMAGE_TAG \
      -f $DOCKERFILE \
      $DOCKER_BUILD_ARGS \
      $CONTEXT

    LOCAL_HELM_ARGS="\
      --set ${NAMESPACE}.image.name=${IMAGE_NAME}:${IMAGE_TAG} \
      --set ${NAMESPACE}.image.pullPolicy=Never \
    "
    helm uninstall $RELEASE -n local
  fi

  LOCAL_DEPLOY_RETURN=$LOCAL_HELM_ARGS
}