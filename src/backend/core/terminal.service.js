// Backend core: terminal commands and business rules
import { listEntriesAtPath, readFileAtPath, readFilePayloadAtPath, buildProjectAtPath, runProjectExecutableAtPath, scheduleProjectCleanup, cancelProjectCleanup } from "./runner.service";
import { resolveProjectFromPath } from "./project.catalog";
import { readFileSync } from "fs";
import path from "path";

const HELP_ENTRIES = [
	{
		command: "ls",
		usage: "ls [caminho]",
		description: "Lista arquivos e pastas do diretório atual ou de um caminho informado.",
		example: "ls src/app",
	},
	{
		command: "cd",
		usage: "cd <dir> | cd .. | cd / | cd ~",
		description: "Navega entre diretórios e volta para a pasta anterior ou para a home.",
		example: "cd ../backend",
	},
	{
		command: "cat",
		usage: "cat <arquivo>",
		description: "Mostra o conteúdo bruto de um arquivo de texto.",
		example: "cat README.md",
	},
	{
		command: "view",
		usage: "view <arquivo>",
		description: "Abre o arquivo no visualizador do terminal, com suporte a markdown.",
		example: "view README.md",
	},
	{
		command: "vim",
		usage: "vim <arquivo>",
		description: "Abre o arquivo em modo editor/visualização rápida dentro do terminal.",
		example: "vim src/app/page.js",
	},
	{
		command: "make",
		usage: "make [args...]",
		description: "Dispara os fluxos de build do projeto pela runtime conectada ao runner.",
		example: "make dev",
	},
	{
		command: "run",
		usage: "run <executavel> [args...]",
		description: "Executa um binario do projeto no runner e exibe a saida na tela.",
		example: "run ./dist/app",
	},
	{
		command: "pwd",
		usage: "pwd",
		description: "Mostra o caminho atual dentro do terminal.",
		example: "pwd",
	},
	{
		command: "help",
		usage: "help [comando]",
		description: "Exibe a ajuda completa ou detalhes de um comando especifico.",
		example: "help cd",
	},
	{
		command: "clear",
		usage: "clear",
		description: "Limpa a tela do terminal e remove a saida anterior.",
		example: "clear",
	},
	{
		command: "gui",
		usage: "gui",
		description: "Abre a interface grafica alternativa do portfolio.",
		example: "gui",
	},
	{
		command: "aboutme",
		usage: "aboutme",
		description: "Mostra uma apresentacao curta sobre mim e o portfolio.",
		example: "aboutme",
	},
];

const COMMANDS = HELP_ENTRIES.map(({ command }) => command);
const HELP_ENTRY_BY_COMMAND = new Map(HELP_ENTRIES.map((entry) => [entry.command, entry]));

function extractFileExtension(name, isDir) {
	if (isDir) return "";
	const lastDot = String(name).lastIndexOf(".");
	if (lastDot <= 0 || lastDot === name.length - 1) return "";
	return String(name).slice(lastDot + 1).toLowerCase();
}

function sortLsEntries(entries = []) {
	return [...entries].sort((a, b) => {
		if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;

		if (a.isDir && b.isDir) {
			return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
		}

		const byExt = a.ext.localeCompare(b.ext, "pt-BR", { sensitivity: "base" });
		if (byExt !== 0) return byExt;

		return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
	});
}

function normalizeFileOutput(raw) {
	const content = typeof raw === "string" ? raw : String(raw ?? "");
	const normalizedLineBreaks = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// fallback: when source contains escaped tokens instead of real control chars
	if (!normalizedLineBreaks.includes("\n") && normalizedLineBreaks.includes("\\n")) {
		return normalizedLineBreaks.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
	}

	return normalizedLineBreaks;
}

function resolveStaticFileReference(value) {
	if (typeof value !== "string" || !value.startsWith("__REF__:")) {
		return value;
	}

	const refPath = value.slice("__REF__:".length);
	const absolutePath = path.resolve(process.cwd(), refPath);
	return readFileSync(absolutePath, "utf8");
}

function getCurrentDir(fs, path) {
	return path.reduce((dir, folder) => {
		if (!dir[folder]) throw `Error: diretório ${folder} não existe`;
		return dir[folder];
	}, fs);
}

