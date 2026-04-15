# Terminal Portfolio

Portfolio interativo com duas interfaces para a mesma base de comandos:
- Terminal em `/terminal`
- Desktop GUI em `/gui`

A aplicação usa Next.js (App Router), uma camada backend interna para comandos/filesystem e um runner externo para preparar/ler/executar projetos reais em isolamento.

## Estado atual

- Terminal funcional com autocomplete, histórico e viewer de arquivos.
- GUI com janelas arrastáveis/redimensionáveis, taskbar e múltiplas instâncias.
- Terminal embutido na GUI (abre silencioso quando lançado pela interface gráfica).
- Launchers de desktop sem sufixo `.app` (`terminal`, `dungeon4fun`).
- Entrada raiz `README` no desktop/terminal que referencia o arquivo real `src/README.md`.
- Runner externo (Docker) para clone sob demanda e leitura/build/run por projeto.
- Comando `reclone` para resetar e preparar novamente o projeto atual no runner.
- Limpeza automática de sessão de projeto por inatividade.

## Comandos suportados

| Comando | Descrição |
|---|---|
| `ls` | Lista arquivos e diretórios com ícones |
| `cd <dir>` | Navega entre diretórios |
| `cd ..` | Volta um nível |
| `cd /` ou `cd ~` | Volta para home |
| `cat <file>` | Mostra conteúdo do arquivo |
| `view <file>` | Abre visualizador (markdown/texto/código) |
| `vim <file>` | Abre visualização no modo de edição/simulação |
| `make [args]` | Build de projeto via runner |
| `run <exec> [args]` | Executa binário/arquivo via runner |
| `reclone` | Recria o workspace do projeto atual no runner |
| `pwd` | Mostra caminho atual |
| `help` | Lista comandos |
| `clear` | Limpa o terminal |
| `gui` | Navega para o modo GUI |
| `aboutme` | Texto de apresentação |

Também é possível executar binários diretamente com `./<executavel> [args...]` dentro de um projeto preparado.

## Arquitetura

### Frontend

- `src/app/page.js`: seletor de modo.
- `src/app/terminal/page.js`: terminal com estado local, histórico e autocomplete.
- `src/app/gui/page.js`: desktop GUI, gerenciamento de janelas e launchers.
- `src/app/components/`: componentes reutilizáveis de terminal e GUI.

### Backend interno (Next API)

- `POST /api/shell/execute`
- `POST /api/fs/list`
- `POST /api/fs/read`

Camadas core:
- `src/backend/core/filesystem.js`: estrutura estática de filesystem.
- `src/backend/core/terminal.service.js`: semântica dos comandos.
- `src/backend/core/runner.service.js`: integração com runner externo.
- `src/backend/core/project.catalog.js`: catálogo de projetos versionados.

### Runner externo

Serviço isolado em `services/project-runner` para:
- preparar projeto (`/projects/prepare`)
- listar/lêr arquivos (`/projects/fs/list`, `/projects/fs/read`)
- build e run (`/projects/build`, `/projects/run`)
- cleanup (`/projects/cleanup`)

## Referência real para README da home virtual

A entrada `README` no filesystem virtual não duplica conteúdo.
Ela aponta para `src/README.md` por token de referência (`__REF__`) e o backend resolve a leitura no servidor.

Benefícios:
- elimina divergência entre README virtual e README real
- mantém única fonte de verdade
- preserva render markdown sem depender de extensão `.md`

## Setup local

1. Instalar dependências

```bash
npm install
```

2. Subir runner

```bash
docker compose up --build project-runner
```

3. Rodar app

```bash
npm run dev
```

4. Acessar

- http://localhost:3000

## Fluxo com Make

```bash
make dev
make dev-runner
make test
make prod-up
make prod-logs
make prod-down
make runner-clean
```

## Observações importantes

- Build de produção atualmente pode falhar na rota `/terminal` se `useSearchParams()` não estiver encapsulado em `Suspense` para prerender.
- `npm --prefix web run build` não é aplicável neste repositório (não existe pasta `web/`).

## Documentação complementar

Para decisões técnicas, histórico de arquitetura e plano de escalabilidade, consulte `README_CONTEXT.md`.
