#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname="$POSTGRES_DB" <<-EOSQL
	CREATE USER ${POSTGRES_CRM_USER} WITH PASSWORD '${POSTGRES_CRM_PASSWORD}';
	CREATE DATABASE ${POSTGRES_CRM_DB} OWNER ${POSTGRES_CRM_USER};
	GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_CRM_DB} TO ${POSTGRES_CRM_USER};

  DROP DATABASE IF EXISTS postgres;

EOSQLhttps://stackoverflow.com/users