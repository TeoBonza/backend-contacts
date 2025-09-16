#!/bin/sh

echo "PORT: $PORT"
echo "REDIS_URL: $REDIS_URL"

echo "Starting Redis..."
redis-server --daemonize yes \
             --dir /data \
             --save 60 1 \
             --loglevel warning \
             --bind 127.0.0.1 \
             --port 6379 \
             --protected-mode no

echo "Waiting that Redis is ready..."
timeout=30
count=0
until redis-cli -h 127.0.0.1 -p 6379 ping > /dev/null 2>&1; do
    if [ $count -ge $timeout ]; then
        echo "ERROR: Redis not started in $timeout seconds"
        exit 1
    fi
    echo "Attempt $((count+1))/$timeout..."
    sleep 1
    count=$((count+1))
done
echo "Redis is ready!"

redis-cli -h 127.0.0.1 -p 6379 info server | head -5

echo "Starting application Node.js on port ${PORT:-5001}..."
exec node server.js