const PROJECT_PATH_PREFIX = ["home", "projects", "curriculum_42"];

export const PROJECT_TEST_PLANS = {
  push_swap: {
    label: "push_swap",
    commands: ["make", "clear", "make m"],
    resetCommands: ["reclone"],
  },
  get_next_line: {
    label: "get_next_line",
    commands: ["make", "clear", "make m"],
    resetCommands: ["reclone"],
  },
  printf: {
    label: "printf",
    commands: ["make", "clear", "make m"],
    resetCommands: ["reclone"],
  },
  libft: {
    label: "libft",
    commands: ["make", "clear", "make m"],
    resetCommands: ["reclone"],
  },
};

export function resolveProjectFromPath(path = []) {
  if (!Array.isArray(path)) return null;
  if (path.length < PROJECT_PATH_PREFIX.length + 1) return null;

  for (let i = 0; i < PROJECT_PATH_PREFIX.length; i += 1) {
    if (path[i] !== PROJECT_PATH_PREFIX[i]) return null;
  }

  const projectId = path[PROJECT_PATH_PREFIX.length];
  const plan = PROJECT_TEST_PLANS[projectId];
  if (!plan) return null;

  return {
    projectId,
    projectLabel: plan.label || projectId,
    commands: Array.isArray(plan.commands) ? plan.commands : [],
    resetCommands: Array.isArray(plan.resetCommands) ? plan.resetCommands : [],
  };
}

export function getProjectTestPlanForPath(path = []) {
  const projectInfo = resolveProjectFromPath(path);
  if (!projectInfo) return null;
  if (!Array.isArray(projectInfo.commands) || projectInfo.commands.length === 0) return null;
  return projectInfo;
}

export function getProjectResetPlanForPath(path = []) {
  const projectInfo = resolveProjectFromPath(path);
  if (!projectInfo) return null;
  if (!Array.isArray(projectInfo.resetCommands) || projectInfo.resetCommands.length === 0) return null;
  return projectInfo;
}
