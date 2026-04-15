# README de Contexto

Este documento registra o estado técnico atual do app e define diretrizes para evolução com foco em escalabilidade.

## 1) Escopo atual do produto

- Interface Terminal: `/terminal`
- Interface GUI estilo desktop: `/gui`
- Filesystem virtual compartilhado entre terminal e GUI
- Integração com runner externo para projetos reais (clone/list/read/build/run)

## 2) Arquitetura vigente

### 2.1 Frontend (Next.js App Router)

- `src/app/page.js`: seleção de modo
- `src/app/terminal/page.js`: terminal client-side
- `src/app/gui/page.js`: desktop GUI e gerenciamento de janelas
- `src/app/components/terminal/*`: componentes de terminal
- `src/app/components/gui/*`: componentes de GUI (janelas, explorer, apps embutidos)

### 2.2 Backend interno do app (camada de domínio)

- `src/backend/core/filesystem.js`
- `src/backend/core/terminal.service.js`
- `src/backend/core/runner.service.js`
- `src/backend/core/project.catalog.js`

### 2.3 APIs internas (BFF)

- `POST /api/shell/execute`
- `POST /api/fs/list`
- `POST /api/fs/read`

### 2.4 Runner externo (isolamento)

Local em `services/project-runner`.

Responsável por:
- preparar projeto
- leitura/listagem de FS real
- build/run de projetos
- cleanup de sessão

## 3) Funcionalidades já implementadas

- GUI e terminal usando o mesmo núcleo de filesystem/operações.
- Janela de terminal embutida na GUI, com múltiplas instâncias.
- Explorer com ação de contexto para abrir terminal no diretório selecionado.
- Launchers renomeados para `terminal` e `dungeon4fun` (sem `.app`) mantendo ícones.
- Entrada raiz `README` sem extensão, renderizada como markdown.
- `README` da home virtual referenciando o arquivo real `src/README.md`.
- Sessão de projeto com cleanup por inatividade (`PROJECT_IDLE_CLEANUP_MS`).
- Comando `reclone` disponível no shell para resetar/preparar novamente o projeto atual no runner.

## 4) Decisões técnicas importantes

### 4.1 Fonte única de verdade para conteúdo markdown

A entrada `README` do filesystem virtual usa token de referência para `src/README.md`.

Impacto:
- evita duplicação de conteúdo
- reduz drift documental
- simplifica manutenção em evolução de produto

### 4.2 Isolamento de responsabilidades client/server

O frontend não deve importar módulos do backend core diretamente.

Regra:
- cliente usa apenas APIs internas (`/api/*`)
- backend core pode usar APIs Node (`fs`, `path`)

Isso evita erros de bundling no browser e melhora a escalabilidade do código.

### 4.3 Execução de projetos em runner dedicado

Build e run não devem ocorrer no processo do Next app.

Benefícios:
- isolamento de recursos e segurança
- escalabilidade horizontal do runner
- menor risco de travamento do servidor web

## 5) Riscos e pontos de atenção atuais

- Build de produção acusa erro de prerender em `/terminal` por uso de `useSearchParams()` sem fronteira de `Suspense`.
- É necessário tratar o modo de rendering de `/terminal` para estabilizar build CI/CD.
- Há volume grande de arquivos novos/modificados no workspace, exigindo commits por escopo para facilitar rollback.

## 6) Diretrizes de escalabilidade (curto e médio prazo)

### 6.1 Escalabilidade de código

1. Separar contratos de domínio em módulos versionados:
   - `core/contracts/shell`
   - `core/contracts/filesystem`
2. Padronizar shape de resposta das APIs internas com tipos explícitos.
3. Extrair validações de input dos endpoints para camada compartilhada.

### 6.2 Escalabilidade de runtime

1. Tornar `project-runner` stateless e replicável.
2. Persistir metadados de sessão (prepare/build/run) em storage externo (Redis/Postgres).
3. Implementar fila para jobs de build/run (BullMQ, RabbitMQ ou equivalente).
4. Adicionar limites por usuário/sessão (concorrência, CPU, memória, timeout).

### 6.3 Escalabilidade de observabilidade

1. Logs estruturados com `requestId`, `sessionId`, `projectId`.
2. Métricas mínimas:
   - tempo de `prepare`
   - taxa de erro por endpoint
   - tempo médio de build/run
3. Tracing entre Next API e runner.

### 6.4 Escalabilidade de UX

1. Virtualização para listas grandes no explorer.
2. Persistência de estado de janelas (posição/tamanho) por sessão.
3. Feedback progressivo de operações longas (prepare/build/run) com status em tempo real.

## 7) Backlog recomendado

### Prioridade alta

- Corrigir prerender da rota `/terminal` para build de produção estável.
- Introduzir tipagem compartilhada para payloads de `/api/shell/execute`, `/api/fs/list`, `/api/fs/read`.
- Adicionar testes de integração para fluxo: `cd projeto -> ls -> cat/view -> make/run`.

### Prioridade média

- Implementar stream de logs do runner para GUI/terminal.
- Implementar cache de leitura de arquivos com invalidação por sessão.
- Criar política de retries e circuit breaker na integração com runner.

### Prioridade baixa

- Internacionalização da interface.
- Perfis de tema/skin do desktop GUI.
- Plugins de comandos adicionais.

## 8) Regras para próximas mudanças

- Qualquer mudança de comando deve atualizar:
  - `terminal.service`
  - endpoint `/api/shell/execute`
  - documentação em `README.md`
- Qualquer mudança no filesystem virtual deve validar GUI e terminal.
- Evitar acoplamento de UI a detalhes de runner (manter BFF como fronteira).
- Atualizar este arquivo ao fim de cada entrega relevante com decisões e trade-offs.
