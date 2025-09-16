#!/bin/sh

echo "Starting Redis..."
redis-server --daemonize yes --dir /data --save 60 1 --loglevel warning

echo "Waiting that Redis is ready..."
until redis-cli ping > /dev/null 2>&1; do
    sleep 1
done
echo "Redis is ready!"

echo "Start application Node.js..."
exec node server.js