#!/bin/bash

RETRIES=5

until pg_isready -h postgres-service > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

cd apps/api
npx prisma migrate deploy

NODE_ENV=production node dist/main