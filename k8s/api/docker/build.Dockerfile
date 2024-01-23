FROM node:20-bookworm-slim

COPY . /app
COPY ./k8s/api/docker/start.sh /tmp/start.sh

WORKDIR /app

# Remove unneeded apps
RUN rm -rf apps/frontend apps/crm

RUN apt-get update && apt-get install postgresql-client redis-tools -y

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@cipher-health/api


CMD ["/bin/bash", "/tmp/start.sh"]