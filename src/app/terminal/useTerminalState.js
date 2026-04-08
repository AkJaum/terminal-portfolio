import { useReducer } from "react";

const WELCOME_MESSAGE =
  "Seja bem vindo ao meu portfolio em forma de terminal, para começar, você pode usar o comando aboutme para uma breve introdução profisisonal. Se precisar de ajuda com os comandos, o comando help está a sua disposição. Caso você não saiba usar um terminal, você pode usar o comando gui, ele vai te levar para uma interface gráfica.";

const initialState = {
  input: "",
  lines: [WELCOME_MESSAGE],
  history: [],
  historyIndex: -1,
  currentPath: ["home"],
  navigateToGui: false,
  viewerOpen: false,
  viewerContent: null,
  isCloneLoading: false,
};

function normalizeInitialPath(initialPath) {
  if (Array.isArray(initialPath) && initialPath.length > 0) {
    return initialPath.filter(Boolean);
  }

  if (typeof initialPath === "string" && initialPath.trim()) {
    return initialPath.split("/").map((segment) => segment.trim()).filter(Boolean);
  }

  return ["home"];
}

function createInitialState(initialPath) {
  return {
    ...initialState,
    currentPath: normalizeInitialPath(initialPath),
  };
}

function createInitialStateWithWelcome(initialPath, showWelcome) {
  const state = createInitialState(initialPath);
  if (showWelcome === false) {
    return {
      ...state,
      lines: [],
    };
  }

  return state;
}

function terminalReducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };

    case "APPEND_COMMAND":
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            type: "command",
            prompt: action.payload.prompt,
            command: action.payload.command,
          },
        ],
      };

    case "APPEND_LINES":
      return {
        ...state,
        lines: [...state.lines, ...action.payload],
      };

    case "CLEAR_LINES":
      return {
        ...state,
        lines: [],
      };

    case "SET_CURRENT_PATH":
      return {
        ...state,
        currentPath: action.payload,
      };

    case "OPEN_VIEWER":
      return {
        ...state,
        viewerOpen: true,
        viewerContent: action.payload,
      };

    case "CLOSE_VIEWER":
      return {
        ...state,
        viewerOpen: false,
        viewerContent: null,
      };

    case "SET_NAVIGATE_TO_GUI":
      return {
        ...state,
        navigateToGui: action.payload,
      };

    case "SET_CLONE_LOADING":
      return {
        ...state,
        isCloneLoading: action.payload,
      };

    case "PUSH_HISTORY":
      return {
        ...state,
        history: [...state.history, action.payload],
        historyIndex: state.history.length + 1,
      };

    case "SET_HISTORY_INDEX":
      return {
        ...state,
        historyIndex: action.payload,
      };

    default:
      return state;
  }
}

export default function useTerminalState({ initialPath, showWelcome = true } = {}) {
  const [state, dispatch] = useReducer(
    terminalReducer,
    initialState,
    () => createInitialStateWithWelcome(initialPath, showWelcome)
  );

  const actions = {
    setInput: (value) => dispatch({ type: "SET_INPUT", payload: value }),
    appendCommand: (prompt, command) =>
      dispatch({ type: "APPEND_COMMAND", payload: { prompt, command } }),
    appendLines: (lines) => dispatch({ type: "APPEND_LINES", payload: lines }),
    clearLines: () => dispatch({ type: "CLEAR_LINES" }),
    setCurrentPath: (path) => dispatch({ type: "SET_CURRENT_PATH", payload: path }),
    openViewer: (content) => dispatch({ type: "OPEN_VIEWER", payload: content }),
    closeViewer: () => dispatch({ type: "CLOSE_VIEWER" }),
    setNavigateToGui: (value) => dispatch({ type: "SET_NAVIGATE_TO_GUI", payload: value }),
    setCloneLoading: (value) => dispatch({ type: "SET_CLONE_LOADING", payload: value }),
    pushHistory: (command) => dispatch({ type: "PUSH_HISTORY", payload: command }),
    setHistoryIndex: (index) => dispatch({ type: "SET_HISTORY_INDEX", payload: index }),
  };

  return { state, actions };
}
