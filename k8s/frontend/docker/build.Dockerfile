FROM node:20-bookworm-slim

ARG NEXT_PUBLIC_API_HOST
ARG API_HOST

ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ENV API_HOST=$API_HOST

COPY . /app

WORKDIR /app

# Remove unneeded apps
RUN rm -rf apps/crm

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@cipher-health/frontend


CMD ["pnpm", "--filter=@cipher-health/frontend", "start"]