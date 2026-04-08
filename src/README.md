# Terminal Portfolio

Portfólio interativo em formato de terminal, com modo Terminal e modo GUI, construído com Next.js.

## Estado atual

- Terminal web com comandos shell básicos.
- GUI alternativa em `/gui`.
- Integração com runner externo (Docker) para preparar repositórios reais por projeto.
- Componentes refatorados para código limpo e manutenível.
- Visualização de arquivos com ícones inteligentes.

## Comandos suportados

| Comando | Descrição |
|---|---|
| `ls` | Lista arquivos e diretórios em coluna com ícones |
| `cd <dir>` | Navega entre diretórios |
| `cd ..` | Volta um nível |
| `cd /` ou `cd ~` | Volta para home |
| `cat <file>` | Mostra conteúdo de arquivo |
| `view <file>` | Abre arquivo no visualizador markdown (popup) |
| `pwd` | Mostra caminho atual |
| `help` | Lista comandos disponíveis |
| `clear` | Limpa o terminal |
| `gui` | Vai para modo GUI |
| `aboutme` | Texto de apresentação |

## Arquitetura resumida

### Frontend (Next.js)

- Rota inicial com seletor de modo.
- Terminal em `/terminal` com componentes bem separados.
- GUI em `/gui`.
- O terminal executa comandos chamando APIs internas do Next.

**Componentes principais:**
- `TerminalOutput.jsx` - Orquestrador de renderização
- `CommandLine.jsx` - Renderiza linhas de comando
- `TextLine.jsx` - Renderiza linhas de texto com typewriter adaptativo
- `LsOutput.jsx` - Renderiza saída do `ls` com ícones
- `TerminalInput.jsx` - Input e prompt
- `Typewriter.jsx` - Animação adaptativa por tamanho
- `FileViewer.jsx` - Popup centralizado para markdown

**Utilitários:**
- `file-icons.js` - Mapeamento de ícones para 25+ tipos de arquivo
- `terminal-utils.js` - Funções reutilizáveis (lock de clone, config typewriter)

### Backend interno (Next API)

- `POST /api/shell/execute` - Executa comandos
- `POST /api/fs/list` - Lista diretório
- `POST /api/fs/read` - Lê arquivo

### Runner externo (Docker)

Serviço dedicado para repositórios de projetos:

- `GET /health` - Verifica saúde
- `GET /projects` - Lista projetos disponíveis
- `POST /projects/prepare` - Prepara projeto (clone)
- `POST /projects/fs/list` - Lista dir em projeto clonado
- `POST /projects/fs/read` - Lê arquivo em projeto clonado
- `DELETE /projects/cleanup` - Limpa sessão temporária

## Comportamento de repositórios por projeto

- O cliente não envia `repoUrl`.
- O runner usa catálogo fixo por `projectId`.
- Ao entrar em um diretório de projeto, o clone é preparado sob demanda.
- Navegação e leitura (`ls`, `cat`, `view`) passam a usar o filesystem real clonado.
- Input fica protegido apenas durante `cd` para projetos (preservando foco).

## Limpeza automática de sessão de projeto

- Ao sair de um projeto com `cd`, inicia timer de limpeza de sessão.
- Se não voltar ao projeto em 60s (padrão), o workdir temporário é removido.
- Ao voltar antes do prazo, o timer é cancelado.
- Configuração: `PROJECT_IDLE_CLEANUP_MS` (default: `60000`).

## Características visuais

- **Paleta Discord-like**: fundo `#1e1f22`, prompt `#8ab4ff`, texto `#ffffff`
- **Ícones inteligentes**: Python 🐍, JavaScript 📜, C ©️, Dockerfile 🐳, PDF 📕, etc.
- **Gap visual**: espaçamento de 0.75rem entre blocos de output
- **Popup markdown**: viewer centralizado com backdrop escurecido
- **Typewriter adaptativo**: velocidade ajustada por tamanho da linha
- **Snapshot de prompt**: cada comando salva o prompt do momento de execução

## Setup local

1. Instalar dependências:

```bash
npm install
```

2. Subir runner externo:

```bash
docker compose up --build project-runner
```

3. Rodar app Next:

```bash
npm run dev
```

4. Abrir:

- http://localhost:3000

## Fluxo rápido com Make

- Desenvolvimento (runner em Docker + Next local):

```bash
make dev
```

- Subir só runner para testes locais:

```bash
make dev-runner
```

- Build e testes:

```bash
make test
```

- Produção (stack Docker completa):

```bash
make prod-up
make prod-logs
make prod-down
```

- Limpar:

```bash
make runner-clean
```

---

**Última atualização:** 31/03/2026

```bash
make dev-runner
```

- Validar build + compose:

```bash
make test
```

- Produção local em Docker (app + runner):

```bash
make prod-up
```

- Parar stack Docker:

```bash
make prod-down
```

Use `make help` para listar todos os targets.

## Observação

Para detalhes de contexto, decisões e backlog, consulte `README_CONTEXT.md`.