function cd(fs, currentPath, target) {
	if (!target || target === "~" || target === "/") return { newPath: ["home"] };

	const newPath = [...currentPath];
	const parts = target.split("/").filter(Boolean);

	for (const part of parts) {
		if (part === "..") {
			if (newPath.length > 1) newPath.pop();
			continue;
		}

		const dir = getCurrentDir(fs, newPath);
		if (dir.error) return { error: dir.error };
		if (!dir[part]) return { error: `${part} não existe` };
		if (typeof dir[part] !== "object") return { error: `${part} não é um diretório` };

		newPath.push(part);
	}

	return { newPath };
}

function ls(fs, path) {
	const dir = getCurrentDir(fs, path);

	if (dir.error) return { error: dir.error };
	if (typeof dir !== "object") return { error: "não é um diretório" };

	const entries = Object.entries(dir).map(([name, value]) => {
		const isDir = typeof value === "object";
		const ext = name === "README" ? "md" : extractFileExtension(name, isDir);
		return { name, isDir, ext };
	});

	return { type: "ls", output: sortLsEntries(entries) };
}

function cat(fs, path, file) {
	const dir = getCurrentDir(fs, path);

	if (dir.error) return { error: dir.error };
	if (!file) return { error: `Error: arquivo não especificado` };
	if (!dir[file]) return { error: `Error: ${file} não existe` };
	if (typeof dir[file] === "object") return { error: `Error: ${file} é um diretório` };

	const content = resolveStaticFileReference(dir[file]);
	return { output: normalizeFileOutput(content), kind: file === "README" ? "markdown" : "text" };
}

function pwd(_fs, path) {
	return { output: "/" + path.slice(1).join("/") };
}

function padRight(value, size) {
	return String(value).padEnd(size, " ");
}

function formatHelpTable(entries) {
	const rows = [
		{ command: "COMANDO", usage: "USO", description: "PARA QUE SERVE" },
		...entries,
	];

	const widths = rows.reduce(
		(acc, row) => ({
			command: Math.max(acc.command, String(row.command).length),
			usage: Math.max(acc.usage, String(row.usage).length),
			description: Math.max(acc.description, String(row.description).length),
		}),
		{ command: 0, usage: 0, description: 0 }
	);

	return rows
		.map(
			(row) =>
				`${padRight(row.command, widths.command)}  ${padRight(row.usage, widths.usage)}  ${row.description}`
		)
		.join("\n");
}

function formatHelpDetail(entry) {
	return [
		`Comando: ${entry.command}`,
		`Uso: ${entry.usage}`,
		`Para que serve: ${entry.description}`,
		`Exemplo: ${entry.example}`,
	].join("\n");
}

function help(commandName) {
	const requestedCommand = String(commandName || "").trim().toLowerCase();

	if (requestedCommand) {
		const entry = HELP_ENTRY_BY_COMMAND.get(requestedCommand);
		if (!entry) {
			return { error: `Error: comando ${requestedCommand} não encontrado` };
		}

		return { output: formatHelpDetail(entry) };
	}

	return {
		output: [
			"Comandos disponiveis:",
			formatHelpTable(HELP_ENTRIES),
			"",
			"Dica: use help <comando> para ver detalhes de uso.",
		].join("\n"),
	};
}

function clear() {
	return { type: "clear" };
}

function gui() {
	return { type: "gui" };
}

function aboutme() {
	return { output: "Inserir texto aboutme aqui." };
}

function view(fs, path, file) {
	const dir = getCurrentDir(fs, path);

	if (!file) return { error: `Error: arquivo não especificado` };
	if (!dir[file]) return { error: `Error: ${file} não existe` };
	if (typeof dir[file] === "object") return { error: `Error: ${file} é um diretório` };

	const content = resolveStaticFileReference(dir[file]);
	return { output: normalizeFileOutput(content), kind: file === "README" ? "markdown" : "text" };
}

function vim(fs, path, file) {
	return view(fs, path, file);
}

function make(_fs, path) {
	const projectCtx = resolveProjectFromPath(path);
	if (!projectCtx) return { error: "Error: comando disponível apenas dentro de projetos" };
	return { output: "Use a API runtime para executar build." };
}

function run(_fs, path, executable) {
	const projectCtx = resolveProjectFromPath(path);
	if (!projectCtx) return { error: "Error: comando disponível apenas dentro de projetos" };
	if (!executable) return { error: "Error: executável não especificado" };
	return { output: "Use a API runtime para executar binários." };
}

async function lsRuntime(path) {
	try {
		const items = await listEntriesAtPath(path);
		const entries = items.map((item) => {
			// Suporta tanto `isDir` (do runner) quanto `type` (do filesystem estático)
			const isDir = item.isDir !== undefined ? item.isDir : item.type === "dir";
			const ext = extractFileExtension(item.name, isDir);
			return { name: item.name, isDir, ext };
		});
		return { type: "ls", output: sortLsEntries(entries) };
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao listar diretório"}` };
	}
}

