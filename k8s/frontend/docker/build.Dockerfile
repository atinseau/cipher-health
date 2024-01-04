FROM node:alpine3.19

COPY . /app

WORKDIR /app

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build --filter=@cipher-health/frontend

CMD ["pnpm", "--filter", "@cipher-health/frontend", "start"]