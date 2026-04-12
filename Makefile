SHELL := /bin/bash

COMPOSE := docker compose
RUNNER_SERVICE := project-runner
APP_SERVICE := app
RUNNER_URL_LOCAL := http://localhost:8080
LOCAL_RUNNER_TOKEN ?= local-dev-runner-token
LOCAL_DJANGO_SECRET ?= local-dev-django-secret
COMPOSE_LOCAL_ENV := RUNNER_SHARED_TOKEN=$(LOCAL_RUNNER_TOKEN) DJANGO_SECRET_KEY=$(LOCAL_DJANGO_SECRET)

.PHONY: help install dev dev-runner dev-runner-logs dev-down test build prod-up prod-down prod-logs runner-clean

help:
	@echo "Targets disponíveis:"
	@echo "  make install          -> instala dependências do Next"
	@echo "  make dev-runner       -> sobe somente o runner (Docker) com build"
	@echo "  make dev              -> sobe runner (Docker) e roda Next em modo dev"
	@echo "  make dev-runner-logs  -> logs do runner"
	@echo "  make dev-down         -> derruba containers do compose"
	@echo "  make test             -> valida build do Next + config do compose"
	@echo "  make build            -> build de produção do Next"
	@echo "  make prod-up          -> builda e sobe app + runner via Docker"
	@echo "  make prod-down        -> derruba stack de produção"
	@echo "  make prod-logs        -> logs da stack de produção"
	@echo "  make runner-clean     -> remove workdirs temporários no runner"

install:
	npm install

dev-runner:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) up -d --build $(RUNNER_SERVICE)

dev:
	-$(COMPOSE_LOCAL_ENV) $(COMPOSE) stop $(APP_SERVICE)
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) up -d --build $(RUNNER_SERVICE)
	RUNNER_SHARED_TOKEN=$(LOCAL_RUNNER_TOKEN) PROJECT_RUNNER_URL=$(RUNNER_URL_LOCAL) PROJECT_IDLE_CLEANUP_MS=60000 npm run dev

dev-runner-logs:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) logs -f $(RUNNER_SERVICE)

dev-down:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) down

test:
	npm run build
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) config > /dev/null

build:
	npm run build

prod-up:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) up -d --build $(RUNNER_SERVICE) $(APP_SERVICE)

prod-down:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) down

prod-logs:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) logs -f $(RUNNER_SERVICE) $(APP_SERVICE)

runner-clean:
	$(COMPOSE_LOCAL_ENV) $(COMPOSE) exec -T $(RUNNER_SERVICE) sh -lc 'rm -rf /tmp/runner-workspaces/* || true'
