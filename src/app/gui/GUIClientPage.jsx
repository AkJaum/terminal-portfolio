"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import filesystem from "../lib/file_system";
import { getFileIcon } from "../lib/file-icons";
import DesktopWindow from "../components/gui/DesktopWindow";
import EmbeddedAppWindow from "../components/gui/EmbeddedAppWindow";
import BrowserWindow from "../components/gui/BrowserWindow";
import FileSystemNavigator from "../components/gui/FileSystemNavigator";
import GameWindow from "../components/gui/GameWindow";
import FileContentViewer from "../components/FileContentViewer";
import { getProjectResetPlanForPath, getProjectTestPlanForPath } from "../lib/project-test-config";
import style from "./guipage.module.css";

const FULLSCREEN_PROMPT_DISMISSED_KEY = "gui-fullscreen-prompt-dismissed-v1";

const SOCIAL_LINKS = {
  github: "https://github.com/akjaum",
  linkedin: "https://www.linkedin.com/in/akjaum/",
};

export default function GUIClientPage() {
  const searchParams = useSearchParams();
  const contentRef = useRef(null);
  const [clock, setClock] = useState({ time: "--:--", date: "" });
  const [windows, setWindows] = useState([]);
  const [nextWindowId, setNextWindowId] = useState(1);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [desktopBounds, setDesktopBounds] = useState({ width: 0, height: 0 });
  const [theme, setTheme] = useState(searchParams.get("theme") === "light" ? "light" : "dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const zCounterRef = useRef(5);
  const startMenuRef = useRef(null);
  const userName = useMemo(() => {
    const rawUser = searchParams.get("user") || "guest";
    const cleanUser = rawUser.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
    return cleanUser || "guest";
  }, [searchParams]);
  const avatarIcon = useMemo(() => {
    const avatar = searchParams.get("avatar");
    return avatar ? avatar.trim() : "🙂";
  }, [searchParams]);
  const clockLocale = useMemo(() => {
    const language = searchParams.get("lang");
    return language === "en-US" ? "en-US" : "pt-BR";
  }, [searchParams]);
  const clockTimeFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(clockLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [clockLocale]);
  const clockDateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(clockLocale, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }, [clockLocale]);

  const desktopEntries = Object.entries(filesystem?.home || {}).map(([name, value]) => ({
    name,
    isDir: typeof value === "object" && value !== null,
  }));

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setClock({
        time: clockTimeFormatter.format(now),
        date: clockDateFormatter.format(now),
      });
    }

    updateClock();
    const timer = setInterval(() => {
      updateClock();
    }, 1000 * 15);

    return () => clearInterval(timer);
  }, [clockDateFormatter, clockTimeFormatter]);

  useEffect(() => {
    setIsFullscreen(Boolean(document.fullscreenElement));

    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    let timer;
    try {
      const dismissed = window.localStorage.getItem(FULLSCREEN_PROMPT_DISMISSED_KEY) === "1";
      if (!dismissed) {
        timer = window.setTimeout(() => {
          setShowFullscreenPrompt(true);
        }, 280);
      }
    } catch {
      timer = window.setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 280);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    function measureDesktop() {
      if (!contentRef.current) return;
      const width = contentRef.current.clientWidth;
      const height = contentRef.current.clientHeight;
      setDesktopBounds({ width, height });
    }

    measureDesktop();
    window.addEventListener("resize", measureDesktop);
    return () => window.removeEventListener("resize", measureDesktop);
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (event?.data?.type !== "dungeon4fun:close-request") return;
      setWindows((prev) => prev.map((item) => (
        item.appType === "game" ? { ...item, closing: true } : item
      )));
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!desktopBounds.width || !desktopBounds.height) return;

    setWindows((prev) => prev.map((item) => {
      if (item.maximized) return item;

      const nextWidth = Math.min(item.width, Math.max(320, desktopBounds.width - 20));
      const nextHeight = Math.min(item.height, Math.max(220, desktopBounds.height - 20));
      const maxX = Math.max(0, desktopBounds.width - nextWidth);
      const maxY = Math.max(0, desktopBounds.height - nextHeight);

      return {
        ...item,
        width: nextWidth,
        height: nextHeight,
        x: Math.min(maxX, Math.max(0, item.x)),
        y: Math.min(maxY, Math.max(0, item.y)),
      };
    }));
  }, [desktopBounds.height, desktopBounds.width]);

  useEffect(() => {
    if (!startMenuOpen) return undefined;

    function handleClickOutside(event) {
      if (!startMenuRef.current) return;
      if (!startMenuRef.current.contains(event.target)) {
        setStartMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handleClickOutside);
    return () => window.removeEventListener("pointerdown", handleClickOutside);
  }, [startMenuOpen]);

  function nextZIndex() {
    zCounterRef.current += 1;
    return zCounterRef.current;
  }

  function computePreferredWindowSize({ desktopWidth, desktopHeight, targetWidthRatio, targetHeightRatio, minWidth, minHeight, aspectRatio }) {
    const safeWidth = Math.max(minWidth, desktopWidth);
    const safeHeight = Math.max(minHeight, desktopHeight);
    let nextWidth = Math.min(safeWidth, Math.floor(safeWidth * targetWidthRatio));
    let nextHeight = Math.round(nextWidth / aspectRatio);

    if (nextHeight > Math.floor(safeHeight * targetHeightRatio)) {
      nextHeight = Math.min(safeHeight, Math.floor(safeHeight * targetHeightRatio));
      nextWidth = Math.round(nextHeight * aspectRatio);
    }

    return {
      width: Math.max(minWidth, Math.min(nextWidth, safeWidth)),
      height: Math.max(minHeight, Math.min(nextHeight, safeHeight)),
    };
  }

  function focusWindow(id) {
    setWindows((prev) => prev.map((item) => (
      item.id === id ? { ...item, zIndex: nextZIndex() } : item
    )));
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((item) => item.id !== id));
  }

  function requestCloseWindow(id) {
    setWindows((prev) => prev.map((item) => (
      item.id === id ? { ...item, closing: true } : item
    )));
  }

  function minimizeWindow(id) {
    setWindows((prev) => prev.map((item) => (
      item.id === id ? { ...item, minimized: true } : item
    )));
  }

  function toggleMaximizeWindow(id) {
    setWindows((prev) => prev.map((item) => (
      item.id === id
        ? { ...item, maximized: !item.maximized, zIndex: nextZIndex() }
        : item
    )));
  }

  function moveWindow(id, x, y) {
    setWindows((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const maxX = Math.max(0, desktopBounds.width - item.width);
      const maxY = Math.max(0, desktopBounds.height - item.height);

      return {
        ...item,
        x: Math.min(maxX, Math.max(0, x)),
        y: Math.min(maxY, Math.max(0, y)),
      };
    }));
  }

  function resizeWindow(id, width, height) {
    setWindows((prev) => prev.map((item) => {
      if (item.id !== id || item.maximized) return item;

      const maxWidth = Math.max(320, desktopBounds.width - item.x - 10);
      const maxHeight = Math.max(220, desktopBounds.height - item.y - 10);

      return {
        ...item,
        width: Math.min(maxWidth, Math.max(320, width)),
        height: Math.min(maxHeight, Math.max(220, height)),
      };
    }));
  }

  function activateWindow(id) {
    setWindows((prev) => prev.map((item) => (
      item.id === id
        ? { ...item, minimized: false, zIndex: nextZIndex() }
        : item
    )));
    setHoveredGroup(null);
  }

  function createFilesWindow({ initialPath, initialFile, currentLabel }) {
    const id = nextWindowId;
    setNextWindowId((value) => value + 1);

    const safeDesktopWidth = desktopBounds.width || 1200;
    const safeDesktopHeight = desktopBounds.height || 800;
    const preferredSize = computePreferredWindowSize({
      desktopWidth: safeDesktopWidth - 20,
      desktopHeight: safeDesktopHeight - 20,
      targetWidthRatio: 0.7,
      targetHeightRatio: 0.72,
      minWidth: 420,
      minHeight: 320,
      aspectRatio: 16 / 9,
    });
    const responsiveWidth = preferredSize.width;
    const responsiveHeight = preferredSize.height;

    setWindows((prev) => {
      const maxX = Math.max(0, safeDesktopWidth - responsiveWidth);
      const maxY = Math.max(0, safeDesktopHeight - responsiveHeight);
      const nextX = Math.min(maxX, 80 + (prev.length % 5) * 24);
      const nextY = Math.min(maxY, 60 + (prev.length % 4) * 24);

      return [
        ...prev,
        {
          id,
          appType: "files",
          appLabel: "Files",
          appIcon: "🗂️",
          currentLabel,
          title: `Files - ${currentLabel}`,
          x: nextX,
          y: nextY,
          width: responsiveWidth,
          height: responsiveHeight,
          zIndex: nextZIndex(),
          minimized: false,
          maximized: false,
          closing: false,
          initialPath,
          initialFile,
        },
      ];
    });
  }

  function createProgramWindow({ appType, appLabel, appIcon, title, payload, width, height }) {
    const id = nextWindowId;
    setNextWindowId((value) => value + 1);

    const safeDesktopWidth = desktopBounds.width || 1200;
    const safeDesktopHeight = desktopBounds.height || 800;
    const preferredSize = width && height
      ? { width, height }
      : computePreferredWindowSize({
          desktopWidth: safeDesktopWidth - 20,
          desktopHeight: safeDesktopHeight - 20,
          targetWidthRatio: 0.76,
          targetHeightRatio: 0.78,
          minWidth: 520,
          minHeight: 340,
          aspectRatio: 16 / 9,
        });
    const responsiveWidth = preferredSize.width;
    const responsiveHeight = preferredSize.height;

    setWindows((prev) => {
      const maxX = Math.max(0, safeDesktopWidth - responsiveWidth);
      const maxY = Math.max(0, safeDesktopHeight - responsiveHeight);
      const nextX = Math.min(maxX, 110 + (prev.length % 4) * 22);
      const nextY = Math.min(maxY, 70 + (prev.length % 3) * 22);

      return [
        ...prev,
        {
          id,
          appType,
          appLabel,
          appIcon,
          currentLabel: title,
          title,
          x: nextX,
          y: nextY,
          width: responsiveWidth,
          height: responsiveHeight,
          zIndex: nextZIndex(),
          minimized: false,
          maximized: false,
          closing: false,
          payload,
        },
      ];
    });
  }

  function openGameWindow() {
    const safeDesktopWidth = desktopBounds.width || 1200;
    const safeDesktopHeight = desktopBounds.height || 800;
    const preferredSize = computePreferredWindowSize({
      desktopWidth: safeDesktopWidth - 20,
      desktopHeight: safeDesktopHeight - 20,
      targetWidthRatio: 0.9,
      targetHeightRatio: 0.86,
      minWidth: 560,
      minHeight: 315,
      aspectRatio: 16 / 9,
    });

    createProgramWindow({
      appType: "game",
      appLabel: "Dungeon4Fun",
      appIcon: "🎮",
      title: "Dungeon4Fun",
      payload: {
        kind: "app",
        file: "dungeon4fun",
        url: "/gui_game/index.html",
      },
      width: preferredSize.width,
      height: preferredSize.height,
    });
  }

  function openTerminalWindow(initialPath = ["home"], options = {}) {
    const safePath = Array.isArray(initialPath) && initialPath.length > 0 ? initialPath : ["home"];
    const pathLabel = safePath.join("/");
    const safeRunCommands = Array.isArray(options?.runCommands)
      ? options.runCommands.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const terminalParams = new URLSearchParams({
      path: pathLabel,
      embed: "1",
      welcome: "0",
      user: userName,
    });

    if (safeRunCommands.length > 0) {
      terminalParams.set("autorun", JSON.stringify(safeRunCommands));
    }

    createProgramWindow({
      appType: "terminal",
      appLabel: "Terminal",
      appIcon: "🖥️",
      title: `Terminal - ${pathLabel}`,
      payload: {
        kind: "terminal",
        url: `/terminal?${terminalParams.toString()}`,
        initialPath: safePath,
      },
    });
  }

  function testProjectAtPath(path) {
    const projectPlan = getProjectTestPlanForPath(path);
    if (!projectPlan) return;

    openTerminalWindow(path, {
      runCommands: projectPlan.commands,
    });
  }

  async function runCommandsAtPath(path, commands = []) {
    const safePath = Array.isArray(path) && path.length > 0 ? path : ["home"];
    const queue = Array.isArray(commands)
      ? commands.map((command) => String(command || "").trim()).filter(Boolean)
      : [];

    for (const command of queue) {
      const response = await fetch("/api/shell/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: command,
          currentPath: safePath,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || `erro ao executar comando: ${command}`);
      }
    }
  }

  async function resetProjectAtPath(path) {
    const projectPlan = getProjectResetPlanForPath(path);
    if (!projectPlan) return false;

    try {
      await runCommandsAtPath(path, projectPlan.resetCommands);
      return true;
    } catch {
      // intentionally silent here; reset action should not open terminal automatically
      return false;
    }
  }

  async function openDesktopFile(entry) {
    try {
      const response = await fetch("/api/fs/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPath: ["home"], file: entry.name }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "erro ao ler arquivo");
      }

      openProgramFromExplorer({
        payload,
        fileName: entry.name,
        currentPath: ["home"],
      });
    } catch {
      createFilesWindow({
        initialPath: ["home"],
        initialFile: entry.name,
        currentLabel: "home",
      });
    }
  }

  function openProgramFromExplorer({ payload, fileName, currentPath }) {
    if (payload.kind === "launcher") {
      const target = String(payload.target || "").toLowerCase();
      if (target === "terminal") {
        openTerminalWindow(currentPath);
        return;
      }

      if (target === "dungeon4fun") {
        openGameWindow();
        return;
      }
    }

    if (fileName === "dungeon4fun") {
      openGameWindow();
      return;
    }

    const pathLabel = [...currentPath, fileName].join("/");
    const filePayload = {
      ...payload,
      file: fileName,
    };

    if (payload.kind === "code") {
      createProgramWindow({
        appType: "terminal",
        appLabel: "Terminal",
        appIcon: "🖥️",
        title: `Terminal - vim ${pathLabel}`,
        payload: { ...filePayload, kind: "code" },
      });
      return;
    }

    if (payload.kind === "markdown" || payload.kind === "pdf") {
      createProgramWindow({
        appType: "viewer",
        appLabel: "Viewer",
        appIcon: "👁️",
        title: `Viewer - ${pathLabel}`,
        payload: filePayload,
      });
      return;
    }

    if (payload.kind === "text") {
      createProgramWindow({
        appType: "notepad",
        appLabel: "Notepad",
        appIcon: "🗒️",
        title: `Notepad - ${pathLabel}`,
        payload: filePayload,
      });
      return;
    }

    if (payload.kind === "web") {
      createProgramWindow({
        appType: "browser",
        appLabel: "Browser",
        appIcon: "🌐",
        title: `Browser - ${pathLabel}`,
        payload: {
          ...filePayload,
          url: payload.url || payload.content,
        },
      });
      return;
    }

    createProgramWindow({
      appType: "viewer",
      appLabel: "Viewer",
      appIcon: "👁️",
      title: `Viewer - ${pathLabel}`,
      payload: {
        ...filePayload,
        kind: "unsupported",
        message: "tipo de arquivo não suportado para visualização",
      },
    });
  }

  function openDesktopEntry(entry) {
    const entryNameLower = String(entry.name || "").toLowerCase();

    if (entryNameLower === "terminal") {
      openTerminalWindow(["home"]);
      return;
    }

    if (entryNameLower === "dungeon4fun") {
      openGameWindow();
      return;
    }

    if (!entry.isDir) {
      openDesktopFile(entry);
      return;
    }

    createFilesWindow({
      initialPath: entry.isDir ? ["home", entry.name] : ["home"],
      initialFile: entry.isDir ? null : entry.name,
      currentLabel: `home/${entry.name}`,
    });
  }

  function openPinnedFilesRoot() {
    createFilesWindow({
      initialPath: ["home"],
      initialFile: null,
      currentLabel: "home",
    });
  }

  const updateWindowPath = useCallback((id, pathLabel) => {
    setWindows((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const nextTitle = `Files - ${pathLabel}`;
      if (item.currentLabel === pathLabel && item.title === nextTitle) {
        return item;
      }
      return {
        ...item,
        currentLabel: pathLabel,
        title: nextTitle,
      };
    }));
  }, []);

  const visibleWindows = windows.filter((item) => !item.minimized);
  const groupedWindows = useMemo(() => {
    const groups = new Map();
    windows.forEach((windowItem) => {
      const key = windowItem.appType || windowItem.title;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(windowItem);
    });
    return Array.from(groups.entries());
  }, [windows]);
  const filesWindows = groupedWindows.find(([groupKey]) => groupKey === "files")?.[1] || [];
  const otherGroups = groupedWindows.filter(([groupKey]) => groupKey !== "files");
  const taskbarGroups = useMemo(() => {
    return groupedWindows.map(([groupKey, groupItems]) => {
      const visibleCount = groupItems.filter((item) => !item.minimized).length;
      const closingCount = groupItems.filter((item) => item.closing).length;
      const isClosing = groupItems.length > 0 && closingCount === groupItems.length;

      return {
        groupKey,
        groupItems,
        visibleCount,
        isClosing,
      };
    });
  }, [groupedWindows]);
  const taskbarFilesGroup = taskbarGroups.find((group) => group.groupKey === "files");
  const taskbarOtherGroups = taskbarGroups.filter((group) => group.groupKey !== "files");

  function toggleStartMenu() {
    setStartMenuOpen((prev) => !prev);
  }

  function handleThemeChange(nextTheme) {
    setTheme(nextTheme === "light" ? "light" : "dark");
  }

  function persistFullscreenPromptDismissed() {
    try {
      window.localStorage.setItem(FULLSCREEN_PROMPT_DISMISSED_KEY, "1");
    } catch {
      // ignore storage failures
    }
  }

  async function enterFullscreen() {
    if (document.fullscreenElement) return;

    const target = document.documentElement;
    if (target?.requestFullscreen) {
      await target.requestFullscreen();
    }
  }

  async function toggleFullscreenMode() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await enterFullscreen();
      }
    } catch {
      // noop, browser may block without direct user gesture
    }
  }

  async function acceptFullscreenPrompt() {
    persistFullscreenPromptDismissed();
    setShowFullscreenPrompt(false);
    try {
      await enterFullscreen();
    } catch {
      // noop
    }
  }

  function declineFullscreenPrompt() {
    persistFullscreenPromptDismissed();
    setShowFullscreenPrompt(false);
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    setStartMenuOpen(false);
  }

  return (
    <div className={style.container} data-theme={theme}>
        <div className={style.content} ref={contentRef}>
          <div className={style.desktopGrid}>
            {desktopEntries.map((entry) => (
              <button
                key={entry.name}
                type="button"
                className={style.desktopItem}
                onClick={() => openDesktopEntry(entry)}
              >
                <span className={style.desktopIcon}>
                  {getFileIcon(entry.name, entry.isDir)}
                </span>
                <span className={style.desktopLabel}>{entry.name}</span>
              </button>
            ))}
          </div>

          {visibleWindows.map((windowItem) => (
            <DesktopWindow
              key={windowItem.id}
              id={windowItem.id}
              title={windowItem.title}
              x={windowItem.x}
              y={windowItem.y}
              width={windowItem.width}
              height={windowItem.height}
              zIndex={windowItem.zIndex}
              isMaximized={windowItem.maximized}
              isClosing={windowItem.closing}
              desktopBounds={desktopBounds}
              onFocus={focusWindow}
              onClose={closeWindow}
              onRequestClose={requestCloseWindow}
              onToggleMaximize={toggleMaximizeWindow}
              onMinimize={minimizeWindow}
              onMove={moveWindow}
              onResize={resizeWindow}
            >
              {windowItem.appType === "files" ? (
                <FileSystemNavigator
                  windowId={windowItem.id}
                  initialPath={windowItem.initialPath}
                  initialFile={windowItem.initialFile}
                  onPathChange={updateWindowPath}
                  onOpenFileProgram={openProgramFromExplorer}
                  onOpenTerminalAtPath={openTerminalWindow}
                  onTestProjectAtPath={testProjectAtPath}
                  onResetProjectAtPath={resetProjectAtPath}
                />
              ) : windowItem.appType === "terminal" ? (
                <EmbeddedAppWindow title={windowItem.title} url={windowItem.payload?.url} />
              ) : windowItem.appType === "browser" ? (
                <BrowserWindow title={windowItem.title} initialUrl={windowItem.payload?.url} />
              ) : windowItem.appType === "game" ? (
                <GameWindow url={windowItem.payload?.url} />
              ) : (
                <FileContentViewer
                  fileData={windowItem.payload}
                  emptyMessage="Nada para visualizar."
                />
              )}
            </DesktopWindow>
          ))}
        </div>
        <div className={style.taskbar}>
          <div className={style.startArea} ref={startMenuRef}>
            <button type="button" onClick={toggleStartMenu} className={style.startButton}>⚙️</button>
            {startMenuOpen && (
              <div className={style.startMenu}>
                <div className={style.startProfile}>
                  <div className={style.startAvatar}>{avatarIcon}</div>
                  <div className={style.startUser}>{userName}</div>
                </div>

                <div className={style.startSection}>
                  <div className={style.startSectionTitle}>Tema</div>
                  <div className={style.themeActions}>
                    <button
                      type="button"
                      className={`${style.themeButton} ${theme === "light" ? style.themeButtonActive : ""}`}
                      onClick={() => handleThemeChange("light")}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className={`${style.themeButton} ${theme === "dark" ? style.themeButtonActive : ""}`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className={style.startSection}>
                  <div className={style.startSectionTitle}>Configurações</div>
                  <button
                    type="button"
                    className={style.startMenuItem}
                    onClick={async () => {
                      await toggleFullscreenMode();
                      setStartMenuOpen(false);
                    }}
                  >
                    {isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
                  </button>
                </div>

                <div className={style.startSection}>
                  <button
                    type="button"
                    className={style.startMenuItem}
                    onClick={() => {
                      openTerminalWindow(["home"]);
                      setStartMenuOpen(false);
                    }}
                  >
                    Abrir terminal
                  </button>
                  <button
                    type="button"
                    className={style.startMenuItem}
                    onClick={() => openExternal(SOCIAL_LINKS.linkedin)}
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    className={style.startMenuItem}
                    onClick={() => openExternal(SOCIAL_LINKS.github)}
                  >
                    GitHub
                  </button>
                </div>
              </div>
            )}
          </div>
            <div className={style.applications}>
              <div
                className={style.taskGroup}
                onMouseEnter={() => setHoveredGroup("files")}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <button
                  type="button"
                  className={[
                    style.taskButton,
                    taskbarFilesGroup?.groupItems.length > 0 ? style.taskButtonActive : "",
                    taskbarFilesGroup?.groupItems.length > 0 ? style.taskButtonAppearing : "",
                    taskbarFilesGroup?.isClosing ? style.taskButtonClosing : "",
                  ].join(" ").trim()}
                  onClick={openPinnedFilesRoot}
                  title="Files"
                >
                  <span className={style.taskButtonIcon}>🗂️</span>
                  {taskbarFilesGroup?.visibleCount > 1 ? <span className={style.taskBadge}>{taskbarFilesGroup.visibleCount}</span> : null}
                </button>

                {hoveredGroup === "files" && taskbarFilesGroup?.groupItems.length > 0 && (
                  <div className={style.taskMenu}>
                    {taskbarFilesGroup.groupItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={style.taskMenuItem}
                        onClick={() => activateWindow(item.id)}
                      >
                        {item.title} {item.minimized ? "(minimizada)" : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {taskbarOtherGroups.map(({ groupKey, groupItems, visibleCount, isClosing }) => (
                <div
                  key={groupKey}
                  className={style.taskGroup}
                  onMouseEnter={() => setHoveredGroup(groupKey)}
                  onMouseLeave={() => setHoveredGroup(null)}
                >
                  <button
                    type="button"
                    className={[
                      style.taskButton,
                      visibleCount > 0 ? style.taskButtonAppearing : "",
                      isClosing ? style.taskButtonClosing : "",
                    ].join(" ").trim()}
                    onClick={() => activateWindow(groupItems[groupItems.length - 1].id)}
                    title={groupItems[0]?.appLabel || "App"}
                  >
                    <span className={style.taskButtonIcon}>{groupItems[0]?.appIcon || "🗂️"}</span>
                    {visibleCount > 1 ? <span className={style.taskBadge}>{visibleCount}</span> : null}
                  </button>

                  {hoveredGroup === groupKey && groupItems.length > 0 && (
                    <div className={style.taskMenu}>
                      {groupItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={style.taskMenuItem}
                          onClick={() => activateWindow(item.id)}
                        >
                          {item.title} {item.minimized ? "(minimizada)" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={style.statusArea}>
              <div className={style.statusIcons}>
                <span className={style.statusIcon} title="Wi-Fi conectado">📶</span>
                <span className={style.statusIcon} title="Bateria">🔋</span>
              </div>
              <div className={style.clock}>
                <span className={style.clockTime}>{clock.time}</span>
                <span className={style.clockDate}>{clock.date}</span>
              </div>
            </div>
        </div>

        {showFullscreenPrompt && (
          <div className={style.fullscreenPromptOverlay} role="dialog" aria-modal="true" aria-labelledby="fullscreenPromptTitle">
            <div className={style.fullscreenPromptCard}>
              <h2 id="fullscreenPromptTitle" className={style.fullscreenPromptTitle}>Ativar tela cheia?</h2>
              <p className={style.fullscreenPromptText}>
                Para uma experiência melhor na GUI, deseja abrir em modo tela cheia? Pode ser ativado ou desativado nas configurações.
              </p>
              <div className={style.fullscreenPromptActions}>
                <button type="button" className={`${style.promptButton} ${style.promptButtonPrimary}`} onClick={acceptFullscreenPrompt}>
                  Sim
                </button>
                <button type="button" className={`${style.promptButton} ${style.promptButtonGhost}`} onClick={declineFullscreenPrompt}>
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
