export const PROJECT_PATH_PREFIX = ["home", "projects", "curriculum_42"];

export const PROJECT_CATALOG = {
  push_swap: {
    id: "push_swap",
    path: [...PROJECT_PATH_PREFIX, "push_swap"],
  },
  get_next_line: {
    id: "get_next_line",
    path: [...PROJECT_PATH_PREFIX, "get_next_line"],
  },
  printf: {
    id: "printf",
    path: [...PROJECT_PATH_PREFIX, "printf"],
  },
  libft: {
    id: "libft",
    path: [...PROJECT_PATH_PREFIX, "libft"],
  },
};

export function resolveProjectFromPath(path = []) {
  if (!Array.isArray(path)) return null;
  if (path.length < PROJECT_PATH_PREFIX.length + 1) return null;

  for (let i = 0; i < PROJECT_PATH_PREFIX.length; i += 1) {
    if (path[i] !== PROJECT_PATH_PREFIX[i]) return null;
  }

  const projectId = path[PROJECT_PATH_PREFIX.length];
  const project = PROJECT_CATALOG[projectId];
  if (!project) return null;

  return {
    projectId,
    repoRelativePath: path.slice(PROJECT_PATH_PREFIX.length + 1),
    projectRootPath: project.path,
  };
}
