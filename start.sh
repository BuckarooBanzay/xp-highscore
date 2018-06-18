#!/bin/sh

export PGHOST=127.0.0.1
export PGUSER=postgres
export PGDATABASE=minetest
export PGPASSWORD=enter
export PGPORT=5432

node src/index.js

