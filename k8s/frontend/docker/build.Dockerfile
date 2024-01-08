FROM node:20-alpine3.18

COPY . /app

WORKDIR /app

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@cipher-health/frontend


CMD ["pnpm", "--filter=@cipher-health/frontend", "start"]