async function catRuntime(path, file) {
	try {
		const content = await readFileAtPath(path, file);
		return { output: normalizeFileOutput(content) };
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao ler arquivo"}` };
	}
}

async function viewRuntime(path, file) {
	try {
		const payload = await readFilePayloadAtPath(path, file);
		if (payload.kind === "text" || payload.kind === "markdown") {
			return {
				type: "view",
				output: {
					...payload,
					content: normalizeFileOutput(payload.content || ""),
				},
			};
		}

		return { type: "view", output: payload };
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao ler arquivo"}` };
	}
}

async function vimRuntime(path, file) {
	try {
		const payload = await readFilePayloadAtPath(path, file);
		if (payload.kind !== "text" && payload.kind !== "markdown" && payload.kind !== "code") {
			return {
				error: "Error: arquivo não suportado para vim (apenas texto, markdown e código)",
			};
		}

		return {
			type: "view",
			output: {
				...payload,
				kind: payload.kind === "code" ? "code" : "text",
				content: normalizeFileOutput(payload.content || ""),
				viewerMode: "vim",
			},
		};
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao ler arquivo"}` };
	}
}

async function makeRuntime(path, args = []) {
	try {
		const build = await buildProjectAtPath(path, args);
		const output = normalizeFileOutput(build.output || "");
		const summary = `\n[make] exit code: ${build.exitCode} (${build.success ? "sucesso" : "falha"})`;

		return {
			type: "make",
			output: `${output}${summary}`.trim(),
			success: build.success,
			exitCode: build.exitCode,
		};
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao executar make"}` };
	}
}

async function runRuntime(path, executable, args = []) {
	try {
		if (!executable) {
			return { error: "Error: executável não especificado" };
		}

		const normalizedExecutable = executable.startsWith("./")
			? executable.slice(2)
			: executable;

		const runResult = await runProjectExecutableAtPath(path, normalizedExecutable, args);
		const output = normalizeFileOutput(runResult.output || "");
		const timeoutLabel = runResult.timedOut ? "timeout" : runResult.success ? "sucesso" : "falha";
		const summary = `\n[run] exit code: ${runResult.exitCode} (${timeoutLabel})`;

		return {
			type: "run",
			output: `${output}${summary}`.trim(),
			success: runResult.success,
			exitCode: runResult.exitCode,
			timedOut: runResult.timedOut,
		};
	} catch (error) {
		return { error: `Error: ${error?.message || "erro ao executar binário"}` };
	}
}

async function cdRuntime(currentPath, target) {
	const previousProjectCtx = resolveProjectFromPath(currentPath);

	if (!target || target === "~" || target === "/") {
		const newPath = ["home"];
		if (previousProjectCtx) scheduleProjectCleanup(previousProjectCtx.projectId);
		return { newPath };
	}

	const newPath = [...currentPath];
	const parts = target.split("/").filter(Boolean);

	for (const part of parts) {
		if (part === "..") {
			if (newPath.length > 1) newPath.pop();
			continue;
		}

		let entries;
		try {
			entries = await listEntriesAtPath(newPath);
		} catch {
			return { error: `Error: ${part} não existe` };
		}

		const candidate = entries.find((item) => item.name === part);
		if (!candidate) return { error: `Error: ${part} não existe` };
		if (candidate.type !== "dir") return { error: `Error: ${part} não é um diretório` };

		newPath.push(part);

		const projectCtx = resolveProjectFromPath(newPath);
		if (projectCtx && projectCtx.repoRelativePath.length === 0) {
			try {
				await listEntriesAtPath(newPath);
			} catch (error) {
				return { error: `Error: ${error?.message || "erro ao preparar projeto"}` };
			}
		}
	}

	const nextProjectCtx = resolveProjectFromPath(newPath);
	if (previousProjectCtx && (!nextProjectCtx || nextProjectCtx.projectId !== previousProjectCtx.projectId)) {
		scheduleProjectCleanup(previousProjectCtx.projectId);
	}

	if (nextProjectCtx) {
		cancelProjectCleanup(nextProjectCtx.projectId);
	}

	return { newPath };
}

export { COMMANDS, ls, cat, cd, pwd, help, clear, gui, aboutme, view, vim, make, run };
export { lsRuntime, catRuntime, cdRuntime, viewRuntime, vimRuntime, makeRuntime, runRuntime };
