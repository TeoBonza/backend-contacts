.PHONY: up down db-only stop-db

get-env-variables:
	cp .env.sample .env

up:
	docker-compose up --build

down:
	docker-compose down

secondary-only:
	docker-compose up -d postgres redis

stop-secondary:
	docker-compose stop postgres redis