.PHONY: up down db-only stop-db

get-env-variables:
	cp .env .env.sample

up:
	docker-compose up --build

down:
	docker-compose down

secondary-only:
	docker-compose up -d mongo redis

stop-secondary:
	docker-compose stop mongo redis