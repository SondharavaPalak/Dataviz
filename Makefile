.PHONY: help build up down logs shell migrate createsuperuser redis-cli psql clean restart rebuild

help:
	@echo "Available Docker commands for Sem4 Project"
	@echo "=========================================="
	@echo "make build              - Build Docker images"
	@echo "make up                 - Start all services"
	@echo "make up-detached        - Start all services in background"
	@echo "make down               - Stop all services"
	@echo "make restart            - Restart all services"
	@echo "make rebuild            - Rebuild images and start services"
	@echo "make logs               - View logs from all services"
	@echo "make logs-backend       - View backend logs"
	@echo "make logs-frontend      - View frontend logs"
	@echo "make logs-db            - View database logs"
	@echo "make shell              - Django shell"
	@echo "make bash-backend       - Bash shell in backend container"
	@echo "make bash-frontend      - Bash shell in frontend container"
	@echo "make migrate            - Run Django migrations"
	@echo "make migrations         - Create migrations"
	@echo "make createsuperuser    - Create Django superuser"
	@echo "make psql               - Connect to PostgreSQL"
	@echo "make redis-cli          - Connect to Redis"
	@echo "make backup-db          - Backup PostgreSQL database"
	@echo "make clean              - Remove all containers and volumes"
	@echo "make status             - Show services status"
	@echo "make setup              - First-time setup"

build:
	docker-compose build

up:
	docker-compose up

up-detached:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

rebuild: clean
	docker-compose up --build -d

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f db

shell:
	docker-compose exec backend python manage.py shell

bash-backend:
	docker-compose exec backend /bin/bash

bash-frontend:
	docker-compose exec frontend /bin/sh

migrate:
	docker-compose exec backend python manage.py migrate

migrations:
	docker-compose exec backend python manage.py makemigrations

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

psql:
	docker-compose exec db psql -U sem4_user -d sem4_db

redis-cli:
	docker-compose exec redis redis-cli

backup-db:
	docker-compose exec db pg_dump -U sem4_user sem4_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

clean:
	docker-compose down -v
	docker system prune -f

status:
	docker-compose ps

setup:
	@if not exist .env copy .env.example .env
	docker-compose up --build -d
	@echo "Services are starting..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "Admin:    http://localhost:8000/admin"
