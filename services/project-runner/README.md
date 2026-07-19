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
- `PROJECT_REPO_A_MAZE_ING`
- `PROJECT_BRANCH_PUSH_SWAP` (default: `main`)
- `PROJECT_BRANCH_GET_NEXT_LINE` (default: `main`)
- `PROJECT_BRANCH_PRINTF` (default: `main`)
- `PROJECT_BRANCH_A_MAZE_ING` (default: `master`)
- `PROJECT_RUN_TIMEOUT_A_MAZE_ING_MS` (default: `30000`)
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
- `MAX_PTY_BUFFER_BYTES` (default: `524288`)
- `MAX_PTY_INPUT_BYTES` (default: `4096`)
- `PTY_MAX_LIFETIME_SECONDS` (default: `300`)
- `DJANGO_SECRET_KEY` (obrigatório em produção)
- `DJANGO_ALLOWED_HOSTS` (CSV, ex.: `localhost,127.0.0.1,project-runner`)

O arquivo `.env` na raiz é a única fonte local para `RUNNER_SHARED_TOKEN` e
`DJANGO_SECRET_KEY`. Tanto `docker compose` quanto os alvos do Makefile usam
esses mesmos valores; não existe mais um token local alternativo no Makefile.

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

Scripts Python allowlisted pelo BFF podem ser executados de duas formas. O
endpoint legado de run continua usando `python3 -u` sem shell e saída capturada.
Projetos interativos usam os endpoints `projects/process/*`, que conectam o
processo a um pseudo-terminal real, entregam a saída incrementalmente e recebem
teclas enquanto o processo permanece ativo.

O PTY valida dimensões, limita input e buffer pendente, possui vida máxima de
cinco minutos e é encerrado junto com o workspace quando o popup fecha. O
A-Maze-ing, portanto, preserva a animação original e aguarda as opções 1 a 6 do
próprio programa em vez de receber uma opção de saída predefinida.

## Stack

- Django (views HTTP + roteamento)
- Gunicorn (WSGI server)
- Sessão em memória por `projectId` para mapear workdir temporário

Quando `sessionId` é enviado, o workspace é isolado pela combinação
`sessionId + projectId`. Chamadas antigas sem `sessionId` continuam usando a
sessão legada para preservar compatibilidade com o terminal original.

## Pacote reutilizável

O diretório `packages/project-terminal` exporta:

- `ProjectTerminalModal`: popup React de tela cheia para um projeto específico.
- `createProjectTerminalHandlers`: adaptador server-only para Route Handlers do Next.js.
- `styles.css`: estilos encapsulados pelo prefixo `ak-terminal-modal`.

O renderer interativo usa uma grade de 100 colunas por 46 linhas e aplica as
sequências ANSI sobre células, como um terminal: SGR de 16 cores, 256 cores e
RGB, cursor home/movement, limpeza de linha/tela, carriage return, backspace e
scroll. Cada caractere ocupa uma célula CSS independente com largura exata de
`1ch`; a fonte monoespaçada também desativa ligaduras, métricas fracionárias e
quebra automática para manter espaços, blocos e box drawing alinhados.

O navegador chama somente o Route Handler do site consumidor. O handler mantém
`RUNNER_SHARED_TOKEN` no servidor, valida a lista de projetos e encaminha as
operações permitidas ao runner.

## Observação

Este serviço roda em container **separado do Next.js** e mantém o mesmo contrato HTTP esperado pelo frontend/Next.
