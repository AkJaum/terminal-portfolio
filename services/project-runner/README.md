# Project Runner Service (Django)

Serviço backend em Python + Django dedicado para operações pesadas de projeto:

- preparar diretório temporário por projeto
- clonar repositórios fixos por catálogo (`projectId`)
- expor filesystem real do repositório clonado
- limpar workdir temporário por projeto

## Endpoints

- `GET /health`
- `GET /projects`
- `POST /projects/prepare`
- `POST /projects/fs/list`
- `POST /projects/fs/read`
- `POST /projects/build`
- `POST /projects/run`
- `DELETE /projects/cleanup`

## Contrato atual

- Entrada pública usa `projectId`.
- `repoUrl` não é aceito do cliente.
- O mapeamento `projectId -> repoUrl/branch` é interno e configurável por variável de ambiente.

## Variáveis de ambiente principais

- `PORT` (default: `8080`)
- `WORKDIR_BASE` (default: `/tmp/runner-workspaces`)
- `MAX_FILE_SIZE_BYTES` (default: `8388608`)
- `PROJECT_REPO_PUSH_SWAP`
- `PROJECT_REPO_GET_NEXT_LINE`
- `PROJECT_REPO_PRINTF`
- `PROJECT_REPO_LIBFT`
- `PROJECT_BRANCH_PUSH_SWAP` (default: `main`)
- `PROJECT_BRANCH_GET_NEXT_LINE` (default: `main`)
- `PROJECT_BRANCH_PRINTF` (default: `main`)
- `PROJECT_BRANCH_LIBFT` (default: `main`)

## Segurança e resiliência

O serviço agora inclui controles de proteção para reduzir abuso e impacto operacional:

- autenticação interna opcional por token (`X-Runner-Token`)
- rate limit por identificador (`X-Client-Id` ou `projectId`)
- limite de concorrência por identificador e global
- monitoramento de chamadas pendentes sem resposta
- timeouts de execução de `build` e `run`
- truncamento de saída para evitar payloads gigantes
- retorno de erro genérico em falhas internas (sem vazar detalhes de stack)

Variáveis adicionais:

- `RUNNER_SHARED_TOKEN` (se definido, exige header `X-Runner-Token`)
- `MAX_REQUESTS_PER_ID_PER_MINUTE` (default: `120`)
- `RATE_WINDOW_SECONDS` (default: `60`)
- `MAX_CONCURRENT_REQUESTS_PER_ID` (default: `6`)
- `MAX_GLOBAL_CONCURRENT_REQUESTS` (default: `64`)
- `PENDING_REQUEST_TTL_SECONDS` (default: `30`)
- `BUILD_TIMEOUT_MS` (default: `30000`)
- `RUN_TIMEOUT_MS` (default: `10000`)
- `MAX_OUTPUT_BYTES` (default: `262144`)
- `DJANGO_SECRET_KEY` (obrigatório em produção)
- `DJANGO_ALLOWED_HOSTS` (CSV, ex.: `localhost,127.0.0.1,project-runner`)

## Configuração segura de variáveis (Ubuntu Server)

1. Na raiz do projeto, copie o template:

```bash
cp .env.server.example .env
```

2. Edite o arquivo `.env` e troque os placeholders:

- `RUNNER_SHARED_TOKEN`: token longo e aleatório (usado entre app e runner).
- `DJANGO_SECRET_KEY`: segredo forte do Django.
- `PROJECT_RUNNER_URL`: URL pública HTTPS do runner (ex.: `https://runner.example.com`).
- `DJANGO_ALLOWED_HOSTS`: inclua o domínio real do runner.

3. Suba o runner com as variáveis carregadas pelo Docker Compose:

```bash
docker compose up -d --build project-runner
```

4. Para rodar app + runner no host de deploy:

```bash
docker compose up -d --build
```

5. Nunca commite `.env` com segredos reais. O projeto já ignora `.env*` e mantém apenas templates versionados.

## Toolchain no container

Imagem do runner já inclui ferramentas para a próxima fase de build/run:

- `git`
- `bash`
- `make`
- `gcc`, `g++`, `musl-dev`
- `python3`, `pip`

## Stack

- Django (views HTTP + roteamento)
- Gunicorn (WSGI server)
- Sessão em memória por `projectId` para mapear workdir temporário

## Observação

Este serviço roda em container **separado do Next.js** e mantém o mesmo contrato HTTP esperado pelo frontend/Next.
