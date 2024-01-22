#!/bin/bash

RETRIES=20

until pg_isready -h postgres-service > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

if [ $RETRIES -eq 0 ]; then
  echo "Postgres server never came up, exiting"
  exit 1
fi

cd apps/api
npx prisma migrate deploy

NODE_ENV=production node dist/main