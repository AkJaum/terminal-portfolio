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
