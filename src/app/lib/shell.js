import COMMANDS from "./commands";

async function runShellCommand(cmd, currentPath) {
	const response = await fetch("/api/shell/execute", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			input: cmd,
			currentPath,
		}),
	});

	const payload = await response.json().catch(() => ({ error: "resposta inválida do servidor" }));
	if (!response.ok) {
		return { error: payload?.error || "erro ao executar comando" };
	}

	return payload;
}

function autocompleteCommand(input, commands = COMMANDS) {
	return commands.filter((cmd) => cmd.startsWith(input));
}

async function autocompletePath(input, currentPath) {
	const response = await fetch("/api/fs/list", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ currentPath }),
	});

	const payload = await response.json().catch(() => ({}));
	if (!response.ok) return [];

	const items = Array.isArray(payload?.items) ? payload.items : [];
	return items.filter((name) => name.startsWith(input));
}

export { autocompleteCommand, autocompletePath };
export default runShellCommand;
