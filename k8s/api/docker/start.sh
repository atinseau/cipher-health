#!/bin/bash

POSTGRES_RETRIES=20
REDIS_RETRIES=20

until pg_isready -h postgres-service > /dev/null 2>&1 || [ $POSTGRES_RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

if [ $POSTGRES_RETRIES -eq 0 ]; then
  echo "Postgres server never came up, exiting"
  exit 1
fi

until redis-cli -h dragonfly-service ping > /dev/null || [ $REDIS_RETRIES -eq 0 ]; do
  echo "Waiting for redis server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

if [ $REDIS_RETRIES -eq 0 ]; then
  echo "Redis server never came up, exiting"
  exit 1
fi

cd apps/api
npx prisma migrate deploy

NODE_ENV=production node dist/main