const __dirname = '/gui_game'; const process = { exit: () => {} };
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// scripts/bridge/raylib-web-runtime.js
var raylib_web_runtime_exports = {};
__export(raylib_web_runtime_exports, {
  BLACK: () => BLACK,
  BeginDrawing: () => BeginDrawing,
  BeginMode2D: () => BeginMode2D,
  BeginScissorMode: () => BeginScissorMode,
  CheckCollisionPointRec: () => CheckCollisionPointRec,
  ClearBackground: () => ClearBackground,
  ClearWindowState: () => ClearWindowState,
  CloseWindow: () => CloseWindow,
  DARKGRAY: () => DARKGRAY,
  DARKGREEN: () => DARKGREEN,
  DrawCircle: () => DrawCircle,
  DrawCircleLines: () => DrawCircleLines,
  DrawLine: () => DrawLine,
  DrawLineEx: () => DrawLineEx,
  DrawRectangle: () => DrawRectangle,
  DrawRectangleLines: () => DrawRectangleLines,
  DrawRectangleLinesEx: () => DrawRectangleLinesEx,
  DrawRectanglePro: () => DrawRectanglePro,
  DrawRectangleRec: () => DrawRectangleRec,
  DrawRectangleV: () => DrawRectangleV,
  DrawText: () => DrawText,
  DrawTriangle: () => DrawTriangle,
  EndDrawing: () => EndDrawing,
  EndMode2D: () => EndMode2D,
  EndScissorMode: () => EndScissorMode,
  FLAG_WINDOW_TOPMOST: () => FLAG_WINDOW_TOPMOST,
  FLAG_WINDOW_UNDECORATED: () => FLAG_WINDOW_UNDECORATED,
  GOLD: () => GOLD,
  GRAY: () => GRAY,
  GREEN: () => GREEN,
  GetCurrentMonitor: () => GetCurrentMonitor,
  GetFPS: () => GetFPS,
  GetMonitorHeight: () => GetMonitorHeight,
  GetMonitorWidth: () => GetMonitorWidth,
  GetMousePosition: () => GetMousePosition,
  GetMouseWheelMove: () => GetMouseWheelMove,
  GetScreenHeight: () => GetScreenHeight,
  GetScreenWidth: () => GetScreenWidth,
  InitWindow: () => InitWindow,
  IsKeyDown: () => IsKeyDown,
  IsKeyPressed: () => IsKeyPressed,
  IsKeyReleased: () => IsKeyReleased,
  IsMouseButtonPressed: () => IsMouseButtonPressed,
  IsMouseButtonReleased: () => IsMouseButtonReleased,
  KEY_A: () => KEY_A,
  KEY_D: () => KEY_D,
  KEY_ENTER: () => KEY_ENTER,
  KEY_ESCAPE: () => KEY_ESCAPE,
  KEY_F11: () => KEY_F11,
  KEY_N: () => KEY_N,
  KEY_S: () => KEY_S,
  KEY_SPACE: () => KEY_SPACE,
  KEY_W: () => KEY_W,
  LIGHTGRAY: () => LIGHTGRAY,
  MAROON: () => MAROON,
  MOUSE_BUTTON_LEFT: () => MOUSE_BUTTON_LEFT,
  MeasureText: () => MeasureText,
  RED: () => RED,
  SetExitKey: () => SetExitKey,
  SetTargetFPS: () => SetTargetFPS,
  SetWindowPosition: () => SetWindowPosition,
  SetWindowSize: () => SetWindowSize,
  SetWindowState: () => SetWindowState,
  WHITE: () => WHITE,
  WindowShouldClose: () => WindowShouldClose,
  YELLOW: () => YELLOW,
  __beginFrame: () => __beginFrame,
  __endFrame: () => __endFrame,
  __getTargetFPS: () => __getTargetFPS
});
function colorToCss(c) {
  if (!c) return "rgba(255,255,255,1)";
  if (typeof c === "string") return c;
  const r = c.r ?? 255;
  const g = c.g ?? 255;
  const b = c.b ?? 255;
  const a = (c.a ?? 255) / 255;
  return `rgba(${r},${g},${b},${a})`;
}
function attachInputListeners() {
  window.addEventListener("keydown", (ev) => {
    if (!state.keyDown.has(ev.code)) {
      state.keyPressed.add(ev.code);
    }
    state.keyDown.add(ev.code);
  });
  window.addEventListener("keyup", (ev) => {
    state.keyDown.delete(ev.code);
    state.keyReleased.add(ev.code);
    if (state.exitKey && ev.code === state.exitKey) {
      state.closeRequested = true;
    }
  });
  window.addEventListener("mousemove", (ev) => {
    if (!state.canvas) return;
    const rect = state.canvas.getBoundingClientRect();
    const sx = state.canvas.width / Math.max(1, rect.width);
    const sy = state.canvas.height / Math.max(1, rect.height);
    state.mousePos.x = (ev.clientX - rect.left) * sx;
    state.mousePos.y = (ev.clientY - rect.top) * sy;
  });
  window.addEventListener("mousedown", (ev) => {
    state.mousePressed.add(ev.button);
    state.mouseDown.add(ev.button);
  });
  window.addEventListener("mouseup", (ev) => {
    state.mouseDown.delete(ev.button);
    state.mouseReleased.add(ev.button);
  });
  window.addEventListener("wheel", (ev) => {
    state.mouseWheelMove = ev.deltaY < 0 ? 1 : ev.deltaY > 0 ? -1 : 0;
  });
}
function __beginFrame() {
  const now = performance.now();
  const dt = Math.max(1, now - state.lastFrameStart);
  state.currentFps = Math.round(1e3 / dt);
  state.lastFrameStart = now;
  state.frame += 1;
}
function __endFrame() {
  state.keyPressed.clear();
  state.keyReleased.clear();
  state.mousePressed.clear();
  state.mouseReleased.clear();
  state.mouseWheelMove = 0;
}
function InitWindow(width, height) {
  state.width = STRICT_WIDTH;
  state.height = STRICT_HEIGHT;
  let root = document.getElementById("app");
  if (!root) root = document.body;
  const canvas = document.createElement("canvas");
  canvas.width = STRICT_WIDTH;
  canvas.height = STRICT_HEIGHT;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.imageRendering = "pixelated";
  root.innerHTML = "";
  root.appendChild(canvas);
  state.canvas = canvas;
  state.ctx = canvas.getContext("2d");
  state.ctx.imageSmoothingEnabled = false;
  attachInputListeners();
}
function SetTargetFPS(fps) {
  state.targetFps = fps;
}
function __getTargetFPS() {
  return Math.max(1, state.targetFps || 60);
}
function SetExitKey(key) {
  if (typeof key === "number" && key === 0) {
    state.exitKey = null;
    return;
  }
  state.exitKey = key;
}
function WindowShouldClose() {
  return state.closeRequested;
}
function CloseWindow() {
  state.closeRequested = true;
}
function BeginDrawing() {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function EndDrawing() {
  const ctx = state.ctx;
  if (!ctx) return;
  while (state.mode2dStack > 0) {
    state.mode2dStack -= 1;
    ctx.restore();
  }
  ctx.restore();
}
function ClearBackground(color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.fillStyle = colorToCss(color);
  ctx.fillRect(0, 0, state.width, state.height);
}
function BeginMode2D(camera) {
  const ctx = state.ctx;
  if (!ctx || !camera) return;
  state.mode2dStack += 1;
  ctx.save();
  const zoom = camera.zoom ?? 1;
  const rotation = (camera.rotation ?? 0) * Math.PI / 180;
  const ox = camera.offset?.x ?? 0;
  const oy = camera.offset?.y ?? 0;
  const tx = camera.target?.x ?? 0;
  const ty = camera.target?.y ?? 0;
  ctx.translate(ox, oy);
  ctx.rotate(rotation);
  ctx.scale(zoom, zoom);
  ctx.translate(-tx, -ty);
}
function EndMode2D() {
  const ctx = state.ctx;
  if (!ctx || state.mode2dStack <= 0) return;
  state.mode2dStack -= 1;
  ctx.restore();
}
function BeginScissorMode(x, y, width, height) {
  const ctx = state.ctx;
  if (!ctx) return;
  state.scissorStack += 1;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
}
function EndScissorMode() {
  const ctx = state.ctx;
  if (!ctx || state.scissorStack <= 0) return;
  state.scissorStack -= 1;
  ctx.restore();
}
function GetScreenWidth() {
  return STRICT_WIDTH;
}
function GetScreenHeight() {
  return STRICT_HEIGHT;
}
function SetWindowSize(w, h) {
  state.width = STRICT_WIDTH;
  state.height = STRICT_HEIGHT;
  if (!state.canvas) return;
  state.canvas.width = STRICT_WIDTH;
  state.canvas.height = STRICT_HEIGHT;
}
function SetWindowPosition() {
}
function SetWindowState() {
}
function ClearWindowState() {
}
function GetCurrentMonitor() {
  return 0;
}
function GetMonitorWidth() {
  return window.innerWidth;
}
function GetMonitorHeight() {
  return window.innerHeight;
}
function GetFPS() {
  return state.currentFps;
}
function IsKeyDown(key) {
  const code = KEY_MAP[key] || key;
  return state.keyDown.has(code);
}
function IsKeyPressed(key) {
  const code = KEY_MAP[key] || key;
  return state.keyPressed.has(code);
}
function IsKeyReleased(key) {
  const code = KEY_MAP[key] || key;
  return state.keyReleased.has(code);
}
function IsMouseButtonReleased(button) {
  return state.mouseReleased.has(button);
}
function IsMouseButtonPressed(button) {
  return state.mousePressed.has(button);
}
function GetMouseWheelMove() {
  return state.mouseWheelMove;
}
function GetMousePosition() {
  return { x: state.mousePos.x, y: state.mousePos.y };
}
function CheckCollisionPointRec(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}
function drawStrokeRect(rect, thickness, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.strokeStyle = colorToCss(color);
  ctx.lineWidth = thickness;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}
function DrawRectangle(x, y, width, height, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.fillStyle = colorToCss(color);
  ctx.fillRect(x, y, width, height);
}
function DrawRectangleV(pos, size, color) {
  DrawRectangle(pos.x, pos.y, size.x, size.y, color);
}
function DrawRectangleRec(rect, color) {
  DrawRectangle(rect.x, rect.y, rect.width, rect.height, color);
}
function DrawRectangleLines(x, y, width, height, color) {
  drawStrokeRect({ x, y, width, height }, 1, color);
}
function DrawRectangleLinesEx(rect, thickness, color) {
  drawStrokeRect(rect, thickness, color);
}
function DrawRectanglePro(rect, origin, rotationDeg, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.save();
  ctx.translate(rect.x, rect.y);
  ctx.rotate(rotationDeg * Math.PI / 180);
  ctx.fillStyle = colorToCss(color);
  ctx.fillRect(-origin.x, -origin.y, rect.width, rect.height);
  ctx.restore();
}
function DrawLine(x1, y1, x2, y2, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.strokeStyle = colorToCss(color);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function DrawLineEx(start, end, thickness, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.strokeStyle = colorToCss(color);
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}
function DrawCircle(x, y, radius, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.fillStyle = colorToCss(color);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
function DrawCircleLines(x, y, radius, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.strokeStyle = colorToCss(color);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
function DrawTriangle(v1, v2, v3, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.fillStyle = colorToCss(color);
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.lineTo(v3.x, v3.y);
  ctx.closePath();
  ctx.fill();
}
function DrawText(text, x, y, fontSize, color) {
  const ctx = state.ctx;
  if (!ctx) return;
  ctx.fillStyle = colorToCss(color);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(String(text), x, y);
}
function MeasureText(text, fontSize) {
  const ctx = state.ctx;
  if (!ctx) return String(text).length * Math.max(8, fontSize * 0.5);
  ctx.font = `${fontSize}px monospace`;
  return Math.round(ctx.measureText(String(text)).width);
}
var state, STRICT_WIDTH, STRICT_HEIGHT, KEY_MAP, MOUSE_BUTTON_LEFT, WHITE, BLACK, YELLOW, GRAY, LIGHTGRAY, DARKGRAY, GREEN, DARKGREEN, RED, MAROON, GOLD, FLAG_WINDOW_TOPMOST, FLAG_WINDOW_UNDECORATED, KEY_A, KEY_D, KEY_W, KEY_S, KEY_SPACE, KEY_ESCAPE, KEY_ENTER, KEY_N, KEY_F11;
var init_raylib_web_runtime = __esm({
  "scripts/bridge/raylib-web-runtime.js"() {
    state = {
      canvas: null,
      ctx: null,
      width: 800,
      height: 450,
      frame: 0,
      closeRequested: false,
      targetFps: 60,
      exitKey: null,
      keyDown: /* @__PURE__ */ new Set(),
      keyPressed: /* @__PURE__ */ new Set(),
      keyReleased: /* @__PURE__ */ new Set(),
      mouseDown: /* @__PURE__ */ new Set(),
      mousePressed: /* @__PURE__ */ new Set(),
      mouseReleased: /* @__PURE__ */ new Set(),
      mousePos: { x: 0, y: 0 },
      mouseWheelMove: 0,
      lastFrameStart: performance.now(),
      currentFps: 60,
      mode2dStack: 0,
      scissorStack: 0
    };
    STRICT_WIDTH = 1920;
    STRICT_HEIGHT = 1080;
    KEY_MAP = {
      KEY_A: "KeyA",
      KEY_D: "KeyD",
      KEY_W: "KeyW",
      KEY_S: "KeyS",
      KEY_SPACE: "Space",
      KEY_ESCAPE: "Escape",
      KEY_ENTER: "Enter",
      KEY_N: "KeyN",
      KEY_F11: "F11"
    };
    MOUSE_BUTTON_LEFT = 0;
    WHITE = { r: 255, g: 255, b: 255, a: 255 };
    BLACK = { r: 0, g: 0, b: 0, a: 255 };
    YELLOW = { r: 253, g: 249, b: 0, a: 255 };
    GRAY = { r: 130, g: 130, b: 130, a: 255 };
    LIGHTGRAY = { r: 200, g: 200, b: 200, a: 255 };
    DARKGRAY = { r: 80, g: 80, b: 80, a: 255 };
    GREEN = { r: 0, g: 228, b: 48, a: 255 };
    DARKGREEN = { r: 0, g: 117, b: 44, a: 255 };
    RED = { r: 230, g: 41, b: 55, a: 255 };
    MAROON = { r: 190, g: 33, b: 55, a: 255 };
    GOLD = { r: 255, g: 203, b: 0, a: 255 };
    FLAG_WINDOW_TOPMOST = 1 << 0;
    FLAG_WINDOW_UNDECORATED = 1 << 1;
    KEY_A = "KEY_A";
    KEY_D = "KEY_D";
    KEY_W = "KEY_W";
    KEY_S = "KEY_S";
    KEY_SPACE = "KEY_SPACE";
    KEY_ESCAPE = "KEY_ESCAPE";
    KEY_ENTER = "KEY_ENTER";
    KEY_N = "KEY_N";
    KEY_F11 = "KEY_F11";
  }
});

// world/tiles.js
var require_tiles = __commonJS({
  "world/tiles.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var C = {
      // grama
      grassDark: { r: 44, g: 90, b: 30, a: 255 },
      grassMid: { r: 62, g: 110, b: 44, a: 255 },
      grassLight: { r: 84, g: 138, b: 60, a: 255 },
      grassHighl: { r: 110, g: 168, b: 78, a: 255 },
      // terra / caminho
      pathDark: { r: 110, g: 78, b: 44, a: 255 },
      pathMid: { r: 148, g: 108, b: 66, a: 255 },
      pathLight: { r: 185, g: 142, b: 96, a: 255 },
      pathHighl: { r: 210, g: 170, b: 118, a: 255 },
      // paralelepipedo
      cobbDark: { r: 88, g: 80, b: 70, a: 255 },
      cobbMid: { r: 120, g: 110, b: 96, a: 255 },
      cobbLight: { r: 158, g: 148, b: 132, a: 255 },
      // madeira
      woodDark: { r: 66, g: 40, b: 18, a: 255 },
      woodMid: { r: 100, g: 64, b: 32, a: 255 },
      woodLight: { r: 142, g: 96, b: 52, a: 255 },
      // telhado
      roofDark: { r: 130, g: 36, b: 24, a: 255 },
      roofMid: { r: 175, g: 52, b: 36, a: 255 },
      roofLight: { r: 215, g: 78, b: 54, a: 255 },
      roofHighl: { r: 240, g: 110, b: 80, a: 255 },
      roofEdge: { r: 90, g: 22, b: 14, a: 255 },
      // paredes
      wallDark: { r: 178, g: 156, b: 118, a: 255 },
      wallMid: { r: 210, g: 190, b: 152, a: 255 },
      wallLight: { r: 235, g: 218, b: 182, a: 255 },
      wallHighl: { r: 250, g: 238, b: 205, a: 255 },
      // janela
      winDay: { r: 160, g: 218, b: 255, a: 255 },
      winDayHl: { r: 220, g: 245, b: 255, a: 255 },
      winNight: { r: 255, g: 218, b: 72, a: 255 },
      winNightHl: { r: 255, g: 245, b: 160, a: 255 },
      winFrame: { r: 72, g: 44, b: 18, a: 255 },
      // flores
      flowerRed: { r: 228, g: 44, b: 44, a: 255 },
      flowerRed2: { r: 255, g: 90, b: 90, a: 255 },
      flowerYel: { r: 255, g: 215, b: 28, a: 255 },
      flowerYel2: { r: 255, g: 242, b: 120, a: 255 },
      flowerPurp: { r: 148, g: 72, b: 210, a: 255 },
      flowerPurp2: { r: 195, g: 130, b: 255, a: 255 },
      flowerWhite: { r: 235, g: 235, b: 235, a: 255 },
      flowerWhite2: { r: 255, g: 255, b: 255, a: 255 },
      flowerOrange: { r: 255, g: 138, b: 30, a: 255 },
      flowerPink: { r: 255, g: 148, b: 185, a: 255 },
      stem: { r: 48, g: 116, b: 34, a: 255 },
      stemDark: { r: 32, g: 84, b: 22, a: 255 },
      petal: { r: 255, g: 230, b: 60, a: 255 },
      // arvore
      leafDark: { r: 24, g: 80, b: 20, a: 255 },
      leafMid: { r: 40, g: 112, b: 32, a: 255 },
      leafLight: { r: 62, g: 148, b: 46, a: 255 },
      leafHighl: { r: 96, g: 185, b: 68, a: 255 },
      // pedra / rocha
      stoneDark: { r: 74, g: 72, b: 76, a: 255 },
      stoneMid: { r: 112, g: 110, b: 116, a: 255 },
      stoneLight: { r: 155, g: 153, b: 160, a: 255 },
      stoneHighl: { r: 195, g: 194, b: 200, a: 255 },
      // agua
      waterDeep: { r: 24, g: 64, b: 148, a: 255 },
      waterMid: { r: 42, g: 98, b: 192, a: 255 },
      waterLight: { r: 88, g: 155, b: 234, a: 255 },
      waterHighl: { r: 165, g: 215, b: 255, a: 255 },
      waterFoam: { r: 220, g: 240, b: 255, a: 200 },
      // cerca
      fenceDark: { r: 115, g: 82, b: 42, a: 255 },
      fenceMid: { r: 162, g: 120, b: 68, a: 255 },
      fenceLight: { r: 200, g: 156, b: 96, a: 255 },
      // porta
      doorDark: { r: 62, g: 36, b: 14, a: 255 },
      doorMid: { r: 90, g: 56, b: 24, a: 255 },
      doorLight: { r: 126, g: 82, b: 42, a: 255 },
      // sombra
      shadow: { r: 0, g: 0, b: 0, a: 70 },
      shadowLight: { r: 0, g: 0, b: 0, a: 38 },
      // chamines
      chimneyDark: { r: 65, g: 55, b: 50, a: 255 },
      chimneyMid: { r: 95, g: 82, b: 74, a: 255 },
      smoke1: { r: 198, g: 195, b: 195, a: 185 },
      smoke2: { r: 220, g: 218, b: 218, a: 120 },
      smoke3: { r: 240, g: 240, b: 240, a: 65 },
      // lanterna
      lampPost: { r: 50, g: 42, b: 32, a: 255 },
      lampGlow: { r: 255, g: 230, b: 130, a: 255 },
      lampGlow2: { r: 255, g: 200, b: 60, a: 120 },
      // toldos
      awningRed: { r: 195, g: 40, b: 36, a: 255 },
      awningYel: { r: 230, g: 185, b: 30, a: 255 },
      awningWhite: { r: 240, g: 238, b: 235, a: 255 },
      // misc
      black: { r: 0, g: 0, b: 0, a: 255 },
      white: { r: 255, g: 255, b: 255, a: 255 }
    };
    var T = 24;
    function px(wx, wy, ox, oy, color) {
      ray.DrawRectangle(wx + ox, wy + oy, 1, 1, color);
    }
    function rect(wx, wy, ox, oy, w, h, color) {
      ray.DrawRectangle(wx + ox, wy + oy, w, h, color);
    }
    function drawGrass(wx, wy, variant) {
      const v = variant % 8;
      const base = v & 1 ? C.grassMid : { r: 58, g: 106, b: 40, a: 255 };
      ray.DrawRectangle(wx, wy, T, T, base);
      if (v === 0) {
        rect(wx, wy, 2, 2, 2, 1, C.grassLight);
        rect(wx, wy, 2, 3, 1, 3, C.grassLight);
        rect(wx, wy, 3, 3, 1, 2, C.grassHighl);
        px(wx, wy, 20, 7, C.grassHighl);
        px(wx, wy, 14, 18, C.grassDark);
        px(wx, wy, 7, 14, C.grassDark);
        px(wx, wy, 16, 11, { r: 50, g: 148, b: 50, a: 255 });
      } else if (v === 1) {
        rect(wx, wy, 16, 3, 3, 1, C.grassHighl);
        rect(wx, wy, 17, 4, 2, 3, C.grassLight);
        rect(wx, wy, 16, 5, 1, 2, C.grassLight);
        rect(wx, wy, 2, 16, 4, 3, { r: 38, g: 96, b: 34, a: 255 });
        rect(wx, wy, 3, 17, 2, 1, { r: 50, g: 120, b: 44, a: 255 });
        px(wx, wy, 5, 18, C.grassHighl);
        px(wx, wy, 10, 8, C.grassDark);
      } else if (v === 2) {
        rect(wx, wy, 8, 1, 1, 4, C.grassDark);
        rect(wx, wy, 7, 2, 3, 1, C.grassDark);
        rect(wx, wy, 9, 1, 1, 3, C.grassLight);
        px(wx, wy, 19, 11, C.grassLight);
        px(wx, wy, 3, 20, C.grassDark);
        px(wx, wy, 13, 7, C.grassHighl);
        rect(wx, wy, 17, 19, 3, 2, { r: 80, g: 62, b: 38, a: 140 });
      } else if (v === 3) {
        rect(wx, wy, 18, 12, 1, 6, C.grassDark);
        rect(wx, wy, 17, 14, 3, 1, C.grassDark);
        rect(wx, wy, 19, 13, 1, 4, C.grassLight);
        px(wx, wy, 4, 5, C.grassLight);
        px(wx, wy, 11, 20, C.grassHighl);
        px(wx, wy, 6, 10, { r: 46, g: 140, b: 46, a: 255 });
        px(wx, wy, 8, 9, { r: 62, g: 160, b: 52, a: 255 });
        px(wx, wy, 7, 11, { r: 38, g: 118, b: 36, a: 255 });
      } else if (v === 4) {
        rect(wx, wy, 3, 18, 8, 1, C.grassLight);
        rect(wx, wy, 5, 17, 4, 1, C.grassHighl);
        rect(wx, wy, 14, 3, 1, 5, C.grassDark);
        rect(wx, wy, 13, 4, 3, 1, C.grassDark);
        rect(wx, wy, 1, 7, 4, 1, C.grassHighl);
        rect(wx, wy, 2, 6, 2, 2, C.grassLight);
        rect(wx, wy, 9, 11, 5, 3, { r: 42, g: 102, b: 36, a: 180 });
        px(wx, wy, 11, 12, { r: 66, g: 140, b: 56, a: 255 });
      } else if (v === 5) {
        px(wx, wy, 2, 4, C.grassHighl);
        px(wx, wy, 2, 3, C.grassLight);
        px(wx, wy, 8, 18, C.grassDark);
        px(wx, wy, 9, 17, C.grassLight);
        px(wx, wy, 18, 2, C.grassHighl);
        px(wx, wy, 17, 3, C.grassLight);
        px(wx, wy, 21, 14, C.grassDark);
        px(wx, wy, 14, 21, C.grassHighl);
        rect(wx, wy, 5, 9, 3, 1, C.grassLight);
        rect(wx, wy, 6, 8, 1, 2, C.grassDark);
        rect(wx, wy, 15, 15, 3, 1, C.grassLight);
        rect(wx, wy, 16, 14, 1, 2, C.grassDark);
      } else if (v === 6) {
        rect(wx, wy, 1, 1, 7, 5, { r: 40, g: 92, b: 32, a: 200 });
        rect(wx, wy, 2, 2, 5, 3, { r: 50, g: 112, b: 42, a: 200 });
        rect(wx, wy, 14, 14, 6, 5, { r: 40, g: 92, b: 32, a: 200 });
        rect(wx, wy, 15, 15, 4, 3, { r: 54, g: 118, b: 46, a: 200 });
        px(wx, wy, 3, 3, C.grassHighl);
        px(wx, wy, 16, 16, C.grassHighl);
        px(wx, wy, 10, 8, C.grassLight);
        px(wx, wy, 8, 19, C.grassDark);
      } else {
        rect(wx, wy, 3, 3, 1, 4, C.grassDark);
        rect(wx, wy, 4, 2, 1, 5, C.grassLight);
        rect(wx, wy, 5, 3, 1, 4, C.grassDark);
        rect(wx, wy, 12, 14, 1, 4, C.grassDark);
        rect(wx, wy, 13, 13, 1, 5, C.grassLight);
        rect(wx, wy, 14, 14, 1, 4, C.grassDark);
        rect(wx, wy, 20, 6, 1, 3, C.grassHighl);
        rect(wx, wy, 7, 19, 4, 2, { r: 78, g: 58, b: 34, a: 130 });
        px(wx, wy, 16, 20, { r: 90, g: 68, b: 40, a: 120 });
      }
    }
    function drawGrassFlower(wx, wy, palette, time) {
      const pairs = [
        [C.flowerRed, C.flowerRed2],
        [C.flowerYel, C.flowerYel2],
        [C.flowerPurp, C.flowerPurp2],
        [C.flowerWhite, C.flowerWhite2],
        [C.flowerOrange, C.flowerYel2],
        [C.flowerPink, C.flowerWhite2]
      ];
      const [col, colHl] = pairs[palette % 6];
      ray.DrawRectangle(wx, wy, T, T, C.grassMid);
      rect(wx, wy, 1, 16, 5, 1, C.grassLight);
      rect(wx, wy, 16, 3, 4, 1, C.grassLight);
      rect(wx, wy, 16, 4, 1, 2, C.grassLight);
      px(wx, wy, 20, 18, C.grassDark);
      const period = 900 + palette * 130;
      const phase = Math.floor(time / period);
      const sway = phase % 3 === 0 ? 0 : phase % 3 === 1 ? 1 : 0;
      rect(wx, wy, 10 + sway, 14, 2, 8, C.stem);
      if (sway > 0) {
        rect(wx, wy, 10, 17, 2, 4, C.stemDark);
      }
      const bobPeriod = 1400 + palette * 200;
      const bob = Math.floor(time / bobPeriod) % 2 === 0 ? 0 : -1;
      const cx = 11 + sway;
      const cy = 10 + bob;
      px(wx, wy, cx, cy - 3, col);
      px(wx, wy, cx, cy + 3, col);
      px(wx, wy, cx - 3, cy, col);
      px(wx, wy, cx + 3, cy, col);
      px(wx, wy, cx - 2, cy - 2, colHl);
      px(wx, wy, cx + 2, cy - 2, colHl);
      px(wx, wy, cx - 2, cy + 2, colHl);
      px(wx, wy, cx + 2, cy + 2, colHl);
      rect(wx, wy, cx - 1, cy - 1, 3, 3, C.petal);
      px(wx, wy, cx, cy, colHl);
    }
    function drawPath(wx, wy, horizontal) {
      ray.DrawRectangle(wx, wy, T, T, C.pathMid);
      if (horizontal) {
        rect(wx, wy, 0, 9, T, 6, C.pathLight);
        rect(wx, wy, 0, 10, T, 4, C.pathMid);
        rect(wx, wy, 0, 11, T, 2, C.pathLight);
        px(wx, wy, 4, 5, C.pathLight);
        px(wx, wy, 14, 4, C.pathDark);
        px(wx, wy, 8, 17, C.pathDark);
        px(wx, wy, 20, 18, C.pathLight);
      } else {
        rect(wx, wy, 9, 0, 6, T, C.pathLight);
        rect(wx, wy, 10, 0, 4, T, C.pathMid);
        rect(wx, wy, 11, 0, 2, T, C.pathLight);
        px(wx, wy, 5, 4, C.pathLight);
        px(wx, wy, 4, 14, C.pathDark);
        px(wx, wy, 17, 8, C.pathDark);
        px(wx, wy, 18, 20, C.pathLight);
      }
    }
    function drawCobble(wx, wy) {
      ray.DrawRectangle(wx, wy, T, T, C.cobbMid);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          rect(wx, wy, c * 8 + 1, r * 8 + 1, 6, 6, C.cobbLight);
          rect(wx, wy, c * 8 + 1, r * 8 + 1, 6, 1, C.cobbDark);
          rect(wx, wy, c * 8 + 1, r * 8 + 1, 1, 6, C.cobbDark);
        }
      }
      for (let r = 0; r <= 3; r++) rect(wx, wy, 0, r * 8, T, 1, C.cobbDark);
      for (let c = 0; c <= 3; c++) rect(wx, wy, c * 8, 0, 1, T, C.cobbDark);
    }
    function drawWater(wx, wy, time) {
      ray.DrawRectangle(wx, wy, T, T, C.waterDeep);
      rect(wx, wy, 0, 0, T, 10, C.waterMid);
      const p = Math.floor(time / 420) % 6;
      rect(wx, wy, p * 4 % (T - 4), 4, 5, 1, C.waterHighl);
      rect(wx, wy, (p * 4 + 11) % (T - 4), 12, 4, 1, C.waterLight);
      rect(wx, wy, (p * 3 + 5) % (T - 3), 18, 3, 1, C.waterFoam);
    }
    function drawFlower(wx, wy, palette, time) {
      const pairs = [
        [C.flowerRed, C.flowerRed2],
        [C.flowerYel, C.flowerYel2],
        [C.flowerPurp, C.flowerPurp2],
        [C.flowerWhite, C.flowerWhite2],
        [C.flowerOrange, C.flowerYel2],
        [C.flowerPink, C.flowerWhite2]
      ];
      const [col, colHl] = pairs[palette % 6];
      const sway = Math.floor(time / 900) % 2 === 0 ? 0 : 1;
      rect(wx, wy, 10 + sway, 14, 2, 7, C.stem);
      rect(wx, wy, 12 + sway, 17, 3, 1, C.stem);
      rect(wx, wy, 12 + sway, 16, 2, 1, C.stemDark);
      const cx = 11 + sway, cy = 10;
      px(wx, wy, cx, cy - 3, col);
      px(wx, wy, cx, cy + 3, col);
      px(wx, wy, cx - 3, cy, col);
      px(wx, wy, cx + 3, cy, col);
      px(wx, wy, cx - 2, cy - 2, colHl);
      px(wx, wy, cx + 2, cy - 2, colHl);
      rect(wx, wy, cx - 1, cy - 1, 3, 3, C.petal);
      px(wx, wy, cx, cy, colHl);
    }
    function drawBush(wx, wy, time) {
      const bob = Math.floor(time / 1200) % 2;
      rect(wx, wy, 2, 14, 20, 8, C.leafDark);
      rect(wx, wy, 4, 9, 16, 8, C.leafMid);
      rect(wx, wy, 7, 5, 10, 7, C.leafLight);
      rect(wx, wy, 9, 3, 6, 4, C.leafHighl);
      rect(wx, wy, 3, 20, 18, 2, C.shadow);
      px(wx, wy, 6, 12, C.flowerRed);
      px(wx, wy, 14, 14, C.flowerRed);
      px(wx, wy, 10, 9, C.flowerRed2);
      if (bob === 0) px(wx, wy, 11, 5, C.leafHighl);
      else px(wx, wy, 13, 6, C.leafHighl);
    }
    function drawRock(wx, wy) {
      rect(wx, wy, 5, 17, 14, 3, C.shadow);
      rect(wx, wy, 4, 10, 16, 9, C.stoneDark);
      rect(wx, wy, 5, 8, 14, 9, C.stoneMid);
      rect(wx, wy, 7, 6, 10, 5, C.stoneLight);
      rect(wx, wy, 8, 7, 5, 2, C.stoneHighl);
      px(wx, wy, 9, 7, C.white);
      rect(wx, wy, 6, 14, 4, 2, C.leafDark);
      rect(wx, wy, 14, 13, 3, 2, C.leafMid);
    }
    function drawTree(wx, wy, time) {
      rect(wx, wy, 16, 64, 40, 8, C.shadow);
      rect(wx, wy, 30, 42, 12, 28, C.woodDark);
      rect(wx, wy, 32, 42, 8, 28, C.woodMid);
      rect(wx, wy, 33, 43, 3, 26, C.woodLight);
      rect(wx, wy, 26, 66, 5, 4, C.woodDark);
      rect(wx, wy, 41, 66, 5, 4, C.woodDark);
      rect(wx, wy, 14, 36, 44, 12, C.leafDark);
      rect(wx, wy, 10, 26, 52, 14, C.leafMid);
      rect(wx, wy, 8, 16, 56, 14, C.leafLight);
      rect(wx, wy, 14, 8, 44, 12, C.leafLight);
      rect(wx, wy, 20, 2, 32, 8, C.leafHighl);
      rect(wx, wy, 28, 0, 16, 4, C.leafHighl);
      rect(wx, wy, 8, 16, 4, 34, C.leafDark);
      rect(wx, wy, 60, 16, 4, 34, C.leafDark);
      const blink = Math.floor(time / 1200) % 4;
      const hlPts = [[14, 18], [45, 12], [30, 4], [55, 28]];
      for (let i = 0; i < 4; i++) {
        const [ox, oy] = hlPts[i];
        rect(wx, wy, ox, oy, 4, 2, blink === i ? C.leafHighl : C.leafLight);
      }
      px(wx, wy, 6, 30, C.leafLight);
      px(wx, wy, 65, 24, C.leafMid);
    }
    function drawFenceH(wx, wy) {
      rect(wx, wy, 0, 5, 3, 14, C.fenceDark);
      rect(wx, wy, 1, 5, 2, 14, C.fenceMid);
      rect(wx, wy, 21, 5, 3, 14, C.fenceDark);
      rect(wx, wy, 22, 5, 2, 14, C.fenceMid);
      rect(wx, wy, 3, 7, 18, 3, C.fenceLight);
      rect(wx, wy, 3, 7, 18, 1, C.fenceMid);
      rect(wx, wy, 3, 14, 18, 3, C.fenceLight);
      rect(wx, wy, 3, 14, 18, 1, C.fenceMid);
      rect(wx, wy, 0, 4, 3, 2, C.fenceLight);
      rect(wx, wy, 21, 4, 3, 2, C.fenceLight);
    }
    function drawFenceV(wx, wy) {
      rect(wx, wy, 5, 0, 3, 23, C.fenceDark);
      rect(wx, wy, 6, 0, 2, 23, C.fenceMid);
      rect(wx, wy, 14, 0, 3, 23, C.fenceDark);
      rect(wx, wy, 15, 0, 2, 23, C.fenceMid);
      rect(wx, wy, 8, 3, 6, 3, C.fenceLight);
      rect(wx, wy, 8, 3, 6, 1, C.fenceMid);
      rect(wx, wy, 8, 15, 6, 3, C.fenceLight);
      rect(wx, wy, 8, 15, 6, 1, C.fenceMid);
    }
    function drawWell(wx, wy, time) {
      const S = 48;
      rect(wx, wy, 6, 42, 36, 6, C.shadow);
      rect(wx, wy, 8, 28, 32, 16, C.stoneDark);
      rect(wx, wy, 9, 29, 30, 14, C.stoneMid);
      for (let i = 0; i < 3; i++) {
        rect(wx, wy, 9 + i * 10, 29, 9, 4, C.stoneLight);
        rect(wx, wy, 10 + i * 10, 30, 5, 2, C.stoneHighl);
      }
      rect(wx, wy, 9, 38, 30, 1, C.stoneDark);
      rect(wx, wy, 7, 26, 34, 4, C.stoneLight);
      rect(wx, wy, 8, 27, 32, 2, C.stoneHighl);
      rect(wx, wy, 14, 24, 20, 6, C.waterDeep);
      const ripple = Math.floor(time / 550) % 3;
      rect(wx, wy, 15, 26, 18, 1, C.waterMid);
      if (ripple === 0) rect(wx, wy, 16, 27, 10, 1, C.waterLight);
      else if (ripple === 1) {
        rect(wx, wy, 14, 27, 6, 1, C.waterLight);
        rect(wx, wy, 25, 27, 5, 1, C.waterLight);
      } else rect(wx, wy, 20, 27, 8, 1, C.waterHighl);
      rect(wx, wy, 23, 12, 2, 14, C.woodDark);
      rect(wx, wy, 23, 12, 1, 14, C.woodMid);
      rect(wx, wy, 20, 18, 8, 7, C.stoneDark);
      rect(wx, wy, 21, 18, 6, 6, C.stoneMid);
      rect(wx, wy, 21, 18, 6, 2, C.stoneLight);
      rect(wx, wy, 10, 8, 4, 18, C.woodDark);
      rect(wx, wy, 11, 8, 3, 18, C.woodMid);
      rect(wx, wy, 34, 8, 4, 18, C.woodDark);
      rect(wx, wy, 35, 8, 3, 18, C.woodMid);
      rect(wx, wy, 9, 6, 30, 4, C.woodDark);
      rect(wx, wy, 10, 6, 28, 3, C.woodLight);
      rect(wx, wy, 10, 7, 28, 1, C.woodMid);
      for (let i = 0; i < 6; i++) {
        const rw = (i + 1) * 6;
        rect(wx, wy, (S - rw) / 2, i, rw, 1, i % 2 === 0 ? C.roofDark : C.roofMid);
      }
      rect(wx, wy, S / 2 - 1, 0, 2, 1, C.roofHighl);
    }
    function drawHouse(wx, wy, time) {
      const W = 96;
      rect(wx, wy, 4, 90, W - 4, 6, C.shadow);
      rect(wx, wy, 0, 88, W, 8, C.stoneDark);
      rect(wx, wy, 1, 89, W - 2, 5, C.stoneMid);
      rect(wx, wy, 2, 89, W - 4, 2, C.stoneLight);
      rect(wx, wy, 0, 44, W, 52, C.wallDark);
      rect(wx, wy, 2, 44, W - 4, 50, C.wallMid);
      rect(wx, wy, 2, 44, W - 4, 2, C.wallHighl);
      const roofRows = 20;
      for (let i = 0; i < roofRows; i++) {
        const rw = Math.round((i + 1) * (W / roofRows));
        const rx = wx + Math.round((W - rw) / 2);
        const ry = wy + 24 + i;
        const col = i % 3 === 0 ? C.roofDark : i % 3 === 1 ? C.roofMid : C.roofLight;
        ray.DrawRectangle(rx, ry, rw, 1, col);
      }
      rect(wx, wy, 0, 43, W, 3, C.roofEdge);
      rect(wx, wy, 0, 44, W, 1, C.roofDark);
      rect(wx, wy, W / 2 - 2, 24, 4, 3, C.roofHighl);
      rect(wx, wy, 64, 16, 10, 28, C.chimneyDark);
      rect(wx, wy, 65, 16, 8, 28, C.chimneyMid);
      rect(wx, wy, 62, 14, 14, 4, C.stoneDark);
      rect(wx, wy, 63, 15, 12, 3, C.stoneMid);
      rect(wx, wy, 64, 15, 10, 1, C.stoneLight);
      const smoke = Math.floor(time / 380) % 5;
      if (smoke < 4) {
        px(wx, wy, 68, 14 - smoke * 2, C.smoke1);
        px(wx, wy, 69, 12 - smoke * 2, C.smoke2);
      }
      if (smoke < 3) px(wx, wy, 67, 10 - smoke * 2, C.smoke3);
      rect(wx, wy, 38, 64, 20, 32, C.doorDark);
      rect(wx, wy, 39, 64, 18, 30, C.doorMid);
      rect(wx, wy, 40, 65, 16, 14, C.doorLight);
      rect(wx, wy, 40, 81, 16, 12, C.doorLight);
      rect(wx, wy, 39, 62, 18, 4, C.doorDark);
      rect(wx, wy, 40, 62, 16, 3, C.doorMid);
      rect(wx, wy, 54, 78, 3, 3, C.stoneLight);
      rect(wx, wy, 55, 79, 2, 2, C.stoneHighl);
      rect(wx, wy, 36, 92, 24, 4, C.stoneDark);
      rect(wx, wy, 37, 93, 22, 2, C.stoneLight);
      const nightMode = Math.floor(time / 8e3) % 2 === 1;
      const winCol = nightMode ? C.winNight : C.winDay;
      const winHl = nightMode ? C.winNightHl : C.winDayHl;
      _drawWindow(wx, wy, 8, 50, winCol, winHl);
      _drawWindow(wx, wy, 70, 50, winCol, winHl);
    }
    function _drawWindow(wx, wy, ox, oy, winCol, winHl) {
      rect(wx, wy, ox, oy, 18, 16, C.winFrame);
      rect(wx, wy, ox + 1, oy + 1, 16, 14, winCol);
      rect(wx, wy, ox + 8, oy + 1, 2, 14, C.winFrame);
      rect(wx, wy, ox + 1, oy + 7, 16, 2, C.winFrame);
      rect(wx, wy, ox + 2, oy + 2, 4, 3, winHl);
    }
    function drawLargeHouse(wx, wy, time) {
      const W = 144;
      rect(wx, wy, 4, 90, W - 4, 6, C.shadow);
      rect(wx, wy, 0, 88, W, 8, C.stoneDark);
      rect(wx, wy, 1, 89, W - 2, 5, C.stoneMid);
      rect(wx, wy, 2, 89, W - 4, 2, C.stoneLight);
      rect(wx, wy, 0, 42, W, 50, C.wallDark);
      rect(wx, wy, 2, 42, W - 4, 48, C.wallMid);
      rect(wx, wy, 2, 42, W - 4, 2, C.wallHighl);
      const roofRows = 18;
      for (let i = 0; i < roofRows; i++) {
        const rw = Math.round((i + 1) * (W / roofRows));
        const rx = wx + Math.round((W - rw) / 2);
        const ry = wy + 22 + i;
        const col = i % 3 === 0 ? C.roofDark : i % 3 === 1 ? C.roofMid : C.roofLight;
        ray.DrawRectangle(rx, ry, rw, 1, col);
      }
      rect(wx, wy, 0, 39, W, 4, C.roofEdge);
      rect(wx, wy, 0, 41, W, 2, C.roofDark);
      rect(wx, wy, W / 2 - 2, 22, 4, 3, C.roofHighl);
      for (const cx of [38, W - 48]) {
        rect(wx, wy, cx, 12, 10, 28, C.chimneyDark);
        rect(wx, wy, cx + 1, 12, 8, 28, C.chimneyMid);
        rect(wx, wy, cx - 2, 10, 14, 4, C.stoneDark);
        rect(wx, wy, cx - 1, 11, 12, 3, C.stoneMid);
        rect(wx, wy, cx, 11, 10, 1, C.stoneLight);
      }
      const smoke = Math.floor(time / 380) % 5;
      for (const cx of [42, W - 44]) {
        if (smoke < 4) px(wx, wy, cx, 10 - smoke * 2, C.smoke1);
        if (smoke < 3) px(wx, wy, cx + 1, 8 - smoke * 2, C.smoke2);
      }
      rect(wx, wy, 0, 40, W, 5, C.awningRed);
      for (let i = 0; i < 6; i++) {
        rect(wx, wy, i * 24, 40, 12, 5, C.awningYel);
      }
      rect(wx, wy, 58, 58, 28, 38, C.doorDark);
      rect(wx, wy, 59, 58, 26, 36, C.doorMid);
      rect(wx, wy, 60, 60, 11, 16, C.doorLight);
      rect(wx, wy, 60, 78, 11, 14, C.doorLight);
      rect(wx, wy, 73, 60, 11, 16, C.doorLight);
      rect(wx, wy, 73, 78, 11, 14, C.doorLight);
      rect(wx, wy, 71, 58, 2, 38, C.doorDark);
      rect(wx, wy, 58, 55, 28, 5, C.doorDark);
      rect(wx, wy, 59, 55, 26, 4, C.doorMid);
      rect(wx, wy, 68, 78, 2, 3, C.stoneLight);
      rect(wx, wy, 74, 78, 2, 3, C.stoneLight);
      rect(wx, wy, 54, 92, 36, 4, C.stoneDark);
      rect(wx, wy, 55, 93, 34, 2, C.stoneLight);
      const nightMode = Math.floor(time / 8e3) % 2 === 1;
      const winCol = nightMode ? C.winNight : C.winDay;
      const winHl = nightMode ? C.winNightHl : C.winDayHl;
      for (const wx2 of [6, 32, W - 50, W - 24]) {
        _drawWindow(wx, wy, wx2, 48, winCol, winHl);
      }
      rect(wx, wy, W / 2 - 22, 26, 44, 14, C.woodDark);
      rect(wx, wy, W / 2 - 21, 27, 42, 12, C.woodMid);
      rect(wx, wy, W / 2 - 20, 28, 40, 10, C.pathHighl);
      rect(wx, wy, W / 2 - 22, 22, 2, 6, C.woodDark);
      rect(wx, wy, W / 2 + 20, 22, 2, 6, C.woodDark);
    }
    function drawGarden(wx, wy, time) {
      const S = 48;
      ray.DrawRectangle(wx, wy, S, S, C.pathDark);
      for (let r = 0; r < 5; r++) {
        rect(wx, wy, 1, 2 + r * 9, S - 2, 5, C.pathMid);
        rect(wx, wy, 1, 2 + r * 9, S - 2, 1, C.pathLight);
      }
      rect(wx, wy, 0, 0, S, 2, C.woodMid);
      rect(wx, wy, 0, S - 2, S, 2, C.woodMid);
      rect(wx, wy, 0, 0, 2, S, C.woodMid);
      rect(wx, wy, S - 2, 0, 2, S, C.woodMid);
      const palettes = [0, 1, 2, 5, 4, 3];
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
          const fx = wx + 3 + col * 11;
          const fy = wy + 1 + row * 11;
          drawFlower(fx, fy, palettes[(col + row * 2) % 6], time + col * 180 + row * 110);
        }
      }
    }
    function drawLampPost(wx, wy, time) {
      const glow = Math.floor(time / 2e3) % 2;
      rect(wx, wy, 9, 40, 6, 8, C.stoneDark);
      rect(wx, wy, 9, 40, 6, 2, C.stoneLight);
      rect(wx, wy, 10, 10, 4, 32, C.lampPost);
      rect(wx, wy, 11, 10, 2, 32, { r: 80, g: 66, b: 50, a: 255 });
      rect(wx, wy, 7, 5, 10, 8, C.lampPost);
      rect(wx, wy, 8, 6, 8, 6, glow === 0 ? C.lampGlow : C.lampGlow2);
      rect(wx, wy, 9, 7, 6, 4, glow === 0 ? { r: 255, g: 245, b: 180, a: 255 } : C.lampGlow);
      rect(wx, wy, 5, 3, 14, 3, C.lampPost);
      rect(wx, wy, 6, 4, 12, 2, { r: 70, g: 58, b: 44, a: 255 });
      if (glow === 0) rect(wx, wy, 6, 40, 12, 2, C.lampGlow2);
    }
    function drawMarketStall(wx, wy, time) {
      const W = 72;
      const bob = Math.floor(time / 1500) % 2;
      rect(wx, wy, 2, 44, W - 4, 4, C.shadow);
      for (const lx of [4, 28, 52]) {
        rect(wx, wy, lx, 28, 4, 20, C.woodDark);
        rect(wx, wy, lx + 1, 28, 2, 20, C.woodMid);
      }
      rect(wx, wy, 2, 24, W - 4, 6, C.woodDark);
      rect(wx, wy, 3, 24, W - 6, 5, C.woodLight);
      rect(wx, wy, 3, 24, W - 6, 1, { r: 200, g: 160, b: 100, a: 255 });
      for (let i = 0; i < 7; i++) {
        rect(wx, wy, i * 10 + 2, 8, 10, 18, i % 2 === 0 ? C.awningRed : C.awningWhite);
      }
      rect(wx, wy, 2, 24, W - 4, 2, C.awningRed);
      for (let i = 0; i < 8; i++) {
        rect(wx, wy, i * 9 + 4, 24 + bob, 5, 3, C.awningYel);
      }
      rect(wx, wy, 2, 8, 4, 18, C.woodDark);
      rect(wx, wy, W - 6, 8, 4, 18, C.woodDark);
      rect(wx, wy, 10, 21, 4, 3, C.flowerRed);
      rect(wx, wy, 15, 20, 4, 4, C.flowerRed2);
      rect(wx, wy, 20, 21, 4, 3, C.flowerRed);
      rect(wx, wy, 30, 20, 4, 4, C.flowerOrange);
      rect(wx, wy, 36, 21, 4, 3, C.flowerOrange);
      rect(wx, wy, 48, 18, 6, 6, C.stoneMid);
      rect(wx, wy, 49, 18, 4, 5, C.stoneLight);
      rect(wx, wy, 48, 17, 6, 2, C.stoneHighl);
      rect(wx, wy, 57, 19, 6, 5, C.stoneDark);
      rect(wx, wy, 58, 19, 4, 4, C.stoneMid);
    }
    module.exports = {
      T,
      drawGrass,
      drawGrassFlower,
      drawPath,
      drawCobble,
      drawFlower,
      drawBush,
      drawTree,
      drawFenceH,
      drawFenceV,
      drawRock,
      drawWell,
      drawHouse,
      drawLargeHouse,
      drawGarden,
      drawWater,
      drawLampPost,
      drawMarketStall
    };
  }
});

// world/map.js
var require_map = __commonJS({
  "world/map.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { T, drawGrass, drawGrassFlower } = require_tiles();
    var MAP_COLS = 72;
    var MAP_ROWS = 52;
    var MAP = [
      ",..42.2'2224,.2,3``24.22`w22..2`443334331`2.43,111342323`31,431111,..1f,",
      "3..'`2121`,114.o,'3322'1'3`2,.`y42,.331142y.3`3''12..k.`'23'''..3'113`.,",
      ".4`2``13`'.121`4`1,43,12`1.3,1441`221`21222'1`142.3,.2344.34,`3``344,.`.",
      ",4412..4241`3.3'`'444'.,',44.3'`'','3234``'4,`3`4,,2,,o2y24,''2'',.4'21,",
      "`223'3'2,p`32.2.14,1wo13,42o1'2.y'23.``.,.`'111k41'```.,`'.,'42y,1`,312`",
      "'323,33.2''1'````1221,.4`,11222'4431.3,1,4'..32'`3'32'f4,'2p.,41242`.,44",
      "4'321`44`w4'1`2.2.`.'1,'3,`,,1''42,'22.`32242113144'12'2,34143,,y1'4`442",
      "1.42,`'`..o,p2.``4,43,..`12'1,,4',',.4,133..`.22'44,o.,113`.3.'211,1,3..",
      "1o,43`3,21`,1,4,4,432,2''3`33412`3..2'3231``4132221.`24,2.`',``,,.w.4'2,",
      "1,4,y`3,.1.'132.`23,`,1324.132,44321`3.,2,,244w`'.34k``,234144.',.3'`324",
      "'`,,f4131.13',.2.1,,44y1.4',1,'113,.422,`1',.,11.'1,43..,1',2`,.,,`4w113",
      "2.,43'24,3'.,..12'`1'`42.1331.343.13'14``.`4.,,`44'.4,,..4'2`3,,.y.4.`1,",
      "`,342,`.'`3.'3'4`..434.1.244'4'2',,13.2.4'`,2,11,`2,`22,f24'.1`4.'222,4'",
      "'31.142,,f4`,13`424,.321,21..`42',2.42.``.`'4,`3,1`'''3.2w2y1`w1''..,`'4",
      "2`1312''1'`3321'2,,`,.,,,1,4..w41..,`,'`3`2242443.`p,``22,4'`'1322.`p'.4",
      "'4',1.443o',``22'3`'4.k.34,'14`31,3`.2``24`..`142'1''34'.4'322`3f3.23'24",
      "13.11..'1,13,.3,413.4,'`3,.31443.24`,`2`413',.'1413422`'4.o3'''23,'````'",
      ",41'11,..2432.4.44,1`42,k,,33`4,31,41122,2,32`'3'4434`,,1o'y2.332'.2o.2`",
      "441241,,''244,,4,`,',`2134.p431'331,3'4,.3`.,4232`.`3`.412`4`,'11.314212",
      "2f.`4``242k,``,1`2,4,`4112`.y`,1.4`f3'2`,'2'4,,2f,.2.`.1..4`31`k,44.`24.",
      "4.142`3'3`..42221`,,,31,,1o,'1,`44.1,'2`444y2.`2.'233.33''311433`,.1`'4.",
      "3.,`3'1`2,`13.`f2342423'.2'`4`23`1'443,33.`4,,`234'``'4'3413`'2314`334`,",
      "4,44`42`.,1.3'',``43,22144.,','`.23144`13','134114,2,2123'4,,244,,4`.',,",
      "22,24`4'22'4y13'411`323.34'21'412`312'w4'k4,33442311.'.,'21p41.3.2`433,o",
      ",'f',.12.o`34o,2k3.44113,3341..,`334',413y313'2'112'''1`212,``313'.,',,1",
      "1'4.`3'2143''''11,1.3424,`44''4314````w111141.434y224'32``,,43.44,.'31`2",
      "1,24,..3`24,.22o.,1,34'2',11,1'4'1,41`3``'4.12.3243`.4`,2,`,.'2'o.4''`12",
      "32`3,32y3.'`4''13'.`f1,'.,1`1`,,,..131.'..4`431`,1.323,1,1'2'`''2`'`321.",
      "'34'3.1`,21,3.11`,344.1`.'21''4,,'',2,3'33.3''413`'2,44.y3241.,k3,4'324.",
      ".`''.'14`'4331,.`4,p..'3.2242,23,43`421,1,4`f'`4312,,`,'4414.14,31'1',3,",
      "31,w,2'''2`1'4`323',43`'2`33..4.'34``1f3f2.`'.1y323.2'42424323,.4`'`1221",
      "4.1',`'44`.42.4'2,32'.42`41231`,'1`441.3,'4241`12422'32.11424`.1,,1`.413",
      "3,'.y4,.23,'1``4.'3,.,'4,`f``11.,331.2.,31,113k31.2413421'222,w4,.2'2'.'",
      ",12`',3,3.44,22`4`32''4`2222..4113.31,2.4'w124342.3341`..o34`1.1w'221,``",
      "`131`4w143`2333'21'4'143`422,14'22.2'4313,`,,21k'3.1,''2,4442433212,24`1",
      "3.4'`...f'`.,,1.3`42,`''w`3,42`11`2.'4.3.``.14142`k1'33`341''2,1.,`11221",
      "34,.1k41,,.`,..33,,31`2.`'24`432.32`2.2'p1y32''p1'`'4`2242.','`433'3242`",
      "41424,1.,k.1'2,''43,p,1.',`,23,,2`',4``443`4,23,412,4131,43,3.312.4`,`2.",
      "211`23,1'.1,1..14f`32`'w,'f.k3,,44'3'4,.1,3'114.w.1.,'4`311w14',,233'3.2",
      "3.2``,,4w,12.111,132'2,,'`3444.',44'2,2,,32`44.222242'1`2.4.,1434`14'.31",
      "`1`44'.``2.1,,4`'3w`321''42242314.`4,2242'w2`13k.1343````33`2,1`,21'1.`4",
      "3.1.24,,3`2o`'``w'21,3.311'1`2,,',4`,1.1'o2'22`.`...1.'24'p.4`'1f,3'3'41",
      "1'`.14',42'`.3`1`4,``331`.`44,,.1'1,4.1'`,4'4,``2'32'`o`3.``.,3.24',4`,.",
      "`.'',```3,141,3,31`,`244''',3,.'.134143.'2..,.3'`,23'23,42,.`w.,42`,`k.4",
      "`33`,32.,21'43.3,11`'`p,2`'24.3,324,'12..1'1`'22'`11,2`1,33.,4,4123'`211",
      ".4'4141`''31.,2323``4.`1.'3.`34.11p314,,.23'21`'23,1p.14122.,331k`1,41,,",
      "'4'244''2,4..,33.11y.314.'3443,`3'324'`4ok`322.1,`1,.y3'.`211,1.33`1.13`",
      "43.',,'122`432,1,1'`4'12112,.,2,3`1`2'''11'2.43.4.,``'3'32w,3,,'.3.33'3`",
      "43.43,f.`.2p'',.y''3'32,''1'`21`'.'`'3`3,3o.4214`''y`23.`12`4143o2..`''3",
      "3,`'4,234,`p,`1`.`324.`2411f`.'24444413p.2433.,,```244'o,3,,`112`,44',42",
      "'``4'331.,.,14`,444331'441,'f',,`'43'`'4''2.2,,14y1,`'44,'3``.3'23'`',2.",
      "3w21231w,o2''`4114,4,41,2`23'142.3`.43,,.w`.,f323.33'`,13,3,''1441`..'3'"
    ];
    var OFFSET_X = -Math.floor(MAP_COLS / 2) * T;
    var OFFSET_Y = -Math.floor(MAP_ROWS / 2) * T;
    function drawGroundTile(ch, wx, wy, time) {
      switch (ch) {
        case ".":
          drawGrass(wx, wy, 0);
          break;
        case ",":
          drawGrass(wx, wy, 1);
          break;
        case "`":
          drawGrass(wx, wy, 2);
          break;
        case "'":
          drawGrass(wx, wy, 3);
          break;
        case "1":
          drawGrass(wx, wy, 4);
          break;
        case "2":
          drawGrass(wx, wy, 5);
          break;
        case "3":
          drawGrass(wx, wy, 6);
          break;
        case "4":
          drawGrass(wx, wy, 7);
          break;
        // animated wildflowers (palette 0-5)
        case "f":
          drawGrassFlower(wx, wy, 0, time);
          break;
        // red
        case "y":
          drawGrassFlower(wx, wy, 1, time);
          break;
        // yellow
        case "p":
          drawGrassFlower(wx, wy, 2, time);
          break;
        // purple
        case "w":
          drawGrassFlower(wx, wy, 3, time);
          break;
        // white
        case "o":
          drawGrassFlower(wx, wy, 4, time);
          break;
        // orange
        case "k":
          drawGrassFlower(wx, wy, 5, time);
          break;
        // pink
        default:
          drawGrass(wx, wy, 0);
          break;
      }
    }
    var _colliders = null;
    function getColliders() {
      if (_colliders) return _colliders;
      _colliders = [];
      return _colliders;
    }
    function drawWorld(time, camera = null, screenW = 0, screenH = 0) {
      time = time || 0;
      let rowStart = 0;
      let rowEnd = MAP_ROWS - 1;
      let colStart = 0;
      let colEnd = MAP_COLS - 1;
      if (camera && camera.zoom > 0 && screenW > 0 && screenH > 0) {
        const halfW = screenW / (2 * camera.zoom);
        const halfH = screenH / (2 * camera.zoom);
        const minX = camera.target.x - halfW - T;
        const maxX = camera.target.x + halfW + T;
        const minY = camera.target.y - halfH - T;
        const maxY = camera.target.y + halfH + T;
        colStart = Math.max(0, Math.floor((minX - OFFSET_X) / T));
        colEnd = Math.min(MAP_COLS - 1, Math.floor((maxX - OFFSET_X) / T));
        rowStart = Math.max(0, Math.floor((minY - OFFSET_Y) / T));
        rowEnd = Math.min(MAP_ROWS - 1, Math.floor((maxY - OFFSET_Y) / T));
      }
      for (let row = rowStart; row <= rowEnd; row++) {
        const mapRow = MAP[row];
        for (let col = colStart; col <= colEnd; col++) {
          const ch = mapRow && mapRow[col] ? mapRow[col] : ".";
          const wx = OFFSET_X + col * T;
          const wy = OFFSET_Y + row * T;
          drawGroundTile(ch, wx, wy, time);
        }
      }
    }
    module.exports = { drawWorld, getColliders, OFFSET_X, OFFSET_Y, MAP_COLS, MAP_ROWS, T };
  }
});

// entities/player.js
var require_player = __commonJS({
  "entities/player.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { getColliders, OFFSET_X, OFFSET_Y, MAP_COLS, MAP_ROWS, T } = require_map();
    function circleRect(cx, cy, r, rx, ry, rw, rh) {
      const nearX = Math.max(rx, Math.min(cx, rx + rw));
      const nearY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - nearX;
      const dy = cy - nearY;
      return dx * dx + dy * dy < r * r;
    }
    var BASE_ATTACK_COOLDOWN = 100;
    var player = {
      x: 0,
      y: 0,
      radius: 5,
      color: ray.YELLOW,
      speed: 1,
      life: 8,
      maxLife: 8,
      // ── progressao ───────────────────────────────────────────────────────────
      level: 1,
      xp: 0,
      xpNext: 15,
      // xp para o proximo nivel
      // ── atributos de combate (usados por playing.js) ─────────────────────────
      attackDamage: 1.5,
      attackRadius: 20,
      attackCooldownMax: BASE_ATTACK_COOLDOWN,
      attackCooldownUpgrades: 0,
      // ── tipos de disparo equipados (max 2) ───────────────────────────────────
      shotTypes: [],
      // ex: ['bow', 'fireball']
      // ── feedback de dano ─────────────────────────────────────────────────────
      hurtFlash: 0,
      // frames restantes do flash de dano
      wetTimer: 0,
      // frames restantes do slow de agua (peixe)
      weaponTick: 0,
      // contador global de frames para animações de arma
      moveVx: 0,
      moveVy: 0,
      // ── upgrades extras (VS-style empilháveis) ────────────────────────────────
      armor: 0,
      // reduz dano por ataque (min 1 dmg)
      regenRate: 0,
      // HP recuperado a cada 300 frames (5s)
      regenTick: 0,
      // contador interno de frames para regen
      xpMult: 1,
      // multiplicador de XP ganho
      lifestealKills: 0,
      // kills acumuladas para lifesteal
      lifestealThreshold: 0,
      // kills p/ curar 1HP (0 = desativado)
      shotSpeedMult: 1,
      // multiplicador de velocidade dos projéteis
      shotDmgBonus: 0,
      // dano extra em todos os projéteis
      shotRadiusBonus: 0,
      // raio extra em todos os projéteis
      shotLifeBonus: 0,
      // frames extras de vida dos projéteis
      shotUpgrades: {},
      // upgrades por arma: { bow: { dmg, cdr, multi, speed }, ... }
      // input de botões
      playerWalk: function() {
        let dx = 0;
        let dy = 0;
        if (ray.IsKeyDown(ray.KEY_D)) dx += 1;
        if (ray.IsKeyDown(ray.KEY_A)) dx -= 1;
        if (ray.IsKeyDown(ray.KEY_W)) dy -= 1;
        if (ray.IsKeyDown(ray.KEY_S)) dy += 1;
        if (dx !== 0 && dy !== 0) {
          const diag = Math.sqrt(0.5);
          dx *= diag;
          dy *= diag;
        }
        const colliders = getColliders();
        const r = player.radius;
        const minX = OFFSET_X + r;
        const maxX = OFFSET_X + MAP_COLS * T - r;
        const minY = OFFSET_Y + r;
        const maxY = OFFSET_Y + MAP_ROWS * T - r;
        const spd = player.wetTimer > 0 ? player.speed * 0.5 : player.speed;
        const targetVx = dx * spd;
        const targetVy = dy * spd;
        const blend = dx !== 0 || dy !== 0 ? 0.34 : 0.22;
        player.moveVx += (targetVx - player.moveVx) * blend;
        player.moveVy += (targetVy - player.moveVy) * blend;
        if (Math.abs(player.moveVx) < 0.01) player.moveVx = 0;
        if (Math.abs(player.moveVy) < 0.01) player.moveVy = 0;
        const nx = Math.max(minX, Math.min(maxX, player.x + player.moveVx));
        if (!colliders.some((c) => circleRect(nx, player.y, r, c.x, c.y, c.w, c.h))) {
          player.x = nx;
        } else {
          player.moveVx = 0;
        }
        const ny = Math.max(minY, Math.min(maxY, player.y + player.moveVy));
        if (!colliders.some((c) => circleRect(player.x, ny, r, c.x, c.y, c.w, c.h))) {
          player.y = ny;
        } else {
          player.moveVy = 0;
        }
      },
      // desenha o personagem na tela
      playerDraw: function() {
        const x = player.x;
        const y = player.y;
        const r = player.radius;
        const s = r * 2;
        player.weaponTick = (player.weaponTick + 1) % 360;
        if (player.hurtFlash > 0) player.hurtFlash--;
        const hf = player.hurtFlash;
        const t = player.weaponTick;
        const primaryType = player.shotTypes[0] || null;
        if (primaryType) {
          const auraColors = {
            bow: { r: 180, g: 110, b: 35 },
            fireball: { r: 255, g: 100, b: 20 },
            ice: { r: 100, g: 200, b: 255 },
            lightning: { r: 255, g: 255, b: 80 },
            poison: { r: 60, g: 200, b: 50 },
            boomerang: { r: 210, g: 175, b: 40 },
            shuriken: { r: 180, g: 185, b: 210 },
            holy: { r: 255, g: 245, b: 160 }
          };
          const ac = auraColors[primaryType] || { r: 200, g: 200, b: 200 };
          const pulse = Math.round(30 + Math.abs(Math.sin(t * 0.04)) * 60);
          const pulse2 = Math.round(15 + Math.abs(Math.sin(t * 0.04 + 1)) * 30);
          ray.DrawRectangleLinesEx(
            { x: x - r - 3, y: y - r - 3, width: s + 6, height: s + 6 },
            1,
            { r: ac.r, g: ac.g, b: ac.b, a: pulse }
          );
          ray.DrawRectangleLinesEx(
            { x: x - r - 5, y: y - r - 5, width: s + 10, height: s + 10 },
            1,
            { r: ac.r, g: ac.g, b: ac.b, a: pulse2 }
          );
          if (primaryType === "fireball" || primaryType === "ice" || primaryType === "lightning" || primaryType === "poison" || primaryType === "holy") {
            const sparkCount = primaryType === "holy" ? 4 : 3;
            for (let k = 0; k < sparkCount; k++) {
              const sa = t * (primaryType === "lightning" ? 0.14 : 0.06) + k * (Math.PI * 2 / sparkCount);
              const sr = r + 5 + Math.sin(t * 0.08 + k) * 1.5;
              const sx = x + Math.cos(sa) * sr;
              const sy = y + Math.sin(sa) * sr;
              ray.DrawRectanglePro(
                { x: sx, y: sy, width: 2, height: 2 },
                { x: 1, y: 1 },
                t * 4,
                { r: ac.r, g: ac.g, b: ac.b, a: 200 }
              );
            }
          }
        }
        ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 90 });
        const bodyCol = hf > 0 ? { r: Math.min(255, 45 + hf * 11), g: Math.max(0, 75 - hf * 5), b: Math.max(0, 195 - hf * 11), a: 255 } : { r: 45, g: 75, b: 195, a: 255 };
        ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, bodyCol);
        const outCol = hf > 0 ? { r: 255, g: 255, b: 255, a: Math.min(255, hf * 20) } : { r: 125, g: 160, b: 255, a: 255 };
        ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, outCol);
        if (hf > 0) {
          const ra = Math.min(255, hf * 18);
          ray.DrawRectangleLinesEx({ x: x - r - 2, y: y - r - 2, width: s + 4, height: s + 4 }, 1, { r: 255, g: 60, b: 60, a: ra });
          ray.DrawRectangleLinesEx({ x: x - r - 4, y: y - r - 4, width: s + 8, height: s + 8 }, 1, { r: 255, g: 60, b: 60, a: Math.round(ra * 0.5) });
        }
        if (player.wetTimer > 0) {
          const wa = Math.min(180, player.wetTimer * 2);
          ray.DrawRectangleLinesEx({ x: x - r - 2, y: y - r - 2, width: s + 4, height: s + 4 }, 1, { r: 80, g: 180, b: 255, a: wa });
          ray.DrawRectangleLinesEx({ x: x - r - 4, y: y - r - 4, width: s + 8, height: s + 8 }, 1, { r: 80, g: 180, b: 255, a: Math.round(wa * 0.5) });
        }
        ray.DrawRectanglePro({ x: x - r * 0.38, y: y - r * 0.38, width: r * 0.7, height: r * 0.7 }, { x: r * 0.35, y: r * 0.35 }, 0, { r: 175, g: 200, b: 255, a: 115 });
        player._drawPlayerWeapon(x, y, r, t, player.shotTypes[0] || null, "right");
        if (player.shotTypes.length > 1)
          player._drawPlayerWeapon(x, y, r, t, player.shotTypes[1], "left");
      },
      // draw the weapon icon next to the player depending on equipped shot
      // side: 'right' (default) or 'left' — mirrors all x-offsets
      _drawPlayerWeapon: function(x, y, r, t, type, side) {
        const dir = side === "left" ? -1 : 1;
        const hx = x + dir * (r + 1);
        const hy = y;
        if (!type) {
          ray.DrawLineEx({ x: hx, y: hy - r + 2 }, { x: hx, y: hy + r - 2 }, 1.5, { r: 210, g: 215, b: 255, a: 250 });
          ray.DrawLineEx({ x: hx - 2, y: hy }, { x: hx + 2, y: hy }, 1.5, { r: 210, g: 215, b: 255, a: 200 });
          return;
        }
        if (type === "bow") {
          ray.DrawRectanglePro({ x: hx + dir, y: hy - r, width: 2, height: 2 }, { x: 1, y: 1 }, -20 * dir, { r: 180, g: 115, b: 40, a: 255 });
          ray.DrawRectanglePro({ x: hx + dir * 2, y: hy - r + 3, width: 2, height: r - 1 }, { x: 1, y: 0 }, 0, { r: 160, g: 100, b: 35, a: 255 });
          ray.DrawRectanglePro({ x: hx + dir, y: hy + r - 2, width: 2, height: 2 }, { x: 1, y: 1 }, 20 * dir, { r: 180, g: 115, b: 40, a: 255 });
          ray.DrawLineEx({ x: hx, y: hy - r + 2 }, { x: hx, y: hy + r - 2 }, 1, { r: 220, g: 200, b: 160, a: 210 });
          ray.DrawLineEx({ x: hx - dir, y: hy }, { x: hx + dir * 5, y: hy }, 1, { r: 200, g: 160, b: 80, a: 255 });
          ray.DrawRectanglePro({ x: hx + dir * 5, y: hy, width: 3, height: 3 }, { x: 1.5, y: 1.5 }, 45, { r: 220, g: 180, b: 80, a: 255 });
        } else if (type === "fireball") {
          ray.DrawLineEx({ x: hx, y: hy + r - 2 }, { x: hx + dir, y: hy - r + 4 }, 1.5, { r: 100, g: 60, b: 20, a: 255 });
          const op = Math.round(80 + Math.abs(Math.sin(t * 0.08)) * 100);
          ray.DrawRectanglePro(
            { x: hx + dir, y: hy - r + 3, width: 5, height: 5 },
            { x: 2.5, y: 2.5 },
            t * 3 * dir,
            { r: 255, g: 140, b: 20, a: op }
          );
          ray.DrawRectanglePro(
            { x: hx + dir, y: hy - r + 3, width: 3, height: 3 },
            { x: 1.5, y: 1.5 },
            t * 6 * dir,
            { r: 255, g: 220, b: 80, a: 255 }
          );
          ray.DrawRectanglePro(
            { x: hx + dir + Math.cos(t * 0.12) * 3, y: hy - r + 2 + Math.sin(t * 0.12) * 3, width: 1.5, height: 1.5 },
            { x: 0.75, y: 0.75 },
            0,
            { r: 255, g: 80, b: 20, a: 180 }
          );
        } else if (type === "ice") {
          ray.DrawLineEx({ x: hx, y: hy + r - 2 }, { x: hx + dir, y: hy - r + 4 }, 1.5, { r: 80, g: 140, b: 200, a: 255 });
          ray.DrawRectanglePro(
            { x: hx + dir, y: hy - r + 3, width: 5, height: 5 },
            { x: 2.5, y: 2.5 },
            45,
            { r: 160, g: 220, b: 255, a: 255 }
          );
          ray.DrawRectanglePro(
            { x: hx + dir, y: hy - r + 3, width: 5, height: 5 },
            { x: 2.5, y: 2.5 },
            t * 0.5 * dir,
            { r: 200, g: 240, b: 255, a: 120 }
          );
          ray.DrawLineEx({ x: hx + dir - 2, y: hy - r + 3 }, { x: hx + dir + 2, y: hy - r + 3 }, 1, { r: 255, g: 255, b: 255, a: 200 });
          ray.DrawLineEx({ x: hx + dir, y: hy - r + 1 }, { x: hx + dir, y: hy - r + 5 }, 1, { r: 255, g: 255, b: 255, a: 200 });
        } else if (type === "lightning") {
          ray.DrawLineEx({ x: hx, y: hy + r - 2 }, { x: hx + dir, y: hy - r + 5 }, 1.5, { r: 180, g: 180, b: 200, a: 255 });
          const ep = Math.round(100 + Math.abs(Math.sin(t * 0.2)) * 155);
          ray.DrawRectanglePro(
            { x: hx + dir, y: hy - r + 4, width: 4, height: 4 },
            { x: 2, y: 2 },
            t * 8 * dir,
            { r: 255, g: 255, b: 80, a: ep }
          );
          for (let k = 0; k < 3; k++) {
            const sa = t * 0.22 + k * 2.1;
            const sx = hx + dir + Math.cos(sa) * 4;
            const sy = hy - r + 4 + Math.sin(sa) * 4;
            ray.DrawRectanglePro(
              { x: sx, y: sy, width: 2, height: 2 },
              { x: 1, y: 1 },
              t * 5,
              { r: 255, g: 240, b: 100, a: 210 }
            );
          }
        } else if (type === "poison") {
          const fx = dir === 1 ? hx - 1 : hx - 3;
          ray.DrawRectangle(fx, hy - 1, 4, r, { r: 40, g: 160, b: 30, a: 200 });
          ray.DrawRectangleLines(fx, hy - 1, 4, r, { r: 80, g: 220, b: 60, a: 255 });
          ray.DrawRectangle(fx + 1, hy - r + 2, 2, 4, { r: 60, g: 180, b: 50, a: 255 });
          const bp = Math.round(Math.abs(Math.sin(t * 0.06)) * 3);
          ray.DrawRectangle(fx + 1, hy - 1 + bp, 2, 2, { r: 120, g: 255, b: 80, a: 200 });
          if (Math.sin(t * 0.07) > 0.7) {
            ray.DrawRectangle(fx + 1, hy + r, 1, 2, { r: 60, g: 200, b: 40, a: 180 });
          }
        } else if (type === "boomerang") {
          const ba = t * 0.1;
          const bsz = 6;
          ray.DrawRectanglePro(
            { x: hx + dir * 3, y: hy, width: bsz, height: 3 },
            { x: bsz * 0.5, y: 1.5 },
            ba * dir * (180 / Math.PI),
            { r: 210, g: 175, b: 45, a: 255 }
          );
          ray.DrawRectanglePro(
            { x: hx + dir * 3, y: hy, width: 3, height: bsz },
            { x: 1.5, y: bsz * 0.5 },
            ba * dir * (180 / Math.PI),
            { r: 190, g: 155, b: 35, a: 220 }
          );
          ray.DrawRectanglePro({ x: hx + dir * 3, y: hy, width: 2, height: 2 }, { x: 1, y: 1 }, 0, { r: 240, g: 210, b: 80, a: 255 });
        } else if (type === "shuriken") {
          const sa = t * 0.08;
          const ssz = 5;
          ray.DrawRectanglePro(
            { x: hx + dir * 2, y: hy, width: ssz * 2, height: ssz * 2 },
            { x: ssz, y: ssz },
            sa * (180 / Math.PI),
            { r: 180, g: 185, b: 210, a: 230 }
          );
          ray.DrawRectanglePro(
            { x: hx + dir * 2, y: hy, width: ssz * 2, height: ssz * 2 },
            { x: ssz, y: ssz },
            sa * (180 / Math.PI) + 45,
            { r: 160, g: 165, b: 190, a: 180 }
          );
          ray.DrawRectanglePro({ x: hx + dir * 2, y: hy, width: 2, height: 2 }, { x: 1, y: 1 }, 0, { r: 255, g: 255, b: 255, a: 220 });
        } else if (type === "holy") {
          ray.DrawLineEx({ x: hx, y: hy + r - 2 }, { x: hx + dir, y: hy - r + 5 }, 1.5, { r: 200, g: 170, b: 80, a: 255 });
          const gp = Math.round(160 + Math.abs(Math.sin(t * 0.05)) * 95);
          ray.DrawLineEx({ x: hx + dir - 2, y: hy - r + 4 }, { x: hx + dir + 4, y: hy - r + 4 }, 1.5, { r: 255, g: 245, b: 160, a: gp });
          ray.DrawLineEx({ x: hx + dir, y: hy - r + 1 }, { x: hx + dir, y: hy - r + 7 }, 1.5, { r: 255, g: 245, b: 160, a: gp });
          for (let k = 0; k < 2; k++) {
            const oa = t * 0.09 + k * Math.PI;
            const ox = hx + dir + Math.cos(oa) * 4;
            const oy = hy - r + 4 + Math.sin(oa) * 4;
            ray.DrawRectanglePro(
              { x: ox, y: oy, width: 2, height: 2 },
              { x: 1, y: 1 },
              0,
              { r: 255, g: 245, b: 160, a: 210 }
            );
          }
        } else {
          ray.DrawLineEx({ x: hx, y: hy - r + 2 }, { x: hx, y: hy + r - 2 }, 1.5, { r: 210, g: 215, b: 255, a: 250 });
          ray.DrawLineEx({ x: hx - 2, y: hy }, { x: hx + 2, y: hy }, 1.5, { r: 210, g: 215, b: 255, a: 200 });
        }
      },
      // ganha xp; retorna true se subiu de nivel
      gainXp: function(amount) {
        player.xp += Math.round(amount * (player.xpMult || 1));
        if (player.xp >= player.xpNext) {
          player.xp -= player.xpNext;
          player.level += 1;
          player.xpNext = Math.floor(player.xpNext * 1.45);
          player.life = player.maxLife;
          return true;
        }
        return false;
      },
      // reseta o player pro estado inicial
      reset: function() {
        player.x = 0;
        player.y = 0;
        player.life = 8;
        player.maxLife = 8;
        player.level = 1;
        player.xp = 0;
        player.xpNext = 15;
        player.speed = 1;
        player.attackDamage = 1.5;
        player.attackRadius = 20;
        player.attackCooldownMax = BASE_ATTACK_COOLDOWN;
        player.attackCooldownUpgrades = 0;
        player.shotTypes = [];
        player.hurtFlash = 0;
        player.wetTimer = 0;
        player.weaponTick = 0;
        player.moveVx = 0;
        player.moveVy = 0;
        player.armor = 0;
        player.regenRate = 0;
        player.regenTick = 0;
        player.xpMult = 1;
        player.lifestealKills = 0;
        player.lifestealThreshold = 0;
        player.shotSpeedMult = 1;
        player.shotDmgBonus = 0;
        player.shotRadiusBonus = 0;
        player.shotLifeBonus = 0;
        player.shotUpgrades = {};
      },
      // carrega os dados de um save no player
      loadFrom: function(data) {
        const p = data.player;
        player.x = p.x;
        player.y = p.y;
        player.life = p.life;
        player.moveVx = 0;
        player.moveVy = 0;
        if (p.maxLife !== void 0) player.maxLife = p.maxLife;
        if (p.level !== void 0) player.level = p.level;
        if (p.xp !== void 0) player.xp = p.xp;
        if (p.xpNext !== void 0) player.xpNext = p.xpNext;
        if (p.speed !== void 0) player.speed = p.speed;
        if (p.attackDamage !== void 0) player.attackDamage = p.attackDamage;
        if (p.attackRadius !== void 0) player.attackRadius = p.attackRadius;
        if (p.attackCooldownUpgrades !== void 0) {
          player.attackCooldownUpgrades = p.attackCooldownUpgrades;
          player.attackCooldownMax = Math.max(5, BASE_ATTACK_COOLDOWN - p.attackCooldownUpgrades * 4);
        } else if (p.attackCooldownMax !== void 0) {
          player.attackCooldownMax = p.attackCooldownMax;
        }
        if (p.shotTypes !== void 0) player.shotTypes = p.shotTypes;
        if (p.armor !== void 0) player.armor = p.armor;
        if (p.regenRate !== void 0) player.regenRate = p.regenRate;
        if (p.xpMult !== void 0) player.xpMult = p.xpMult;
        if (p.lifestealThreshold !== void 0) player.lifestealThreshold = p.lifestealThreshold;
        if (p.shotSpeedMult !== void 0) player.shotSpeedMult = p.shotSpeedMult;
        if (p.shotDmgBonus !== void 0) player.shotDmgBonus = p.shotDmgBonus;
        if (p.shotRadiusBonus !== void 0) player.shotRadiusBonus = p.shotRadiusBonus;
        if (p.shotLifeBonus !== void 0) player.shotLifeBonus = p.shotLifeBonus;
        player.shotUpgrades = p.shotUpgrades || {};
      }
    };
    module.exports = player;
  }
});

// menu/state.js
var require_state = __commonJS({
  "menu/state.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var STATUS = {
      MENU: "MENU",
      PLAYING: "PLAYING",
      PAUSED: "PAUSED",
      SLOT_SCREEN: "SLOT_SCREEN",
      CONFIG: "CONFIG",
      BOOK: "BOOK"
    };
    var currentStatus = { current: STATUS.MENU };
    function getScale() {
      return Math.min(ray.GetScreenWidth() / 800, ray.GetScreenHeight() / 450);
    }
    module.exports = { STATUS, currentStatus, getScale };
  }
});

// scripts/bridge/fs-localstorage-shim.js
var fs_localstorage_shim_exports = {};
__export(fs_localstorage_shim_exports, {
  default: () => fs_localstorage_shim_default,
  existsSync: () => existsSync,
  readFileSync: () => readFileSync,
  unlinkSync: () => unlinkSync,
  writeFileSync: () => writeFileSync
});
function normalize(path) {
  return String(path || "");
}
function get(path) {
  const key = normalize(path);
  if (mem.has(key)) return mem.get(key);
  const fromLs = localStorage.getItem(`gui_game:${key}`);
  return fromLs ?? null;
}
function set(path, value) {
  const key = normalize(path);
  const text = String(value ?? "");
  mem.set(key, text);
  localStorage.setItem(`gui_game:${key}`, text);
}
function existsSync(path) {
  return get(path) !== null;
}
function writeFileSync(path, content) {
  set(path, content);
}
function readFileSync(path) {
  const v = get(path);
  if (v === null) {
    throw new Error(`ENOENT: no such file ${path}`);
  }
  return v;
}
function unlinkSync(path) {
  const key = normalize(path);
  mem.delete(key);
  localStorage.removeItem(`gui_game:${key}`);
}
var mem, fs_localstorage_shim_default;
var init_fs_localstorage_shim = __esm({
  "scripts/bridge/fs-localstorage-shim.js"() {
    mem = /* @__PURE__ */ new Map();
    fs_localstorage_shim_default = { existsSync, writeFileSync, readFileSync, unlinkSync };
  }
});

// scripts/bridge/path-shim.js
var path_shim_exports = {};
__export(path_shim_exports, {
  default: () => path_shim_default,
  join: () => join
});
function join(...parts) {
  return parts.filter((p) => p !== void 0 && p !== null).map((p) => String(p).replace(/\\\\/g, "/")).join("/").replace(/\/+/g, "/");
}
var path_shim_default;
var init_path_shim = __esm({
  "scripts/bridge/path-shim.js"() {
    path_shim_default = { join };
  }
});

// saves/save.js
var require_save = __commonJS({
  "saves/save.js"(exports, module) {
    var fs = (init_fs_localstorage_shim(), __toCommonJS(fs_localstorage_shim_exports));
    var path = (init_path_shim(), __toCommonJS(path_shim_exports));
    var SAVE_PATH = path.join(__dirname, "savefile.json");
    var SETTINGS_PATH = path.join(__dirname, "settings.json");
    function saveSettings(resIndex, fullscreen, devMode = false) {
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ resIndex, fullscreen, devMode }, null, 2));
    }
    function loadSettings() {
      if (!fs.existsSync(SETTINGS_PATH)) return null;
      try {
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
      } catch (e) {
        return null;
      }
    }
    function getSlots() {
      if (!fs.existsSync(SAVE_PATH)) return [null, null, null];
      try {
        const data = JSON.parse(fs.readFileSync(SAVE_PATH, "utf8"));
        return [
          data.slot1 || null,
          data.slot2 || null,
          data.slot3 || null
        ];
      } catch (e) {
        console.log("erro ao ler saves:", e);
        return [null, null, null];
      }
    }
    function saveSlot(index, player, waveNumber) {
      const slots = getSlots();
      slots[index] = {
        player: {
          x: player.x,
          y: player.y,
          life: player.life,
          maxLife: player.maxLife,
          level: player.level,
          xp: player.xp,
          xpNext: player.xpNext,
          speed: player.speed,
          attackDamage: player.attackDamage,
          attackRadius: player.attackRadius,
          attackCooldownUpgrades: player.attackCooldownUpgrades || 0,
          shotTypes: player.shotTypes || [],
          shotUpgrades: player.shotUpgrades || {}
        },
        waveNumber: waveNumber || 0,
        savedAt: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR")
      };
      const data = { slot1: slots[0], slot2: slots[1], slot3: slots[2] };
      fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2));
      console.log(`slot ${index + 1} salvo`);
    }
    function hasSave() {
      return getSlots().some((s) => s !== null);
    }
    function deleteSlot(index) {
      const slots = getSlots();
      slots[index] = null;
      const data = { slot1: slots[0], slot2: slots[1], slot3: slots[2] };
      fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2));
      console.log(`slot ${index + 1} deletado`);
    }
    function deleteSave() {
      if (fs.existsSync(SAVE_PATH)) fs.unlinkSync(SAVE_PATH);
    }
    var activeSlot = { index: -1 };
    module.exports = { getSlots, saveSlot, hasSave, deleteSlot, deleteSave, saveSettings, loadSettings, activeSlot };
  }
});

// menu/buttons.js
var require_buttons = __commonJS({
  "menu/buttons.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { getScale } = require_state();
    var { hasSave } = require_save();
    var buttons = {
      play: {
        x: 300,
        y: 200,
        width: 200,
        height: 60,
        color: ray.GRAY
      },
      continueGame: {
        x: 300,
        y: 280,
        width: 200,
        height: 60,
        color: ray.GRAY
      },
      unpause: {
        x: 300,
        y: 200,
        width: 200,
        height: 60,
        color: ray.GRAY
      },
      save: {
        x: 300,
        y: 280,
        width: 200,
        height: 60,
        color: ray.GRAY
      },
      backMenu: {
        x: 300,
        y: 360,
        width: 200,
        height: 60,
        color: ray.GRAY
      },
      config: {
        x: 750,
        y: 400,
        width: 40,
        height: 40,
        color: ray.DARKGRAY
      },
      book: {
        x: 750,
        y: 340,
        width: 40,
        height: 40,
        color: ray.DARKGRAY
      },
      leave: {
        x: 300,
        y: 360,
        width: 200,
        height: 60,
        color: ray.MAROON
      }
    };
    var confirmBackMenu = {
      active: false,
      yes: { x: 255, y: 270, width: 120, height: 50, color: ray.DARKGREEN },
      no: { x: 425, y: 270, width: 120, height: 50, color: ray.MAROON }
    };
    var confirmQuit = {
      active: false,
      yes: { x: 255, y: 270, width: 120, height: 50, color: ray.DARKGREEN },
      no: { x: 425, y: 270, width: 120, height: 50, color: ray.MAROON }
    };
    function refreshButtons() {
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const cx = sw / 2;
      const bw = Math.round(200 * s);
      const bh = Math.round(60 * s);
      const gw = Math.max(32, Math.round(40 * s));
      const cw = Math.round(120 * s);
      const ch = Math.round(50 * s);
      const boxH = Math.round(180 * s);
      const boxY = Math.round(sh / 2 - boxH / 2);
      buttons.play.x = cx - bw / 2;
      buttons.play.y = Math.round(sh * 0.44);
      buttons.play.width = bw;
      buttons.play.height = bh;
      buttons.continueGame.x = cx - bw / 2;
      buttons.continueGame.y = Math.round(sh * 0.62);
      buttons.continueGame.width = bw;
      buttons.continueGame.height = bh;
      buttons.unpause.x = cx - bw / 2;
      buttons.unpause.y = Math.round(sh * 0.44);
      buttons.unpause.width = bw;
      buttons.unpause.height = bh;
      buttons.save.x = cx - bw / 2;
      buttons.save.y = Math.round(sh * 0.62);
      buttons.save.width = bw;
      buttons.save.height = bh;
      buttons.backMenu.x = cx - bw / 2;
      buttons.backMenu.y = Math.round(sh * 0.8);
      buttons.backMenu.width = bw;
      buttons.backMenu.height = bh;
      buttons.config.x = sw - gw - 10;
      buttons.config.y = sh - gw - 10;
      buttons.config.width = gw;
      buttons.config.height = gw;
      buttons.book.x = sw - gw - 10;
      buttons.book.y = sh - gw * 2 - 18;
      buttons.book.width = gw;
      buttons.book.height = gw;
      buttons.leave.x = cx - bw / 2;
      buttons.leave.y = hasSave() ? Math.round(sh * 0.8) : Math.round(sh * 0.62);
      buttons.leave.width = bw;
      buttons.leave.height = bh;
      confirmBackMenu.yes.x = cx - cw - 10;
      confirmBackMenu.yes.y = boxY + Math.round(boxH * 0.6);
      confirmBackMenu.yes.width = cw;
      confirmBackMenu.yes.height = ch;
      confirmBackMenu.no.x = cx + 10;
      confirmBackMenu.no.y = boxY + Math.round(boxH * 0.6);
      confirmBackMenu.no.width = cw;
      confirmBackMenu.no.height = ch;
      confirmQuit.yes.x = cx - cw - 10;
      confirmQuit.yes.y = boxY + Math.round(boxH * 0.6);
      confirmQuit.yes.width = cw;
      confirmQuit.yes.height = ch;
      confirmQuit.no.x = cx + 10;
      confirmQuit.no.y = boxY + Math.round(boxH * 0.6);
      confirmQuit.no.width = cw;
      confirmQuit.no.height = ch;
    }
    module.exports = { buttons, confirmBackMenu, confirmQuit, confirmLeave: confirmQuit, refreshButtons };
  }
});

// gameplay/floaters.js
var require_floaters = __commonJS({
  "gameplay/floaters.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var floaters = [];
    function addFloater(x, y, text, color) {
      floaters.push({ x, y, text, color, life: 75, maxLife: 75 });
    }
    function updateFloaters() {
      for (let i = floaters.length - 1; i >= 0; i--) {
        floaters[i].y -= 0.25;
        floaters[i].life--;
        if (floaters[i].life <= 0) floaters.splice(i, 1);
      }
    }
    function drawFloaters() {
      for (const f of floaters) {
        const alpha = Math.round(255 * (f.life / f.maxLife));
        const fs = 8;
        const tw = ray.MeasureText(f.text, fs);
        const px = Math.round(f.x - tw / 2);
        const py = Math.round(f.y);
        ray.DrawText(f.text, px + 1, py + 1, fs, { r: 0, g: 0, b: 0, a: Math.round(alpha * 0.55) });
        ray.DrawText(f.text, px, py, fs, { r: f.color.r, g: f.color.g, b: f.color.b, a: alpha });
      }
    }
    function resetFloaters() {
      floaters.length = 0;
    }
    module.exports = { addFloater, updateFloaters, drawFloaters, resetFloaters };
  }
});

// menu/devMode.js
var require_devMode = __commonJS({
  "menu/devMode.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { getScale } = require_state();
    var { saveSettings } = require_save();
    var devState = { enabled: false };
    function firstBtnY() {
      return Math.round(ray.GetScreenHeight() * 0.33);
    }
    function devModeCheckboxRect() {
      const sw = ray.GetScreenWidth();
      const s = getScale();
      const btnH = Math.round(50 * s);
      const step = btnH + Math.round(10 * s);
      const cbSz = Math.max(20, Math.round(28 * s));
      return {
        x: Math.round(sw / 2 - 150 * s),
        y: firstBtnY() + 3 * step + Math.round(20 * s) + cbSz + Math.round(14 * s),
        width: cbSz,
        height: cbSz
      };
    }
    function itsDevMode(mousePos, resIndex, fullscreenActive) {
      const dm = devModeCheckboxRect();
      if (ray.CheckCollisionPointRec(mousePos, dm) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
        devState.enabled = !devState.enabled;
        saveSettings(resIndex, fullscreenActive, devState.enabled);
      }
    }
    function drawDevModeCheckbox(mousePos) {
      const s = getScale();
      const inner = Math.round(5 * s);
      const dm = devModeCheckboxRect();
      const dmHovered = ray.CheckCollisionPointRec(mousePos, dm);
      ray.DrawRectangleLines(dm.x, dm.y, dm.width, dm.height, dmHovered ? ray.WHITE : ray.LIGHTGRAY);
      if (devState.enabled)
        ray.DrawRectangle(dm.x + inner, dm.y + inner, dm.width - inner * 2, dm.height - inner * 2, ray.GREEN);
      const dmLabelFs = Math.round(18 * s);
      ray.DrawText(
        "DEV MODE",
        dm.x + dm.width + Math.round(12 * s),
        dm.y + Math.round((dm.height - dmLabelFs) / 2),
        dmLabelFs,
        ray.WHITE
      );
    }
    function drawDevFPS() {
      if (!devState.enabled) return;
      const s = getScale();
      const sw = ray.GetScreenWidth();
      const fpsFs = Math.max(9, Math.round(14 * s));
      const fpsStr = `FPS: ${ray.GetFPS()}`;
      const fpsW = ray.MeasureText(fpsStr, fpsFs);
      const fpsX = sw - fpsW - Math.round(6 * s);
      const fpsY = Math.round(6 * s);
      ray.DrawText(fpsStr, fpsX + 1, fpsY + 1, fpsFs, { r: 0, g: 0, b: 0, a: 180 });
      ray.DrawText(fpsStr, fpsX, fpsY, fpsFs, { r: 80, g: 255, b: 160, a: 255 });
    }
    module.exports = { devState, devModeCheckboxRect, itsDevMode, drawDevModeCheckbox, drawDevFPS };
  }
});

// entities/enemy.js
var require_enemy = __commonJS({
  "entities/enemy.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { getColliders, OFFSET_X, OFFSET_Y, MAP_COLS, MAP_ROWS, T } = require_map();
    var { addFloater } = require_floaters();
    var { devState } = require_devMode();
    function circleRect(cx, cy, r, rx, ry, rw, rh) {
      const nearX = Math.max(rx, Math.min(cx, rx + rw));
      const nearY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - nearX;
      const dy = cy - nearY;
      return dx * dx + dy * dy < r * r;
    }
    function circleHitsAnyCollider(cx, cy, r, colliders) {
      for (let i = 0; i < colliders.length; i++) {
        const c = colliders[i];
        if (circleRect(cx, cy, r, c.x, c.y, c.w, c.h)) return true;
      }
      return false;
    }
    var TYPES = {
      rat: {
        radius: 4,
        speed: 0.75,
        color: { r: 135, g: 85, b: 55, a: 255 },
        maxHp: 4,
        damage: 0.75,
        attackCooldownMax: 40,
        xpReward: 2
      },
      bat: {
        radius: 4,
        speed: 0.92,
        color: { r: 82, g: 62, b: 122, a: 255 },
        maxHp: 5,
        damage: 0.8,
        attackCooldownMax: 34,
        phasing: true,
        xpReward: 3
      },
      slime: {
        radius: 7,
        speed: 0.55,
        color: { r: 50, g: 190, b: 50, a: 255 },
        maxHp: 10,
        damage: 1.5,
        attackCooldownMax: 85,
        xpReward: 5
      },
      skeleton: {
        radius: 5,
        speed: 0.75,
        color: { r: 215, g: 205, b: 185, a: 255 },
        maxHp: 7,
        damage: 1,
        attackCooldownMax: 55,
        shootCooldownMax: 150,
        shootRange: 190,
        xpReward: 8
      },
      fish: {
        radius: 5,
        speed: 0.65,
        color: { r: 140, g: 150, b: 162, a: 255 },
        maxHp: 6,
        damage: 1,
        attackCooldownMax: 70,
        shootCooldownMax: 130,
        shootRange: 190,
        xpReward: 7
      },
      wraith: {
        radius: 6,
        speed: 0.85,
        color: { r: 12, g: 8, b: 18, a: 255 },
        maxHp: 9,
        damage: 1,
        attackCooldownMax: 60,
        shootCooldownMax: 120,
        shootRange: 195,
        xpReward: 12
      },
      golem: {
        radius: 8,
        speed: 0.5,
        color: { r: 110, g: 102, b: 124, a: 255 },
        maxHp: 26,
        damage: 5,
        attackCooldownMax: 75,
        chargeCooldownMax: 150,
        chargeFrames: 16,
        chargeSpeed: 1.85,
        xpReward: 18
      },
      boneSkeleton: {
        radius: 5,
        speed: 0.75,
        color: { r: 220, g: 70, b: 100, a: 255 },
        maxHp: 20,
        damage: 0,
        attackCooldownMax: 55,
        shootCooldownMax: 150,
        shootRange: 190,
        xpReward: 10,
        immuneToPlayer: true
      }
    };
    var enemies = [];
    var projectiles = [];
    var particles = [];
    function spawnTeleportParticles(x, y) {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 0.45 + Math.random() * 1.5;
        const life = 14 + Math.floor(Math.random() * 18);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life,
          maxLife: life
        });
      }
    }
    var hpMultiplier = 1;
    var damageMultiplier = 1;
    function setHpMultiplier(val) {
      hpMultiplier = val;
    }
    function setDamageMultiplier(val) {
      damageMultiplier = val;
    }
    function spawnAtPosition(type, x, y) {
      const def = TYPES[type];
      if (!def) return;
      const r = def.radius;
      x = Math.max(OFFSET_X + r, Math.min(OFFSET_X + MAP_COLS * T - r, x));
      y = Math.max(OFFSET_Y + r, Math.min(OFFSET_Y + MAP_ROWS * T - r, y));
      const scaledHp = Math.ceil(def.maxHp * hpMultiplier);
      const scaledDamage = parseFloat((def.damage * damageMultiplier).toFixed(3));
      enemies.push({
        type,
        x,
        y,
        radius: def.radius,
        speed: def.speed,
        color: def.color,
        hp: scaledHp,
        maxHp: scaledHp,
        damage: scaledDamage,
        attackCooldownMax: def.attackCooldownMax,
        attackCooldown: 0,
        shootCooldownMax: def.shootCooldownMax || 0,
        shootCooldown: Math.floor(Math.random() * (def.shootCooldownMax || 1)),
        shootRange: def.shootRange || 0,
        xpReward: def.xpReward || 1,
        phasing: !!def.phasing,
        hurtFlash: 0,
        kbVx: 0,
        kbVy: 0,
        moveVx: 0,
        moveVy: 0,
        // flanking angle for ranged enemies (used by skeleton & fish & wraith)
        flankAngle: Math.random() * Math.PI * 2,
        flankDir: Math.random() < 0.5 ? 1 : -1,
        // wraith: cooldown ate o proximo teleporte
        teleportCooldown: type === "wraith" ? 90 + Math.floor(Math.random() * 80) : 0,
        chargeCooldownMax: def.chargeCooldownMax || 0,
        chargeCooldown: def.chargeCooldownMax ? 50 + Math.floor(Math.random() * def.chargeCooldownMax) : 0,
        chargeFrames: def.chargeFrames || 0,
        chargeTimer: 0,
        chargeSpeed: def.chargeSpeed || 0,
        chargeVx: 0,
        chargeVy: 0,
        immuneToPlayer: !!def.immuneToPlayer
      });
    }
    var WRAITH_CAM_HALF_W = 182;
    var WRAITH_CAM_HALF_H = 100;
    var KNOCKBACK_RADIUS = 58;
    var KNOCKBACK_FORCE = 10;
    function playerHurt(player, dmg) {
      const reduced = Math.max(1, dmg - (player.armor || 0));
      player.life -= reduced;
      player.hurtFlash = 18;
      if (devState.enabled) addFloater(player.x, player.y - player.radius - 2, `-${reduced}`, { r: 255, g: 80, b: 80 });
      for (const e of enemies) {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < KNOCKBACK_RADIUS && d > 0) {
          const falloff = 1 - d / KNOCKBACK_RADIUS;
          e.kbVx = dx / d * KNOCKBACK_FORCE * falloff;
          e.kbVy = dy / d * KNOCKBACK_FORCE * falloff;
        }
      }
    }
    function updateEnemies(player) {
      const colliders = getColliders();
      const minX = OFFSET_X;
      const maxX = OFFSET_X + MAP_COLS * T;
      const minY = OFFSET_Y;
      const maxY = OFFSET_Y + MAP_ROWS * T;
      if (player.wetTimer > 0) player.wetTimer--;
      for (const e of enemies) {
        if (e.hurtFlash > 0) e.hurtFlash--;
        if (e.kbVx || e.kbVy) {
          e.x += e.kbVx;
          e.y += e.kbVy;
          e.moveVx *= 0.7;
          e.moveVy *= 0.7;
          e.kbVx *= 0.72;
          e.kbVy *= 0.72;
          if (Math.abs(e.kbVx) < 0.04) e.kbVx = 0;
          if (Math.abs(e.kbVy) < 0.04) e.kbVy = 0;
          e.x = Math.max(minX + e.radius, Math.min(maxX - e.radius, e.x));
          e.y = Math.max(minY + e.radius, Math.min(maxY - e.radius, e.y));
        }
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (e.attackCooldown > 0) e.attackCooldown--;
        if (dist < e.radius + player.radius + 2 && e.attackCooldown === 0) {
          playerHurt(player, e.damage);
          e.attackCooldown = e.attackCooldownMax;
        }
        if (e.chargeCooldown > 0) e.chargeCooldown--;
        const effectiveSpeed = e.slowTimer > 0 ? e.speed * 0.4 : e.speed;
        let mx = 0, my = 0;
        const isFlanker = e.type === "skeleton" || e.type === "fish" || e.type === "wraith" || e.type === "boneSkeleton";
        if (e.type === "golem" && e.chargeTimer > 0) {
          e.chargeTimer--;
          mx = e.chargeVx;
          my = e.chargeVy;
        } else if (e.type === "golem" && e.chargeCooldown === 0 && dist < 145 && dist > e.radius + player.radius + 8) {
          e.chargeVx = dx / dist * e.chargeSpeed;
          e.chargeVy = dy / dist * e.chargeSpeed;
          e.chargeTimer = Math.max(0, e.chargeFrames - 1);
          e.chargeCooldown = e.chargeCooldownMax;
          mx = e.chargeVx;
          my = e.chargeVy;
        } else if (isFlanker && dist < e.shootRange * 1.25) {
          const preferredDist = e.shootRange * 0.62;
          e.flankAngle += e.flankDir * 0.016;
          const targetX = player.x + Math.cos(e.flankAngle) * preferredDist;
          const targetY = player.y + Math.sin(e.flankAngle) * preferredDist;
          const tdx = targetX - e.x;
          const tdy = targetY - e.y;
          const td = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
          if (td > 3) {
            mx = tdx / td * effectiveSpeed;
            my = tdy / td * effectiveSpeed;
          }
        } else if (dist > e.radius) {
          mx = dx / dist * effectiveSpeed;
          my = dy / dist * effectiveSpeed;
        }
        if (e.type === "skeleton" && e.shootCooldownMax > 0) {
          if (e.shootCooldown > 0) e.shootCooldown--;
          if (e.shootCooldown === 0 && dist < e.shootRange && dist > 0) {
            const spd = 1.4;
            projectiles.push({
              kind: "bone",
              x: e.x,
              y: e.y,
              vx: dx / dist * spd,
              vy: dy / dist * spd,
              life: 180,
              spinAngle: Math.random() * Math.PI * 2
            });
            e.shootCooldown = e.shootCooldownMax;
          }
        }
        if (e.type === "boneSkeleton" && e.shootCooldownMax > 0) {
          if (e.shootCooldown > 0) e.shootCooldown--;
          if (e.shootCooldown === 0 && dist < e.shootRange && dist > 0) {
            const spd = 1.4;
            projectiles.push({
              kind: "pinkBone",
              x: e.x,
              y: e.y,
              vx: dx / dist * spd,
              vy: dy / dist * spd,
              life: 180,
              spinAngle: Math.random() * Math.PI * 2,
              source: e
            });
            e.shootCooldown = e.shootCooldownMax;
          }
        }
        if (e.type === "fish" && e.shootCooldownMax > 0) {
          if (e.shootCooldown > 0) e.shootCooldown--;
          if (e.shootCooldown === 0 && dist < e.shootRange && dist > 0) {
            const spd = 1.8;
            projectiles.push({
              kind: "water",
              x: e.x,
              y: e.y,
              vx: dx / dist * spd,
              vy: dy / dist * spd,
              life: 200,
              spinAngle: Math.random() * Math.PI * 2
            });
            e.shootCooldown = e.shootCooldownMax;
          }
        }
        if (e.type === "wraith") {
          if (e.teleportCooldown > 0) e.teleportCooldown--;
          if (e.teleportCooldown === 0) {
            spawnTeleportParticles(e.x, e.y);
            e.x = player.x + (Math.random() * 2 - 1) * WRAITH_CAM_HALF_W;
            e.y = player.y + (Math.random() * 2 - 1) * WRAITH_CAM_HALF_H;
            e.x = Math.max(minX + e.radius, Math.min(maxX - e.radius, e.x));
            e.y = Math.max(minY + e.radius, Math.min(maxY - e.radius, e.y));
            e.moveVx = 0;
            e.moveVy = 0;
            spawnTeleportParticles(e.x, e.y);
            e.teleportCooldown = 130 + Math.floor(Math.random() * 80);
          }
          if (e.shootCooldown > 0) e.shootCooldown--;
          if (e.shootCooldown === 0 && dist < e.shootRange && dist > 0) {
            const spd = 2.2;
            projectiles.push({
              kind: "emerald",
              x: e.x,
              y: e.y,
              vx: dx / dist * spd,
              vy: dy / dist * spd,
              life: 210,
              spinAngle: Math.random() * Math.PI * 2
            });
            e.shootCooldown = e.shootCooldownMax;
          }
        }
        let stepVx = mx;
        let stepVy = my;
        const isCharging = e.type === "golem" && e.chargeTimer > 0;
        if (!isCharging) {
          const smooth = isFlanker ? 0.2 : 0.28;
          e.moveVx += (mx - e.moveVx) * smooth;
          e.moveVy += (my - e.moveVy) * smooth;
          if (Math.abs(e.moveVx) < 0.01) e.moveVx = 0;
          if (Math.abs(e.moveVy) < 0.01) e.moveVy = 0;
          stepVx = e.moveVx;
          stepVy = e.moveVy;
        } else {
          e.moveVx = mx;
          e.moveVy = my;
        }
        const r = e.radius;
        const nx = Math.max(minX + r, Math.min(maxX - r, e.x + stepVx));
        const ny = Math.max(minY + r, Math.min(maxY - r, e.y + stepVy));
        if (e.phasing) {
          e.x = nx;
          e.y = ny;
        } else {
          if (!circleHitsAnyCollider(nx, e.y, r, colliders)) {
            e.x = nx;
          } else if (e.type === "golem") {
            e.chargeTimer = 0;
            e.moveVx = 0;
            e.moveVy = 0;
          }
          if (!circleHitsAnyCollider(e.x, ny, r, colliders)) {
            e.y = ny;
          } else if (e.type === "golem") {
            e.chargeTimer = 0;
            e.moveVx = 0;
            e.moveVy = 0;
          }
        }
        const minDist = e.radius + player.radius;
        const ex = e.x - player.x;
        const ey = e.y - player.y;
        const eDist = Math.sqrt(ex * ex + ey * ey);
        if (eDist < minDist && eDist > 0) {
          const overlap = minDist - eDist;
          e.x = Math.max(minX + r, Math.min(maxX - r, e.x + ex / eDist * overlap));
          e.y = Math.max(minY + r, Math.min(maxY - r, e.y + ey / eDist * overlap));
        }
      }
      for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
          const a = enemies[i];
          const b = enemies[j];
          const sx = a.x - b.x;
          const sy = a.y - b.y;
          const minSep = a.radius + b.radius;
          const minSep2 = minSep * minSep;
          const sd2 = sx * sx + sy * sy;
          if (sd2 < minSep2 && sd2 > 0) {
            const sd = Math.sqrt(sd2);
            const push = (minSep - sd) / 2;
            const nx = sx / sd * push;
            const ny = sy / sd * push;
            a.x = Math.max(minX + a.radius, Math.min(maxX - a.radius, a.x + nx));
            a.y = Math.max(minY + a.radius, Math.min(maxY - a.radius, a.y + ny));
            b.x = Math.max(minX + b.radius, Math.min(maxX - b.radius, b.x - nx));
            b.y = Math.max(minY + b.radius, Math.min(maxY - b.radius, b.y - ny));
          }
        }
      }
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.spinAngle += p.kind === "pinkBone" ? -0.18 : 0.18;
        const hitWall = circleHitsAnyCollider(p.x, p.y, 2, colliders);
        const dxp = p.x - player.x;
        const dyp = p.y - player.y;
        const hitPlayer = dxp * dxp + dyp * dyp < (player.radius + 2) * (player.radius + 2);
        if (hitPlayer) {
          if (p.kind === "pinkBone") {
            const owner = p.source;
            if (owner && owner.hp > 0) {
              const takeDmg = Math.max(1, Math.ceil(owner.maxHp * 0.35));
              hurtEnemy(owner, takeDmg, "boneTake");
            }
          } else if (p.kind === "water") {
            player.wetTimer = 150;
            playerHurt(player, 1.5);
          } else if (p.kind === "emerald") {
            spawnTeleportParticles(player.x, player.y);
            player.x += (Math.random() * 2 - 1) * WRAITH_CAM_HALF_W;
            player.y += (Math.random() * 2 - 1) * WRAITH_CAM_HALF_H;
            player.x = Math.max(minX + player.radius, Math.min(maxX - player.radius, player.x));
            player.y = Math.max(minY + player.radius, Math.min(maxY - player.radius, player.y));
            spawnTeleportParticles(player.x, player.y);
            player.hurtFlash = 25;
          } else {
            playerHurt(player, 2.5);
          }
        }
        if (p.life <= 0 || hitWall || hitPlayer || p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
          projectiles.splice(i, 1);
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.84;
        pt.vy *= 0.84;
        pt.life--;
        if (pt.life <= 0) particles.splice(i, 1);
      }
    }
    function hurtEnemy(enemy, dmg, source = "player") {
      if (enemy.immuneToPlayer && source === "player") return 0;
      enemy.hp -= dmg;
      enemy.hurtFlash = 8;
      if (enemy.hp <= 0) {
        const xp = enemy.xpReward;
        const idx = enemies.indexOf(enemy);
        if (idx !== -1) enemies.splice(idx, 1);
        return xp;
      }
      return 0;
    }
    function drawEnemies() {
      for (const e of enemies) {
        const x = e.x;
        const y = e.y;
        const r = e.radius;
        const s = r * 2;
        const col = e.hurtFlash > 0 ? ray.WHITE : e.color;
        if (e.type === "slime") {
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 18, g: 105, b: 18, a: 230 });
          if (e.hurtFlash === 0) {
            ray.DrawRectanglePro({ x: x - r * 0.38, y: y - r * 0.38, width: r * 0.6, height: r * 0.6 }, { x: r * 0.3, y: r * 0.3 }, 0, { r: 140, g: 255, b: 140, a: 120 });
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 2, y: 2 }, { r: 220, g: 240, b: 220, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 2, y: 2 }, { r: 220, g: 240, b: 220, a: 255 });
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 1, y: 1 }, { r: 15, g: 25, b: 15, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 1, y: 1 }, { r: 15, g: 25, b: 15, a: 255 });
          }
        } else if (e.type === "skeleton") {
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 88, g: 82, b: 72, a: 220 });
          if (e.hurtFlash === 0) {
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 2, y: 2 }, { r: 18, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 2, y: 2 }, { r: 18, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 1, y: 1 }, { r: 210, g: 28, b: 28, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 1, y: 1 }, { r: 210, g: 28, b: 28, a: 255 });
            ray.DrawLineEx({ x: x - r + 2, y: y + 1 }, { x: x + r - 2, y: y + 1 }, 1, { r: 175, g: 165, b: 148, a: 175 });
            ray.DrawLineEx({ x: x - r + 3, y: y + 3 }, { x: x + r - 3, y: y + 3 }, 1, { r: 175, g: 165, b: 148, a: 145 });
          }
        } else if (e.type === "boneSkeleton") {
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 145, g: 48, b: 78, a: 230 });
          if (e.hurtFlash === 0) {
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 2, y: 2 }, { r: 18, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 2, y: 2 }, { r: 18, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 1, y: 1 }, { r: 255, g: 70, b: 120, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 1, y: 1 }, { r: 255, g: 70, b: 120, a: 255 });
            ray.DrawLineEx({ x: x - r + 2, y: y + 1 }, { x: x + r - 2, y: y + 1 }, 1, { r: 230, g: 120, b: 150, a: 180 });
            ray.DrawLineEx({ x: x - r + 3, y: y + 3 }, { x: x + r - 3, y: y + 3 }, 1, { r: 230, g: 120, b: 150, a: 150 });
          }
        } else if (e.type === "rat") {
          if (e.hurtFlash === 0) {
            ray.DrawRectangleV({ x: x - r - 1, y: y - r - 2 }, { x: 3, y: 3 }, { r: 210, g: 140, b: 120, a: 255 });
            ray.DrawRectangleV({ x: x + r - 2, y: y - r - 2 }, { x: 3, y: 3 }, { r: 210, g: 140, b: 120, a: 255 });
            ray.DrawRectangleV({ x: x - r, y: y - r - 1 }, { x: 2, y: 2 }, { r: 240, g: 170, b: 155, a: 255 });
            ray.DrawRectangleV({ x: x + r - 1, y: y - r - 1 }, { x: 2, y: 2 }, { r: 240, g: 170, b: 155, a: 255 });
          }
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 92, g: 52, b: 32, a: 200 });
          if (e.hurtFlash === 0) {
            ray.DrawRectanglePro({ x: x - r * 0.35, y: y - r * 0.35, width: r * 0.55, height: r * 0.55 }, { x: r * 0.275, y: r * 0.275 }, 0, { r: 185, g: 140, b: 115, a: 110 });
            ray.DrawRectangleV({ x: x - 2, y: y - 1 }, { x: 1, y: 1 }, { r: 25, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 1 }, { x: 1, y: 1 }, { r: 25, g: 12, b: 12, a: 255 });
            ray.DrawRectangleV({ x: x - 1, y: y + 2 }, { x: 1, y: 1 }, { r: 200, g: 75, b: 75, a: 210 });
            ray.DrawLineEx({ x: x + r - 1, y }, { x: x + r + 3, y: y + 2 }, 1, { r: 130, g: 80, b: 60, a: 185 });
          }
        } else if (e.type === "bat") {
          if (e.hurtFlash === 0) {
            ray.DrawRectanglePro({ x: x - r - 3, y, width: r + 3, height: r }, { x: 0, y: r * 0.5 }, 18, { r: 104, g: 82, b: 150, a: 230 });
            ray.DrawRectanglePro({ x: x + 1, y, width: r + 3, height: r }, { x: 0, y: r * 0.5 }, -18, { r: 104, g: 82, b: 150, a: 230 });
          }
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 56, g: 40, b: 88, a: 220 });
          if (e.hurtFlash === 0) {
            ray.DrawRectangleV({ x: x - 2, y: y - 1 }, { x: 1, y: 1 }, { r: 240, g: 210, b: 250, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 1 }, { x: 1, y: 1 }, { r: 240, g: 210, b: 250, a: 255 });
            ray.DrawRectangleV({ x, y: y + 1 }, { x: 1, y: 1 }, { r: 220, g: 90, b: 130, a: 230 });
          }
        } else if (e.type === "fish") {
          ray.DrawRectangleV({ x: x + r, y: y - r + 1 }, { x: 4, y: 3 }, { r: 110, g: 120, b: 135, a: 255 });
          ray.DrawRectangleV({ x: x + r, y: y + r - 4 }, { x: 4, y: 3 }, { r: 110, g: 120, b: 135, a: 255 });
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 70 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 90, g: 100, b: 115, a: 220 });
          if (e.hurtFlash === 0) {
            ray.DrawRectangleV({ x: x - 2, y: y - r - 3 }, { x: 5, y: 3 }, { r: 120, g: 130, b: 145, a: 255 });
            ray.DrawRectangleV({ x: x - r + 2, y: y - 2 }, { x: 2, y: 2 }, { r: 230, g: 235, b: 240, a: 255 });
            ray.DrawRectangleV({ x: x - r + 2, y: y - 2 }, { x: 1, y: 1 }, { r: 15, g: 20, b: 30, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - r - 2 }, { x: 2, y: 2 }, { r: 80, g: 180, b: 255, a: 160 });
          }
        } else if (e.type === "wraith") {
          ray.DrawRectanglePro({ x, y, width: s + 4, height: s + 4 }, { x: r + 2, y: r + 2 }, 0, { r: 80, g: 10, b: 110, a: 55 });
          ray.DrawRectanglePro({ x: x + 1, y: y + 1, width: s, height: s }, { x: r, y: r }, 0, { r: 0, g: 0, b: 0, a: 90 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 90, g: 15, b: 120, a: 230 });
          if (e.hurtFlash === 0) {
            ray.DrawLineEx({ x: x - r + 2, y: y - r + 2 }, { x: x - 1, y: y + 1 }, 1, { r: 65, g: 55, b: 80, a: 210 });
            ray.DrawLineEx({ x: x - 1, y: y + 1 }, { x: x + 2, y: y + r - 1 }, 1, { r: 65, g: 55, b: 80, a: 170 });
            ray.DrawLineEx({ x: x + 1, y: y - r + 3 }, { x: x + r - 2, y: y + 2 }, 1, { r: 58, g: 48, b: 72, a: 190 });
            ray.DrawLineEx({ x: x - r + 3, y: y + 2 }, { x, y: y + r - 2 }, 1, { r: 52, g: 44, b: 66, a: 155 });
            ray.DrawRectangleV({ x: x - 4, y: y - 3 }, { x: 4, y: 3 }, { r: 255, g: 10, b: 60, a: 60 });
            ray.DrawRectangleV({ x, y: y - 3 }, { x: 4, y: 3 }, { r: 255, g: 10, b: 60, a: 60 });
            ray.DrawRectangleV({ x: x - 3, y: y - 2 }, { x: 2, y: 2 }, { r: 255, g: 40, b: 90, a: 255 });
            ray.DrawRectangleV({ x: x + 1, y: y - 2 }, { x: 2, y: 2 }, { r: 255, g: 40, b: 90, a: 255 });
          }
        } else if (e.type === "golem") {
          ray.DrawRectanglePro({ x: x + 2, y: y + 2, width: s + 2, height: s + 2 }, { x: r + 1, y: r + 1 }, 0, { r: 0, g: 0, b: 0, a: 80 });
          ray.DrawRectanglePro({ x, y, width: s, height: s }, { x: r, y: r }, 0, col);
          ray.DrawRectangleLinesEx({ x: x - r, y: y - r, width: s, height: s }, 1, { r: 78, g: 72, b: 94, a: 230 });
          if (e.hurtFlash === 0) {
            ray.DrawLineEx({ x: x - r + 2, y: y - r + 2 }, { x: x - 1, y: y - 1 }, 1, { r: 150, g: 142, b: 168, a: 180 });
            ray.DrawLineEx({ x: x + 1, y: y - r + 3 }, { x: x + r - 2, y: y - 1 }, 1, { r: 142, g: 134, b: 160, a: 180 });
            ray.DrawLineEx({ x: x - r + 3, y: y + 2 }, { x: x - 2, y: y + r - 2 }, 1, { r: 82, g: 76, b: 100, a: 180 });
            ray.DrawRectangleV({ x: x - 4, y: y - 2 }, { x: 2, y: 2 }, { r: 235, g: 190, b: 110, a: 255 });
            ray.DrawRectangleV({ x: x + 2, y: y - 2 }, { x: 2, y: 2 }, { r: 235, g: 190, b: 110, a: 255 });
            if (e.chargeTimer > 0) {
              ray.DrawRectangleLinesEx({ x: x - r - 2, y: y - r - 2, width: s + 4, height: s + 4 }, 1, { r: 255, g: 170, b: 90, a: 180 });
            }
          }
        }
        if (e.hp < e.maxHp) {
          const bw = r * 2 + 4;
          const bx = x - r - 2;
          const by = y - r - 4;
          const pct = e.hp / e.maxHp;
          const hc = pct > 0.5 ? { r: 60, g: 200, b: 60, a: 255 } : { r: 210, g: 50, b: 50, a: 255 };
          ray.DrawRectangleV({ x: bx, y: by }, { x: bw, y: 3 }, { r: 20, g: 10, b: 10, a: 200 });
          ray.DrawRectangleV({ x: bx, y: by }, { x: bw * pct, y: 3 }, hc);
        }
        if (devState.enabled) {
          const hpText = `${e.hp}/${e.maxHp}`;
          const hpFs = 6;
          const hpW = ray.MeasureText(hpText, hpFs);
          const htY = Math.round(y - r - 14);
          ray.DrawText(hpText, Math.round(x - hpW / 2) + 1, htY + 1, hpFs, { r: 0, g: 0, b: 0, a: 180 });
          ray.DrawText(hpText, Math.round(x - hpW / 2), htY, hpFs, { r: 255, g: 240, b: 100, a: 255 });
        }
      }
    }
    function drawProjectiles() {
      for (const p of projectiles) {
        const ad = p.spinAngle * (180 / Math.PI);
        if (p.kind === "water") {
          ray.DrawRectanglePro({ x: p.x, y: p.y, width: 6, height: 6 }, { x: 3, y: 3 }, ad, { r: 80, g: 180, b: 255, a: 210 });
          ray.DrawRectangleLinesEx({ x: p.x - 3, y: p.y - 3, width: 6, height: 6 }, 1, { r: 200, g: 230, b: 255, a: 200 });
        } else if (p.kind === "pinkBone") {
          ray.DrawRectanglePro({ x: p.x, y: p.y, width: 8, height: 4 }, { x: 4, y: 2 }, ad, { r: 255, g: 100, b: 140, a: 255 });
          ray.DrawRectangleLinesEx({ x: p.x - 4, y: p.y - 2, width: 8, height: 4 }, 1, { r: 180, g: 65, b: 95, a: 220 });
        } else if (p.kind === "emerald") {
          ray.DrawRectanglePro({ x: p.x, y: p.y, width: 10, height: 10 }, { x: 5, y: 5 }, ad * 0.5, { r: 20, g: 180, b: 80, a: 55 });
          ray.DrawRectanglePro({ x: p.x, y: p.y, width: 6, height: 6 }, { x: 3, y: 3 }, ad, { r: 30, g: 210, b: 95, a: 240 });
          ray.DrawRectangleLinesEx({ x: p.x - 3, y: p.y - 3, width: 6, height: 6 }, 1, { r: 140, g: 255, b: 170, a: 220 });
        } else {
          ray.DrawRectanglePro({ x: p.x, y: p.y, width: 8, height: 4 }, { x: 4, y: 2 }, ad, { r: 230, g: 220, b: 200, a: 255 });
          ray.DrawRectangleLinesEx({ x: p.x - 4, y: p.y - 2, width: 8, height: 4 }, 1, { r: 160, g: 150, b: 130, a: 200 });
        }
      }
    }
    function drawParticles() {
      for (const pt of particles) {
        const t = pt.life / pt.maxLife;
        const a = Math.round(240 * t);
        const sz = Math.max(1, Math.ceil(3 * t));
        ray.DrawRectangleV(
          { x: Math.round(pt.x - sz * 0.5), y: Math.round(pt.y - sz * 0.5) },
          { x: sz, y: sz },
          { r: 95, g: 5, b: 130, a }
        );
        if (sz >= 2) {
          ray.DrawRectangleV(
            { x: Math.round(pt.x), y: Math.round(pt.y) },
            { x: 1, y: 1 },
            { r: 210, g: 180, b: 255, a: Math.round(a * 0.6) }
          );
        }
      }
    }
    module.exports = { enemies, projectiles, spawnAtPosition, setHpMultiplier, setDamageMultiplier, updateEnemies, drawEnemies, drawProjectiles, drawParticles, hurtEnemy };
  }
});

// gameplay/shots.js
var require_shots = __commonJS({
  "gameplay/shots.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { enemies, hurtEnemy } = require_enemy();
    var { getColliders, OFFSET_X, OFFSET_Y, MAP_COLS, MAP_ROWS, T } = require_map();
    var { addFloater } = require_floaters();
    var { devState } = require_devMode();
    var SHOT_DEFS = {
      bow: {
        title: "BOW",
        desc: "Pierces all  /  Dmg: 5",
        speed: 1.6,
        damage: 5,
        cooldown: 220,
        radius: 3,
        pierce: true,
        maxLife: 340,
        color: { r: 160, g: 100, b: 40, a: 255 }
      },
      fireball: {
        title: "FIREBALL",
        desc: "Burns on hit  /  2+8 dmg",
        speed: 2,
        damage: 2,
        cooldown: 180,
        radius: 5,
        pierce: false,
        maxLife: 220,
        onHit: (e) => {
          e.burnTimer = 240;
          e.burnDmg = 1;
          e.burnTickInterval = 30;
          e.burnTickTimer = 30;
        },
        color: { r: 255, g: 80, b: 20, a: 255 }
      },
      ice: {
        title: "ICE LANCE",
        desc: "Freezes -60%  /  Dmg: 2",
        speed: 1.8,
        damage: 2,
        cooldown: 140,
        radius: 4,
        pierce: false,
        maxLife: 220,
        onHit: (e) => {
          e.slowTimer = 210;
        },
        color: { r: 120, g: 200, b: 255, a: 255 }
      },
      lightning: {
        title: "LIGHTNING",
        desc: "Chains x2 nearby  /  Dmg: 2",
        speed: 5.5,
        damage: 2,
        cooldown: 110,
        radius: 3,
        pierce: false,
        maxLife: 130,
        chain: 2,
        color: { r: 255, g: 255, b: 80, a: 255 }
      },
      poison: {
        title: "POISON ORB",
        desc: "Poisons  /  1+6 dmg",
        speed: 2,
        damage: 1,
        cooldown: 120,
        radius: 4,
        pierce: false,
        maxLife: 220,
        onHit: (e) => {
          e.poisonTimer = 180;
          e.poisonDmg = 1;
          e.poisonInterval = 30;
          e.poisonTickTimer = 30;
        },
        color: { r: 80, g: 200, b: 60, a: 255 }
      },
      boomerang: {
        title: "BOOMERANG",
        desc: "Returns + pierces  /  Dmg: 3",
        speed: 2.5,
        damage: 3,
        cooldown: 250,
        radius: 5,
        pierce: true,
        maxLife: 260,
        returning: true,
        color: { r: 200, g: 160, b: 40, a: 255 }
      },
      shuriken: {
        title: "SHURIKEN",
        desc: "4 directions at once  /  Dmg: 2",
        speed: 2.8,
        damage: 2,
        cooldown: 95,
        radius: 3,
        pierce: true,
        maxLife: 200,
        count: 4,
        color: { r: 180, g: 180, b: 200, a: 255 }
      },
      holy: {
        title: "HOLY LIGHT",
        desc: "Pierce  /  Dmg: 7",
        speed: 1.2,
        damage: 7,
        cooldown: 250,
        radius: 9,
        pierce: true,
        maxLife: 300,
        color: { r: 255, g: 250, b: 200, a: 255 }
      }
    };
    var playerShots = [];
    var fireCooldowns = {};
    function resetFireCooldowns() {
      for (const key of Object.keys(SHOT_DEFS)) fireCooldowns[key] = 0;
    }
    resetFireCooldowns();
    function findNearestEnemy(px, py) {
      let nearest = null, minD2 = Infinity;
      for (const e of enemies) {
        if (e.immuneToPlayer) continue;
        const dx = e.x - px, dy = e.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < minD2) {
          minD2 = d2;
          nearest = e;
        }
      }
      return nearest;
    }
    function circleHit(p, e) {
      const dx = e.x - p.x, dy = e.y - p.y;
      const r = p.radius ?? SHOT_DEFS[p.type].radius;
      const minD = e.radius + r;
      return dx * dx + dy * dy < minD * minD;
    }
    function circleRect(cx, cy, r, rx, ry, rw, rh) {
      const nearX = Math.max(rx, Math.min(cx, rx + rw));
      const nearY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - nearX;
      const dy = cy - nearY;
      return dx * dx + dy * dy < r * r;
    }
    function circleHitsAnyCollider(cx, cy, r, colliders) {
      for (let i = 0; i < colliders.length; i++) {
        const c = colliders[i];
        if (circleRect(cx, cy, r, c.x, c.y, c.w, c.h)) return true;
      }
      return false;
    }
    function getShotUpgrade(player, type) {
      const up = player.shotUpgrades?.[type];
      return up || { dmg: 0, cdr: 0, multi: 0, speed: 0 };
    }
    function getEffectiveCooldown(player, type) {
      const def = SHOT_DEFS[type];
      if (!def) return 0;
      const up = getShotUpgrade(player, type);
      const mult = Math.max(0.45, 1 - (up.cdr || 0) * 0.12);
      return Math.max(18, Math.round(def.cooldown * mult));
    }
    function fireShotType(type, player) {
      const def = SHOT_DEFS[type];
      if (!def) return;
      const up = getShotUpgrade(player, type);
      const effSpd = def.speed * (player.shotSpeedMult || 1) * (1 + (up.speed || 0) * 0.1);
      const effDmg = def.damage + (player.shotDmgBonus || 0) + (up.dmg || 0);
      const effRad = def.radius + (player.shotRadiusBonus || 0);
      const effLife = def.maxLife + (player.shotLifeBonus || 0);
      const bonusCount = up.multi || 0;
      if (def.count) {
        const total2 = Math.max(1, def.count + bonusCount);
        for (let k = 0; k < total2; k++) {
          const ang = k / total2 * Math.PI * 2;
          playerShots.push({
            type,
            x: player.x,
            y: player.y,
            vx: Math.cos(ang) * effSpd,
            vy: Math.sin(ang) * effSpd,
            life: effLife,
            maxLife: effLife,
            damage: effDmg,
            radius: effRad,
            spinAngle: ang,
            hitSet: /* @__PURE__ */ new Set()
          });
        }
        return;
      }
      const target = findNearestEnemy(player.x, player.y);
      let vx = 1, vy = 0;
      if (target) {
        const dx = target.x - player.x, dy = target.y - player.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        vx = dx / d;
        vy = dy / d;
      }
      const total = Math.max(1, 1 + bonusCount);
      const baseAng = Math.atan2(vy, vx);
      const spreadStep = 0.15;
      for (let k = 0; k < total; k++) {
        const spread = (k - (total - 1) / 2) * spreadStep;
        const ang = baseAng + spread;
        playerShots.push({
          type,
          x: player.x,
          y: player.y,
          vx: Math.cos(ang) * effSpd,
          vy: Math.sin(ang) * effSpd,
          life: effLife,
          maxLife: effLife,
          damage: effDmg,
          radius: effRad,
          spinAngle: ang,
          hitSet: /* @__PURE__ */ new Set(),
          returning: false,
          chainLeft: def.chain || 0
        });
      }
    }
    function updateShots(player, onKill) {
      const minX = OFFSET_X, maxX = OFFSET_X + MAP_COLS * T;
      const minY = OFFSET_Y, maxY = OFFSET_Y + MAP_ROWS * T;
      const colliders = getColliders();
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.slowTimer > 0) e.slowTimer--;
        if (e.burnTimer > 0) {
          e.burnTimer--;
          e.burnTickTimer = (e.burnTickTimer || 0) - 1;
          if (e.burnTickTimer <= 0) {
            e.burnTickTimer = e.burnTickInterval || 30;
            const xp = hurtEnemy(e, e.burnDmg || 1);
            if (xp > 0 && onKill) onKill(xp);
          }
        }
        if (e.poisonTimer > 0) {
          e.poisonTimer--;
          e.poisonTickTimer = (e.poisonTickTimer || 0) - 1;
          if (e.poisonTickTimer <= 0) {
            e.poisonTickTimer = e.poisonInterval || 30;
            const xp = hurtEnemy(e, e.poisonDmg || 1);
            if (xp > 0 && onKill) onKill(xp);
          }
        }
      }
      for (const type of player.shotTypes) {
        if (fireCooldowns[type] === void 0) fireCooldowns[type] = 0;
        if (fireCooldowns[type] > 0) {
          fireCooldowns[type]--;
        } else if (enemies.length > 0) {
          fireShotType(type, player);
          fireCooldowns[type] = getEffectiveCooldown(player, type);
        }
      }
      for (let i = playerShots.length - 1; i >= 0; i--) {
        const p = playerShots[i];
        const def = SHOT_DEFS[p.type];
        p.spinAngle += 0.18;
        p.life--;
        if (def.returning && !p.returning && p.life <= p.maxLife / 2) {
          p.vx = -p.vx;
          p.vy = -p.vy;
          p.returning = true;
          p.hitSet.clear();
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0 || p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
          playerShots.splice(i, 1);
          continue;
        }
        const wallR = (p.radius ?? def.radius) + 1;
        if (colliders.length > 0 && circleHitsAnyCollider(p.x, p.y, wallR, colliders)) {
          playerShots.splice(i, 1);
          continue;
        }
        if (p.reflected) {
          const dx = p.x - player.x, dy = p.y - player.y;
          const pr = p.radius ?? def.radius;
          if (dx * dx + dy * dy < (player.radius + pr) * (player.radius + pr)) {
            const rdmg = p.damage ?? def.damage;
            player.life -= rdmg;
            player.hurtFlash = 18;
            if (devState.enabled) addFloater(player.x, player.y - player.radius - 2, `-${rdmg}`, { r: 255, g: 80, b: 80 });
            playerShots.splice(i, 1);
          }
          continue;
        }
        let destroyed = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (p.hitSet.has(e)) continue;
          if (!circleHit(p, e)) continue;
          if (e.immuneToPlayer) {
            if (def.pierce || def.returning) {
              p.hitSet.add(e);
            } else {
              playerShots.splice(i, 1);
              destroyed = true;
            }
            break;
          }
          if (e.type === "slime" && def.pierce) {
            const spd = Math.hypot(p.vx, p.vy);
            const rdx = player.x - p.x, rdy = player.y - p.y;
            const rd = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
            p.vx = rdx / rd * spd;
            p.vy = rdy / rd * spd;
            p.reflected = true;
            p.hitSet.add(e);
            break;
          }
          if (def.onHit) def.onHit(e);
          const dmg = p.damage ?? def.damage;
          const xp = hurtEnemy(e, dmg);
          if (xp > 0 && onKill) onKill(xp);
          if (devState.enabled) addFloater(e.x, e.y - e.radius - 2, String(dmg), { r: 255, g: 230, b: 80 });
          if (p.chainLeft > 0) {
            let closest = null, closestD = Infinity;
            for (const ce of enemies) {
              if (ce === e || p.hitSet.has(ce)) continue;
              const cdx = ce.x - e.x, cdy = ce.y - e.y;
              const cd = cdx * cdx + cdy * cdy;
              if (cd < 90 * 90 && cd < closestD) {
                closestD = cd;
                closest = ce;
              }
            }
            if (closest) {
              const dx2 = closest.x - p.x, dy2 = closest.y - p.y;
              const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
              p.vx = dx2 / d2 * def.speed;
              p.vy = dy2 / d2 * def.speed;
              p.chainLeft--;
            }
          }
          if (def.pierce || def.returning) {
            p.hitSet.add(e);
          } else {
            playerShots.splice(i, 1);
            destroyed = true;
            break;
          }
        }
      }
    }
    function drawShots() {
      for (const e of enemies) {
        const er = e.radius;
        if (e.burnTimer > 0) ray.DrawRectangleV({ x: e.x - er - 2, y: e.y - er - 2 }, { x: (er + 2) * 2, y: (er + 2) * 2 }, { r: 255, g: 80, b: 20, a: 70 });
        if (e.slowTimer > 0) ray.DrawRectangleLinesEx({ x: e.x - er - 1, y: e.y - er - 1, width: (er + 1) * 2, height: (er + 1) * 2 }, 1, { r: 120, g: 200, b: 255, a: 180 });
        if (e.poisonTimer > 0) ray.DrawRectangleLinesEx({ x: e.x - er - 1, y: e.y - er - 1, width: (er + 1) * 2, height: (er + 1) * 2 }, 1, { r: 60, g: 180, b: 40, a: 180 });
      }
      for (const p of playerShots) {
        const def = SHOT_DEFS[p.type];
        const x = p.x, y = p.y;
        const a = p.spinAngle;
        const ad = a * (180 / Math.PI);
        const r = p.radius ?? def.radius;
        if (p.type === "bow") {
          const spd = Math.hypot(p.vx, p.vy) || 1;
          const td = Math.atan2(p.vy, p.vx) * (180 / Math.PI);
          ray.DrawRectanglePro({ x, y, width: 14, height: 2 }, { x: 7, y: 1 }, td, def.color);
          ray.DrawRectanglePro({ x: x + p.vx / spd * 7, y: y + p.vy / spd * 7, width: 4, height: 4 }, { x: 2, y: 2 }, td + 45, { r: 200, g: 150, b: 60, a: 255 });
        } else if (p.type === "fireball") {
          ray.DrawRectanglePro({ x, y, width: (r + 2) * 2, height: (r + 2) * 2 }, { x: r + 2, y: r + 2 }, ad * 0.5, { r: 255, g: 140, b: 20, a: 80 });
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad, def.color);
          ray.DrawRectanglePro({ x, y, width: 4, height: 4 }, { x: 2, y: 2 }, ad * 2, { r: 255, g: 220, b: 100, a: 255 });
        } else if (p.type === "ice") {
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad, def.color);
          ray.DrawRectanglePro({ x, y, width: r * 2, height: 1 }, { x: r, y: 0.5 }, ad, ray.WHITE);
          ray.DrawRectanglePro({ x, y, width: r * 2, height: 1 }, { x: r, y: 0.5 }, ad + 90, ray.WHITE);
          ray.DrawRectanglePro({ x, y, width: r * 2, height: 1 }, { x: r, y: 0.5 }, ad + 45, { r: 200, g: 230, b: 255, a: 180 });
        } else if (p.type === "lightning") {
          ray.DrawRectanglePro({ x, y, width: (r + 2) * 2, height: (r + 2) * 2 }, { x: r + 2, y: r + 2 }, ad * 3, { r: 255, g: 255, b: 200, a: 100 });
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad * 5, def.color);
        } else if (p.type === "poison") {
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad, def.color);
          ray.DrawRectanglePro({ x, y, width: 2, height: 2 }, { x: 1, y: 1 }, ad, { r: 40, g: 120, b: 30, a: 255 });
        } else if (p.type === "boomerang") {
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad + 45, def.color);
          ray.DrawRectanglePro({ x, y, width: r * 2 - 2, height: r * 2 - 2 }, { x: r - 1, y: r - 1 }, ad, { r: 240, g: 200, b: 60, a: 160 });
        } else if (p.type === "shuriken") {
          ray.DrawRectanglePro({ x, y, width: r * 2 + 2, height: r * 2 + 2 }, { x: r + 1, y: r + 1 }, ad, def.color);
          ray.DrawRectanglePro({ x, y, width: r * 2 + 2, height: r * 2 + 2 }, { x: r + 1, y: r + 1 }, ad + 45, def.color);
          ray.DrawRectanglePro({ x, y, width: 3, height: 3 }, { x: 1.5, y: 1.5 }, 0, ray.WHITE);
        } else if (p.type === "holy") {
          ray.DrawRectanglePro({ x, y, width: (r + 3) * 2, height: (r + 3) * 2 }, { x: r + 3, y: r + 3 }, ad * 0.3, { r: 255, g: 255, b: 200, a: 50 });
          ray.DrawRectanglePro({ x, y, width: r * 2 + 2, height: r * 2 + 2 }, { x: r + 1, y: r + 1 }, ad, { r: 255, g: 220, b: 100, a: 200 });
          ray.DrawRectanglePro({ x, y, width: r * 2, height: r * 2 }, { x: r, y: r }, ad, def.color);
          for (let k = 0; k < 4; k++) {
            const ka = a + k * (Math.PI / 2);
            ray.DrawRectanglePro(
              { x: x + Math.cos(ka) * r, y: y + Math.sin(ka) * r, width: 4, height: 4 },
              { x: 2, y: 2 },
              ad + k * 90,
              ray.GOLD
            );
          }
        }
      }
    }
    function resetShots() {
      playerShots.length = 0;
      resetFireCooldowns();
    }
    module.exports = { SHOT_DEFS, playerShots, updateShots, drawShots, resetShots };
  }
});

// gameplay/levelup.js
var require_levelup = __commonJS({
  "gameplay/levelup.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var player = require_player();
    var { getScale } = require_state();
    var { SHOT_DEFS } = require_shots();
    var UPGRADE_POOL = [
      // ── stats e utilidade (empilháveis) ─────────────────────────────────────
      {
        id: "speed",
        title: "AGILITY",
        desc: "+0.15 Move Speed",
        apply: () => {
          player.speed += 0.15;
        }
      },
      {
        id: "maxLife",
        title: "VITALITY",
        desc: "+3 Max HP  +3 Heal",
        apply: () => {
          player.maxLife += 3;
          player.life = Math.min(player.life + 3, player.maxLife);
        }
      },
      {
        id: "attackDmg",
        title: "STRENGTH",
        desc: "+0.5 Melee Damage",
        apply: () => {
          player.attackDamage += 0.5;
        }
      },
      {
        id: "attackRadius",
        title: "REACH",
        desc: "+5 Attack Range",
        apply: () => {
          player.attackRadius += 5;
        }
      },
      {
        id: "attackCooldown",
        title: "DEXTERITY",
        desc: "-4 Frames Cooldown",
        apply: () => {
          player.attackCooldownUpgrades = (player.attackCooldownUpgrades || 0) + 1;
          player.attackCooldownMax = Math.max(5, player.attackCooldownMax - 4);
        }
      },
      {
        id: "heal",
        title: "RECOVERY",
        desc: "Restore +12 HP Now",
        apply: () => {
          player.life = Math.min(player.life + 12, player.maxLife);
        }
      },
      {
        id: "armor",
        title: "IRON SKIN",
        desc: "+1 Armor  (min 1/hit)",
        apply: () => {
          player.armor = (player.armor || 0) + 1;
        }
      },
      {
        id: "regen",
        title: "REGENERATION",
        desc: "+1 HP / 5 Seconds",
        apply: () => {
          player.regenRate = (player.regenRate || 0) + 1;
        }
      },
      {
        id: "fortune",
        title: "FORTUNE",
        desc: "+25% XP Gain  (stacks)",
        apply: () => {
          player.xpMult = parseFloat(((player.xpMult || 1) * 1.25).toFixed(4));
        }
      },
      {
        id: "lifesteal",
        title: "VAMPIRISM",
        desc: "Heal 1HP / 5 Kills",
        apply: () => {
          player.lifestealThreshold = player.lifestealThreshold > 0 ? Math.max(2, player.lifestealThreshold - 1) : 5;
        }
      },
      {
        id: "shot_speed",
        title: "VELOCITY",
        desc: "+20% Projectile Speed",
        apply: () => {
          player.shotSpeedMult = parseFloat(((player.shotSpeedMult || 1) * 1.2).toFixed(4));
        }
      },
      {
        id: "shot_damage",
        title: "FIREPOWER",
        desc: "+1 Dmg to All Shots",
        apply: () => {
          player.shotDmgBonus = (player.shotDmgBonus || 0) + 1;
        }
      },
      {
        id: "big_shots",
        title: "IMPACT",
        desc: "+2 Shot Hitbox Radius",
        apply: () => {
          player.shotRadiusBonus = (player.shotRadiusBonus || 0) + 2;
        }
      },
      {
        id: "long_shots",
        title: "RANGE",
        desc: "+60 Frames Shot Range",
        apply: () => {
          player.shotLifeBonus = (player.shotLifeBonus || 0) + 60;
        }
      },
      {
        id: "berserker",
        title: "BERSERKER",
        desc: "+1.5 Melee  /  -0.15 Speed",
        apply: () => {
          player.attackDamage += 1.5;
          player.speed = Math.max(0.3, player.speed - 0.15);
        }
      },
      // ── weapons ──────────────────────────────────────────────────────────────
      {
        id: "shot_bow",
        shotType: "bow",
        title: SHOT_DEFS.bow.title,
        desc: SHOT_DEFS.bow.desc,
        apply: () => {
          if (!player.shotTypes.includes("bow")) player.shotTypes.push("bow");
        }
      },
      {
        id: "shot_fireball",
        shotType: "fireball",
        title: SHOT_DEFS.fireball.title,
        desc: SHOT_DEFS.fireball.desc,
        apply: () => {
          if (!player.shotTypes.includes("fireball")) player.shotTypes.push("fireball");
        }
      },
      {
        id: "shot_ice",
        shotType: "ice",
        title: SHOT_DEFS.ice.title,
        desc: SHOT_DEFS.ice.desc,
        apply: () => {
          if (!player.shotTypes.includes("ice")) player.shotTypes.push("ice");
        }
      },
      {
        id: "shot_lightning",
        shotType: "lightning",
        title: SHOT_DEFS.lightning.title,
        desc: SHOT_DEFS.lightning.desc,
        apply: () => {
          if (!player.shotTypes.includes("lightning")) player.shotTypes.push("lightning");
        }
      },
      {
        id: "shot_poison",
        shotType: "poison",
        title: SHOT_DEFS.poison.title,
        desc: SHOT_DEFS.poison.desc,
        apply: () => {
          if (!player.shotTypes.includes("poison")) player.shotTypes.push("poison");
        }
      },
      {
        id: "shot_boomerang",
        shotType: "boomerang",
        title: SHOT_DEFS.boomerang.title,
        desc: SHOT_DEFS.boomerang.desc,
        apply: () => {
          if (!player.shotTypes.includes("boomerang")) player.shotTypes.push("boomerang");
        }
      },
      {
        id: "shot_shuriken",
        shotType: "shuriken",
        title: SHOT_DEFS.shuriken.title,
        desc: SHOT_DEFS.shuriken.desc,
        apply: () => {
          if (!player.shotTypes.includes("shuriken")) player.shotTypes.push("shuriken");
        }
      },
      {
        id: "shot_holy",
        shotType: "holy",
        title: SHOT_DEFS.holy.title,
        desc: SHOT_DEFS.holy.desc,
        apply: () => {
          if (!player.shotTypes.includes("holy")) player.shotTypes.push("holy");
        }
      }
    ];
    function getShotUpgradeBucket(type) {
      if (!player.shotUpgrades) player.shotUpgrades = {};
      if (!player.shotUpgrades[type]) {
        player.shotUpgrades[type] = { dmg: 0, cdr: 0, multi: 0, speed: 0 };
      }
      return player.shotUpgrades[type];
    }
    function makeWeaponUpgradeCards() {
      const cards2 = [];
      for (const type of player.shotTypes) {
        const def = SHOT_DEFS[type];
        if (!def) continue;
        const up = getShotUpgradeBucket(type);
        const maxDmg = 6;
        const maxCdr = 4;
        const maxMulti = 3;
        if ((up.dmg || 0) < maxDmg) {
          cards2.push({
            id: `wup_${type}_dmg`,
            title: `${def.title} MIGHT`,
            desc: `+1 Damage for ${def.title}
(${up.dmg || 0}/${maxDmg})`,
            apply: () => {
              getShotUpgradeBucket(type).dmg += 1;
            }
          });
        }
        if ((up.cdr || 0) < maxCdr) {
          cards2.push({
            id: `wup_${type}_cdr`,
            title: `${def.title} RHYTHM`,
            desc: `-12% Cooldown for ${def.title}
(${up.cdr || 0}/${maxCdr})`,
            apply: () => {
              getShotUpgradeBucket(type).cdr += 1;
            }
          });
        }
        if ((up.multi || 0) < maxMulti) {
          cards2.push({
            id: `wup_${type}_multi`,
            title: `${def.title} SPLIT`,
            desc: `+1 Projectile for ${def.title}
(${up.multi || 0}/${maxMulti})`,
            apply: () => {
              getShotUpgradeBucket(type).multi += 1;
            }
          });
        }
      }
      return cards2;
    }
    var active = false;
    var cards = [];
    var cardBtns = [
      { x: 0, y: 0, width: 0, height: 0 },
      { x: 0, y: 0, width: 0, height: 0 },
      { x: 0, y: 0, width: 0, height: 0 }
    ];
    function openLevelUp() {
      if (active) return;
      active = true;
      let pool = [...UPGRADE_POOL].filter((u) => {
        if (u.shotType) {
          if (player.shotTypes.includes(u.shotType)) return false;
          if (player.shotTypes.length >= 2) return false;
        }
        return true;
      });
      pool.push(...makeWeaponUpgradeCards());
      pool.sort(() => Math.random() - 0.5);
      while (pool.length < 3) pool.push(UPGRADE_POOL.find((u) => u.id === "heal"));
      cards = pool.slice(0, 3);
    }
    function isLevelUpActive() {
      return active;
    }
    function itsLevelUp() {
      if (!active) return;
      const mouse = ray.GetMousePosition();
      for (let i = 0; i < 3; i++) {
        if (ray.CheckCollisionPointRec(mouse, cardBtns[i])) {
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            cards[i].apply();
            active = false;
          }
        }
      }
    }
    function getCardTheme(id) {
      if (id.startsWith("wup_")) {
        const parts = id.split("_");
        const shotId = `shot_${parts[1] || ""}`;
        id = shotId;
      }
      const T = {
        speed: { accent: { r: 50, g: 220, b: 210, a: 255 }, bg: { r: 6, g: 26, b: 28, a: 255 } },
        maxLife: { accent: { r: 235, g: 60, b: 80, a: 255 }, bg: { r: 28, g: 6, b: 12, a: 255 } },
        attackDmg: { accent: { r: 245, g: 120, b: 30, a: 255 }, bg: { r: 28, g: 12, b: 4, a: 255 } },
        attackRadius: { accent: { r: 230, g: 170, b: 30, a: 255 }, bg: { r: 26, g: 18, b: 4, a: 255 } },
        attackCooldown: { accent: { r: 60, g: 170, b: 255, a: 255 }, bg: { r: 6, g: 14, b: 32, a: 255 } },
        heal: { accent: { r: 60, g: 230, b: 100, a: 255 }, bg: { r: 6, g: 26, b: 12, a: 255 } },
        armor: { accent: { r: 100, g: 155, b: 235, a: 255 }, bg: { r: 8, g: 12, b: 30, a: 255 } },
        regen: { accent: { r: 80, g: 235, b: 110, a: 255 }, bg: { r: 6, g: 26, b: 12, a: 255 } },
        fortune: { accent: { r: 255, g: 210, b: 40, a: 255 }, bg: { r: 26, g: 20, b: 4, a: 255 } },
        lifesteal: { accent: { r: 215, g: 30, b: 60, a: 255 }, bg: { r: 28, g: 4, b: 10, a: 255 } },
        shot_speed: { accent: { r: 255, g: 235, b: 60, a: 255 }, bg: { r: 24, g: 22, b: 4, a: 255 } },
        shot_damage: { accent: { r: 255, g: 140, b: 30, a: 255 }, bg: { r: 28, g: 12, b: 4, a: 255 } },
        big_shots: { accent: { r: 255, g: 180, b: 50, a: 255 }, bg: { r: 26, g: 16, b: 4, a: 255 } },
        long_shots: { accent: { r: 220, g: 195, b: 60, a: 255 }, bg: { r: 24, g: 20, b: 4, a: 255 } },
        berserker: { accent: { r: 255, g: 50, b: 30, a: 255 }, bg: { r: 30, g: 4, b: 4, a: 255 } },
        shot_bow: { accent: { r: 200, g: 155, b: 65, a: 255 }, bg: { r: 22, g: 16, b: 4, a: 255 } },
        shot_fireball: { accent: { r: 255, g: 90, b: 20, a: 255 }, bg: { r: 28, g: 8, b: 4, a: 255 } },
        shot_ice: { accent: { r: 100, g: 200, b: 255, a: 255 }, bg: { r: 6, g: 14, b: 30, a: 255 } },
        shot_lightning: { accent: { r: 255, g: 255, b: 60, a: 255 }, bg: { r: 22, g: 22, b: 4, a: 255 } },
        shot_poison: { accent: { r: 80, g: 225, b: 60, a: 255 }, bg: { r: 6, g: 24, b: 4, a: 255 } },
        shot_boomerang: { accent: { r: 215, g: 165, b: 50, a: 255 }, bg: { r: 24, g: 16, b: 4, a: 255 } },
        shot_shuriken: { accent: { r: 190, g: 190, b: 220, a: 255 }, bg: { r: 14, g: 14, b: 22, a: 255 } },
        shot_holy: { accent: { r: 255, g: 250, b: 180, a: 255 }, bg: { r: 26, g: 26, b: 12, a: 255 } }
      };
      return T[id] || { accent: { r: 200, g: 180, b: 60, a: 255 }, bg: { r: 20, g: 20, b: 8, a: 255 } };
    }
    function drawLevelUp() {
      if (!active) return;
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const mouse = ray.GetMousePosition();
      ray.DrawRectangle(0, 0, sw, sh, { r: 4, g: 3, b: 14, a: 220 });
      ray.DrawRectangleLines(Math.round(sw * 0.025), Math.round(sh * 0.025), Math.round(sw * 0.95), Math.round(sh * 0.95), { r: 90, g: 55, b: 165, a: 140 });
      ray.DrawRectangleLines(Math.round(sw * 0.04), Math.round(sh * 0.04), Math.round(sw * 0.92), Math.round(sh * 0.92), { r: 60, g: 35, b: 120, a: 70 });
      const titleFs = Math.max(18, Math.round(28 * s));
      const title = `LEVEL  ${player.level}`;
      const tW = ray.MeasureText(title, titleFs);
      const tY = Math.round(sh * 0.07);
      ray.DrawText(title, Math.round(sw / 2 - tW / 2 + 2), tY + 2, titleFs, { r: 50, g: 15, b: 90, a: 180 });
      ray.DrawText(title, Math.round(sw / 2 - tW / 2), tY, titleFs, { r: 255, g: 195, b: 50, a: 255 });
      const subFs = Math.max(10, Math.round(13 * s));
      const subTxt = "CHOOSE YOUR UPGRADE";
      const subW = ray.MeasureText(subTxt, subFs);
      ray.DrawText(
        subTxt,
        Math.round(sw / 2 - subW / 2),
        Math.round(tY + titleFs + Math.round(3 * s)),
        subFs,
        { r: 160, g: 130, b: 220, a: 190 }
      );
      const cardW = Math.round(sw * 0.22);
      const cardH = Math.round(sh * 0.55);
      const gap = Math.round(sw * 0.04);
      const totalW = cardW * 3 + gap * 2;
      const startX = Math.round(sw / 2 - totalW / 2);
      const cardY = Math.round(sh * 0.22);
      for (let i = 0; i < 3; i++) {
        const cx = startX + i * (cardW + gap);
        cardBtns[i].x = cx;
        cardBtns[i].y = cardY;
        cardBtns[i].width = cardW;
        cardBtns[i].height = cardH;
        const hovered = ray.CheckCollisionPointRec(mouse, cardBtns[i]);
        const up = cards[i];
        const { accent: ac, bg } = getCardTheme(up.id);
        ray.DrawRectangle(cx, cardY, cardW, cardH, bg);
        const bannerH = Math.round(cardH * 0.42);
        ray.DrawRectangle(
          cx,
          cardY,
          cardW,
          bannerH,
          { r: Math.round(ac.r * 0.18), g: Math.round(ac.g * 0.18), b: Math.round(ac.b * 0.18), a: 255 }
        );
        ray.DrawRectangle(
          cx,
          cardY,
          cardW,
          Math.round(4 * s),
          { r: ac.r, g: ac.g, b: ac.b, a: 210 }
        );
        const iconCx = Math.round(cx + cardW / 2);
        const iconGlowCy = Math.round(cardY + bannerH * 0.5);
        const glowR = Math.round(30 * s);
        ray.DrawCircle(
          iconCx,
          iconGlowCy,
          glowR,
          { r: ac.r, g: ac.g, b: ac.b, a: 35 }
        );
        ray.DrawCircle(
          iconCx,
          iconGlowCy,
          Math.round(glowR * 0.62),
          { r: ac.r, g: ac.g, b: ac.b, a: 55 }
        );
        if (hovered) {
          ray.DrawRectangleLines(
            cx - 3,
            cardY - 3,
            cardW + 6,
            cardH + 6,
            { r: ac.r, g: ac.g, b: ac.b, a: 45 }
          );
          ray.DrawRectangleLines(
            cx - 2,
            cardY - 2,
            cardW + 4,
            cardH + 4,
            { r: ac.r, g: ac.g, b: ac.b, a: 90 }
          );
          ray.DrawRectangleLines(
            cx - 1,
            cardY - 1,
            cardW + 2,
            cardH + 2,
            { r: ac.r, g: ac.g, b: ac.b, a: 160 }
          );
        }
        ray.DrawRectangleLines(
          cx,
          cardY,
          cardW,
          cardH,
          { r: ac.r, g: ac.g, b: ac.b, a: hovered ? 255 : 150 }
        );
        const sepY = cardY + bannerH;
        const sepPad = Math.round(cardW * 0.09);
        ray.DrawRectangle(
          cx + sepPad,
          sepY,
          cardW - sepPad * 2,
          1,
          { r: ac.r, g: ac.g, b: ac.b, a: 100 }
        );
        const iconTopY = cardY + Math.round(bannerH / 2 - 26 * s);
        drawUpgradeIcon(up.id, iconCx, iconTopY, s, ac);
        const cardTitleFs = Math.max(10, Math.round(17 * s));
        const titleX = Math.round(iconCx - ray.MeasureText(up.title, cardTitleFs) / 2);
        const titleY = Math.round(cardY + cardH * 0.47);
        ray.DrawText(
          up.title,
          titleX + 1,
          titleY + 1,
          cardTitleFs,
          { r: 0, g: 0, b: 0, a: 160 }
        );
        ray.DrawText(
          up.title,
          titleX,
          titleY,
          cardTitleFs,
          { r: ac.r, g: ac.g, b: ac.b, a: 255 }
        );
        let descFs = Math.max(7, Math.round(12 * s));
        const lines = up.desc.split("\n");
        const maxDescW = cardW - Math.round(18 * s);
        for (const l of lines) {
          while (descFs > 7 && ray.MeasureText(l, descFs) > maxDescW) descFs--;
        }
        lines.forEach((line, li) => {
          ray.DrawText(
            line,
            Math.round(iconCx - ray.MeasureText(line, descFs) / 2),
            Math.round(cardY + cardH * 0.61 + li * (descFs + 5)),
            descFs,
            { r: 210, g: 205, b: 230, a: 225 }
          );
        });
        if (hovered) {
          const clickFs = Math.max(8, Math.round(11 * s));
          const clickTxt = "[ CHOOSE ]";
          ray.DrawText(
            clickTxt,
            Math.round(iconCx - ray.MeasureText(clickTxt, clickFs) / 2),
            Math.round(cardY + cardH * 0.88),
            clickFs,
            { r: ac.r, g: ac.g, b: ac.b, a: 255 }
          );
        }
      }
    }
    function drawUpgradeIcon(id, cx, topY, s, col) {
      if (id.startsWith("wup_")) {
        const parts = id.split("_");
        id = `shot_${parts[1] || ""}`;
      }
      const sz = Math.round(52 * s);
      const cy = topY + sz / 2;
      if (!col) col = ray.GOLD;
      if (id === "speed") {
        for (let i = 0; i < 3; i++) {
          const ox = (i - 1) * Math.round(10 * s);
          ray.DrawTriangle(
            { x: cx + ox + Math.round(14 * s), y: cy },
            { x: cx + ox, y: cy - Math.round(10 * s) },
            { x: cx + ox, y: cy + Math.round(10 * s) },
            col
          );
        }
      } else if (id === "maxLife") {
        const r = Math.round(10 * s);
        ray.DrawCircle(cx - r / 2, cy - Math.round(4 * s), r, col);
        ray.DrawCircle(cx + r / 2, cy - Math.round(4 * s), r, col);
        ray.DrawTriangle(
          { x: cx - r - Math.round(2 * s), y: cy - Math.round(4 * s) },
          { x: cx + r + Math.round(2 * s), y: cy - Math.round(4 * s) },
          { x: cx, y: cy + Math.round(14 * s) },
          col
        );
      } else if (id === "attackDmg") {
        ray.DrawLineEx(
          { x: cx - Math.round(14 * s), y: cy + Math.round(14 * s) },
          { x: cx + Math.round(14 * s), y: cy - Math.round(14 * s) },
          Math.round(3 * s),
          col
        );
        ray.DrawLineEx(
          { x: cx - Math.round(7 * s), y: cy - Math.round(4 * s) },
          { x: cx + Math.round(2 * s), y: cy - Math.round(13 * s) },
          Math.round(2 * s),
          col
        );
      } else if (id === "attackRadius") {
        ray.DrawCircleLines(cx, cy, Math.round(18 * s), col);
        ray.DrawCircleLines(cx, cy, Math.round(9 * s), col);
        ray.DrawCircle(cx, cy, Math.round(3 * s), col);
      } else if (id === "attackCooldown") {
        ray.DrawCircleLines(cx, cy, Math.round(16 * s), col);
        ray.DrawLineEx({ x: cx, y: cy }, { x: cx, y: cy - Math.round(12 * s) }, Math.round(2 * s), col);
        ray.DrawLineEx({ x: cx, y: cy }, { x: cx + Math.round(8 * s), y: cy + Math.round(5 * s) }, Math.round(2 * s), col);
      } else if (id === "heal") {
        const arm = Math.round(14 * s);
        const thick = Math.round(7 * s);
        ray.DrawRectangle(cx - thick / 2, cy - arm, thick, arm * 2, col);
        ray.DrawRectangle(cx - arm, cy - thick / 2, arm * 2, thick, col);
      } else if (id === "shot_bow") {
        const r2 = Math.round(18 * s);
        ray.DrawCircleLines(cx, cy, r2, col);
        ray.DrawLineEx({ x: cx - Math.round(20 * s), y: cy }, { x: cx + Math.round(20 * s), y: cy }, Math.round(2 * s), col);
        ray.DrawTriangle(
          { x: cx + Math.round(20 * s), y: cy },
          { x: cx + Math.round(12 * s), y: cy - Math.round(6 * s) },
          { x: cx + Math.round(12 * s), y: cy + Math.round(6 * s) },
          col
        );
      } else if (id === "shot_fireball") {
        const r2 = Math.round(14 * s);
        ray.DrawCircle(cx, cy, r2, { r: 255, g: 80, b: 20, a: 255 });
        ray.DrawCircle(cx, cy, Math.round(7 * s), { r: 255, g: 200, b: 50, a: 255 });
        for (let k = 0; k < 5; k++) {
          const ang = k / 5 * Math.PI * 2;
          ray.DrawCircle(
            cx + Math.cos(ang) * r2 | 0,
            cy + Math.sin(ang) * r2 | 0,
            Math.round(4 * s),
            { r: 255, g: 140, b: 0, a: 200 }
          );
        }
      } else if (id === "shot_ice") {
        ray.DrawCircle(cx, cy, Math.round(14 * s), { r: 120, g: 200, b: 255, a: 255 });
        ray.DrawCircleLines(cx, cy, Math.round(14 * s), ray.WHITE);
        for (let k = 0; k < 3; k++) {
          const ang = k * (Math.PI / 3);
          ray.DrawLineEx(
            { x: cx + Math.cos(ang) * Math.round(14 * s) | 0, y: cy + Math.sin(ang) * Math.round(14 * s) | 0 },
            { x: cx - Math.cos(ang) * Math.round(14 * s) | 0, y: cy - Math.sin(ang) * Math.round(14 * s) | 0 },
            Math.round(2 * s),
            ray.WHITE
          );
        }
      } else if (id === "shot_lightning") {
        const pts = [[-8, 14], [0, -6], [8, 14], [0, -2], [-8, 14]].map(([x, y]) => ({ x: cx + Math.round(x * s), y: cy + Math.round(y * s) }));
        for (let k = 0; k < pts.length - 1; k++) {
          ray.DrawLineEx(pts[k], pts[k + 1], Math.round(3 * s), { r: 255, g: 255, b: 80, a: 255 });
        }
      } else if (id === "shot_poison") {
        ray.DrawCircle(cx, cy, Math.round(14 * s), { r: 80, g: 200, b: 60, a: 255 });
        ray.DrawCircle(cx, cy, Math.round(7 * s), { r: 40, g: 120, b: 30, a: 255 });
        for (let k = 0; k < 4; k++) {
          const ang = k * (Math.PI / 2);
          ray.DrawCircle(
            cx + Math.cos(ang) * Math.round(18 * s) | 0,
            cy + Math.sin(ang) * Math.round(18 * s) | 0,
            Math.round(3 * s),
            { r: 60, g: 180, b: 40, a: 255 }
          );
        }
      } else if (id === "shot_boomerang") {
        const r2 = Math.round(16 * s);
        ray.DrawTriangle(
          { x: cx + r2, y: cy },
          { x: cx + Math.cos(2.4) * r2 | 0, y: cy + Math.sin(2.4) * r2 | 0 },
          { x: cx + Math.cos(-2.4) * r2 | 0, y: cy + Math.sin(-2.4) * r2 | 0 },
          { r: 200, g: 160, b: 40, a: 255 }
        );
        ray.DrawCircleLines(cx, cy, Math.round(8 * s), col);
      } else if (id === "shot_shuriken") {
        const r1 = Math.round(19 * s), r2 = Math.round(8 * s);
        for (let k = 0; k < 4; k++) {
          const tip = k * (Math.PI / 2);
          ray.DrawTriangle(
            { x: cx + Math.cos(tip) * r1 | 0, y: cy + Math.sin(tip) * r1 | 0 },
            { x: cx + Math.cos(tip + Math.PI * 0.34) * r2 | 0, y: cy + Math.sin(tip + Math.PI * 0.34) * r2 | 0 },
            { x: cx + Math.cos(tip - Math.PI * 0.34) * r2 | 0, y: cy + Math.sin(tip - Math.PI * 0.34) * r2 | 0 },
            col
          );
        }
        ray.DrawCircle(cx, cy, Math.round(4 * s), { r: 255, g: 255, b: 255, a: 200 });
      } else if (id === "shot_holy") {
        ray.DrawCircle(cx, cy, Math.round(16 * s), { r: 255, g: 250, b: 200, a: 255 });
        ray.DrawCircleLines(cx, cy, Math.round(16 * s), ray.GOLD);
        for (let k = 0; k < 4; k++) {
          const ang = k * (Math.PI / 2);
          ray.DrawCircle(
            cx + Math.cos(ang) * Math.round(16 * s) | 0,
            cy + Math.sin(ang) * Math.round(16 * s) | 0,
            Math.round(4 * s),
            ray.GOLD
          );
        }
      } else if (id === "armor") {
        const h = Math.round(19 * s), w = Math.round(14 * s);
        ray.DrawRectangle(cx - w + 2, cy - h + 2, w * 2, Math.round(h * 1.1), { r: 0, g: 0, b: 0, a: 90 });
        ray.DrawTriangle(
          { x: cx - w + 2, y: cy + 2 },
          { x: cx + w + 2, y: cy + 2 },
          { x: cx + 2, y: cy + h + 2 },
          { r: 0, g: 0, b: 0, a: 90 }
        );
        ray.DrawRectangle(cx - w, cy - h, w * 2, Math.round(h * 1.1), col);
        ray.DrawTriangle(
          { x: cx - w, y: cy },
          { x: cx + w, y: cy },
          { x: cx, y: cy + h },
          col
        );
        ray.DrawLineEx(
          { x: cx, y: cy - h + Math.round(3 * s) },
          { x: cx, y: cy + Math.round(h * 0.55) },
          Math.round(1.5 * s),
          { r: 255, g: 255, b: 255, a: 55 }
        );
      } else if (id === "regen") {
        const arm = Math.round(15 * s), thick = Math.round(5 * s);
        ray.DrawCircleLines(cx, cy, Math.round(20 * s), { r: 80, g: 220, b: 80, a: 180 });
        ray.DrawRectangle(cx - Math.round(thick / 2), cy - arm, thick, arm * 2, { r: 80, g: 220, b: 80, a: 255 });
        ray.DrawRectangle(cx - arm, cy - Math.round(thick / 2), arm * 2, thick, { r: 80, g: 220, b: 80, a: 255 });
      } else if (id === "fortune") {
        ray.DrawCircle(cx, cy, Math.round(16 * s), { r: 255, g: 215, b: 0, a: 255 });
        ray.DrawCircle(cx, cy, Math.round(11 * s), { r: 200, g: 160, b: 0, a: 255 });
        for (let k = 0; k < 4; k++) {
          const ang = k * (Math.PI / 2) - Math.PI / 4;
          ray.DrawTriangle(
            { x: cx + Math.cos(ang - 0.3) * Math.round(9 * s) | 0, y: cy + Math.sin(ang - 0.3) * Math.round(9 * s) | 0 },
            { x: cx + Math.cos(ang + 0.3) * Math.round(9 * s) | 0, y: cy + Math.sin(ang + 0.3) * Math.round(9 * s) | 0 },
            { x: cx + Math.cos(ang) * Math.round(20 * s) | 0, y: cy + Math.sin(ang) * Math.round(20 * s) | 0 },
            { r: 255, g: 240, b: 80, a: 255 }
          );
        }
      } else if (id === "lifesteal") {
        ray.DrawCircle(cx, cy - Math.round(6 * s), Math.round(12 * s), { r: 170, g: 20, b: 20, a: 255 });
        ray.DrawTriangle(
          { x: cx - Math.round(9 * s), y: cy + Math.round(3 * s) },
          { x: cx - Math.round(2 * s), y: cy + Math.round(3 * s) },
          { x: cx - Math.round(5 * s), y: cy + Math.round(18 * s) },
          { r: 245, g: 235, b: 235, a: 255 }
        );
        ray.DrawTriangle(
          { x: cx + Math.round(2 * s), y: cy + Math.round(3 * s) },
          { x: cx + Math.round(9 * s), y: cy + Math.round(3 * s) },
          { x: cx + Math.round(5 * s), y: cy + Math.round(18 * s) },
          { r: 245, g: 235, b: 235, a: 255 }
        );
      } else if (id === "shot_speed") {
        const arr = Math.round(14 * s);
        ray.DrawLineEx({ x: cx - Math.round(18 * s), y: cy }, { x: cx + arr - Math.round(4 * s), y: cy }, Math.round(3 * s), col);
        ray.DrawTriangle(
          { x: cx + arr, y: cy },
          { x: cx + arr - Math.round(8 * s), y: cy - Math.round(7 * s) },
          { x: cx + arr - Math.round(8 * s), y: cy + Math.round(7 * s) },
          col
        );
        for (let k = -2; k <= 2; k++) {
          const oy = k * Math.round(5 * s);
          const len = Math.round((3 - Math.abs(k)) * 5 * s);
          ray.DrawLineEx({ x: cx - Math.round(18 * s), y: cy + oy }, { x: cx - Math.round(18 * s) + len, y: cy + oy }, 1, { r: 255, g: 230, b: 80, a: 140 });
        }
      } else if (id === "shot_damage") {
        for (let k = 0; k < 8; k++) {
          const ang = k * (Math.PI / 4);
          ray.DrawLineEx(
            { x: cx + Math.cos(ang) * Math.round(5 * s) | 0, y: cy + Math.sin(ang) * Math.round(5 * s) | 0 },
            { x: cx + Math.cos(ang) * Math.round(20 * s) | 0, y: cy + Math.sin(ang) * Math.round(20 * s) | 0 },
            Math.round(2 * s),
            { r: 255, g: 120, b: 30, a: 255 }
          );
        }
        ray.DrawCircle(cx, cy, Math.round(6 * s), { r: 255, g: 220, b: 60, a: 255 });
      } else if (id === "big_shots") {
        for (let k = 1; k <= 3; k++) {
          const r2 = Math.round(k * 7 * s);
          ray.DrawRectangleLinesEx(
            { x: cx - r2, y: cy - r2, width: r2 * 2, height: r2 * 2 },
            1,
            { r: 200, g: 180, b: 80, a: Math.round(255 - k * 55) }
          );
        }
        ray.DrawRectangle(cx - Math.round(3 * s), cy - Math.round(3 * s), Math.round(6 * s), Math.round(6 * s), col);
      } else if (id === "long_shots") {
        const arr2 = Math.round(22 * s);
        ray.DrawLineEx({ x: cx - arr2, y: cy - Math.round(5 * s) }, { x: cx + arr2 - Math.round(7 * s), y: cy - Math.round(5 * s) }, Math.round(2 * s), col);
        ray.DrawTriangle(
          { x: cx + arr2, y: cy - Math.round(5 * s) },
          { x: cx + arr2 - Math.round(8 * s), y: cy - Math.round(5 * s) - Math.round(5 * s) },
          { x: cx + arr2 - Math.round(8 * s), y: cy - Math.round(5 * s) + Math.round(5 * s) },
          col
        );
        ray.DrawLineEx({ x: cx - Math.round(16 * s), y: cy + Math.round(7 * s) }, { x: cx + Math.round(16 * s) - Math.round(7 * s), y: cy + Math.round(7 * s) }, Math.round(2 * s), { r: 180, g: 150, b: 50, a: 180 });
        ray.DrawTriangle(
          { x: cx + Math.round(16 * s), y: cy + Math.round(7 * s) },
          { x: cx + Math.round(16 * s) - Math.round(6 * s), y: cy + Math.round(7 * s) - Math.round(4 * s) },
          { x: cx + Math.round(16 * s) - Math.round(6 * s), y: cy + Math.round(7 * s) + Math.round(4 * s) },
          { r: 180, g: 150, b: 50, a: 180 }
        );
      } else if (id === "berserker") {
        const ax = Math.round(16 * s);
        ray.DrawLineEx({ x: cx - ax, y: cy + ax }, { x: cx + ax, y: cy - ax }, Math.round(4 * s), { r: 255, g: 60, b: 40, a: 255 });
        ray.DrawLineEx({ x: cx - ax, y: cy - ax }, { x: cx + ax, y: cy + ax }, Math.round(4 * s), { r: 255, g: 60, b: 40, a: 255 });
        ray.DrawCircle(cx, cy, Math.round(6 * s), { r: 255, g: 80, b: 30, a: 255 });
      }
    }
    module.exports = { openLevelUp, isLevelUpActive, itsLevelUp, drawLevelUp, drawUpgradeIcon, UPGRADE_POOL, getCardTheme };
  }
});

// gameplay/wave.js
var require_wave = __commonJS({
  "gameplay/wave.js"(exports, module) {
    var { enemies, spawnAtPosition, setHpMultiplier, setDamageMultiplier } = require_enemy();
    var { OFFSET_X, OFFSET_Y, MAP_COLS, MAP_ROWS, T } = require_map();
    var WAVE_WAIT_FRAMES = 200;
    var SPAWN_DIST_MIN = 250;
    var SPAWN_DIST_MAX = 330;
    var SPAWN_INTERVAL_MIN = 80;
    var SPAWN_INTERVAL_MAX = 130;
    var SPAWN_ENEMY_SEP = 38;
    var waveNumber = 0;
    var waveState = "INIT";
    var waveTimer = 0;
    var hpMultiplier = 1;
    var damageMultiplier = 1;
    var spawnQueue = [];
    var spawnTimer = 0;
    function waveComposition(wave) {
      const w = wave;
      return {
        rat: Math.max(2, 7 - w),
        bat: w > 2 ? Math.min(w - 1, 3) : 0,
        slime: w > 1 ? Math.min(w, 4) : 0,
        skeleton: w > 2 ? Math.min(w - 1, 4) : 0,
        boneSkeleton: w > 6 ? Math.min(w - 5, 3) : 0,
        fish: w > 3 ? Math.min(w - 2, 3) : 0,
        wraith: w > 4 ? Math.min(w - 3, 2) : 0,
        golem: w > 5 ? Math.min(w - 4, 1) : 0
      };
    }
    function spawnWave(waveNum, px, py) {
      enemies.length = 0;
      spawnQueue.length = 0;
      spawnTimer = 60;
      const scalingRounds = Math.max(0, waveNum - 5);
      hpMultiplier = parseFloat((1 + scalingRounds * 0.06).toFixed(4));
      damageMultiplier = parseFloat((1 + scalingRounds * 0.015).toFixed(4));
      setHpMultiplier(hpMultiplier);
      setDamageMultiplier(damageMultiplier);
      const comp = waveComposition(waveNum);
      const allTypes = [];
      for (const [type, count] of Object.entries(comp)) {
        for (let i = 0; i < count; i++) allTypes.push(type);
      }
      for (let i = allTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allTypes[i], allTypes[j]] = [allTypes[j], allTypes[i]];
      }
      for (const t of allTypes) spawnQueue.push(t);
    }
    function isWaveComplete() {
      return enemies.length === 0 && spawnQueue.length === 0;
    }
    function tickSpawnQueue(px, py) {
      if (spawnQueue.length === 0) return;
      if (--spawnTimer > 0) return;
      const minX = OFFSET_X, maxX = OFFSET_X + MAP_COLS * T;
      const minY = OFFSET_Y, maxY = OFFSET_Y + MAP_ROWS * T;
      const type = spawnQueue.shift();
      let bestX = 0, bestY = 0, bestMinD = -1;
      for (let attempt = 0; attempt < 10; attempt++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = SPAWN_DIST_MIN + Math.random() * (SPAWN_DIST_MAX - SPAWN_DIST_MIN);
        const cx = Math.max(minX + 8, Math.min(maxX - 8, px + Math.cos(angle) * dist));
        const cy = Math.max(minY + 8, Math.min(maxY - 8, py + Math.sin(angle) * dist));
        let minD = Infinity;
        for (const e of enemies) {
          const ex = e.x - cx, ey = e.y - cy;
          const d = Math.sqrt(ex * ex + ey * ey);
          if (d < minD) minD = d;
        }
        if (enemies.length === 0) minD = Infinity;
        if (minD > bestMinD) {
          bestMinD = minD;
          bestX = cx;
          bestY = cy;
        }
        if (minD >= SPAWN_ENEMY_SEP * 2) break;
      }
      spawnAtPosition(type, bestX, bestY);
      spawnTimer = SPAWN_INTERVAL_MIN + Math.floor(Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN));
    }
    function tickWave(player) {
      if (waveState === "INIT") {
        enemies.length = 0;
        waveNumber = 0;
        waveState = "WAITING";
        waveTimer = 120;
      }
      if (waveState === "WAITING") {
        waveTimer--;
        if (waveTimer <= 0) {
          waveNumber++;
          spawnWave(waveNumber, player.x, player.y);
          waveState = "ACTIVE";
        }
      }
      if (waveState === "ACTIVE" && isWaveComplete()) {
        waveState = "WAITING";
        waveTimer = WAVE_WAIT_FRAMES;
      }
      tickSpawnQueue(player.x, player.y);
    }
    function resetWave() {
      waveNumber = 0;
      waveState = "INIT";
      waveTimer = 0;
      hpMultiplier = 1;
      damageMultiplier = 1;
      spawnQueue.length = 0;
      spawnTimer = 0;
      setHpMultiplier(1);
      setDamageMultiplier(1);
    }
    function setWaveNumber(val) {
      waveNumber = Math.max(0, Math.floor(val || 0));
      if (waveNumber > 0) {
        waveState = "WAITING";
        waveTimer = WAVE_WAIT_FRAMES;
      }
    }
    function getWaveNumber() {
      return waveNumber;
    }
    function getHpMultiplier() {
      return hpMultiplier;
    }
    function getWaveState() {
      return waveState;
    }
    function getWaveTimer() {
      return waveTimer;
    }
    module.exports = { tickWave, resetWave, setWaveNumber, getWaveNumber, getHpMultiplier, getWaveState, getWaveTimer };
  }
});

// gameplay/playing.js
var require_playing = __commonJS({
  "gameplay/playing.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var player = require_player();
    var { enemies, projectiles, updateEnemies, drawEnemies, drawProjectiles, drawParticles, hurtEnemy } = require_enemy();
    var { getScale } = require_state();
    var { STATUS, currentStatus } = require_state();
    var { deleteSlot, activeSlot } = require_save();
    var { drawWorld } = require_map();
    var { openLevelUp, isLevelUpActive, itsLevelUp, drawLevelUp } = require_levelup();
    var { updateShots, drawShots, resetShots, SHOT_DEFS } = require_shots();
    var { addFloater, updateFloaters, drawFloaters, resetFloaters } = require_floaters();
    var { devState, drawDevFPS } = require_devMode();
    var { tickWave, resetWave, setWaveNumber, getWaveNumber, getWaveState, getWaveTimer } = require_wave();
    var camera = {
      offset: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      rotation: 0,
      zoom: 1
    };
    var CAMERA_SMOOTH = 0.18;
    function followCameraSmooth(px, py) {
      camera.target.x += (px - camera.target.x) * CAMERA_SMOOTH;
      camera.target.y += (py - camera.target.y) * CAMERA_SMOOTH;
    }
    var attackTimer = 0;
    var attackCooldown = 0;
    var frameCount = 0;
    var killCount = 0;
    var deathStats = null;
    function resetPlaying() {
      resetWave();
      attackTimer = 0;
      attackCooldown = 0;
      frameCount = 0;
      killCount = 0;
      deathStats = null;
      enemies.length = 0;
      projectiles.length = 0;
      resetShots();
      resetFloaters();
      camera.target.x = player.x;
      camera.target.y = player.y;
    }
    function drawPlaying() {
      frameCount++;
      const s = getScale();
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      if (isLevelUpActive()) {
        camera.offset.x = sw / 2;
        camera.offset.y = sh / 2;
        followCameraSmooth(player.x, player.y);
        camera.zoom = 2 * s;
        ray.BeginMode2D(camera);
        drawWorld(frameCount, camera, sw, sh);
        drawShots();
        drawEnemies();
        drawProjectiles();
        drawParticles();
        player.playerDraw();
        if (devState.enabled) {
          updateFloaters();
          drawFloaters();
        }
        ray.EndMode2D();
        drawHUD(s, sw, sh);
        itsLevelUp();
        drawLevelUp();
        return;
      }
      tickWave(player);
      if (player.life <= 0) {
        if (!deathStats) {
          deathStats = { kills: killCount, level: player.level, wave: getWaveNumber() };
          resetFloaters();
        }
        drawDeathScreen(s, sw, sh);
        return;
      }
      player.playerWalk();
      if (player.regenRate > 0 && player.life < player.maxLife) {
        player.regenTick = (player.regenTick || 0) + 1;
        if (player.regenTick >= 300) {
          player.regenTick = 0;
          player.life = Math.min(player.maxLife, player.life + player.regenRate);
        }
      }
      updateEnemies(player);
      updateShots(player, (xp) => {
        killCount++;
        if (player.lifestealThreshold > 0) {
          player.lifestealKills++;
          if (player.lifestealKills >= player.lifestealThreshold) {
            player.lifestealKills = 0;
            player.life = Math.min(player.maxLife, player.life + 1);
          }
        }
        if (player.gainXp(xp)) openLevelUp();
      });
      if (attackCooldown > 0) attackCooldown -= player.wetTimer > 0 ? 0.5 : 1;
      if (attackTimer > 0) attackTimer--;
      if (devState.enabled && ray.IsKeyPressed(ray.KEY_N)) {
        openLevelUp();
      }
      if (ray.IsKeyPressed(ray.KEY_SPACE) && attackCooldown <= 0) {
        attackTimer = player.attackCooldownMax * 0.27 | 0;
        attackCooldown = player.attackCooldownMax;
        if (devState.enabled) {
          for (const e of [...enemies]) {
            addFloater(e.x, e.y - e.radius - 2, "DEV", { r: 255, g: 80, b: 80 });
            const xpGained = hurtEnemy(e, 999999);
            if (xpGained > 0) {
              killCount++;
              if (player.gainXp(xpGained)) openLevelUp();
            }
          }
        } else {
          for (const e of [...enemies]) {
            const dx = e.x - player.x;
            const dy = e.y - player.y;
            if (Math.sqrt(dx * dx + dy * dy) < player.attackRadius + e.radius) {
              const xpGained = hurtEnemy(e, player.attackDamage);
              if (xpGained > 0) {
                killCount++;
                if (player.lifestealThreshold > 0) {
                  player.lifestealKills++;
                  if (player.lifestealKills >= player.lifestealThreshold) {
                    player.lifestealKills = 0;
                    player.life = Math.min(player.maxLife, player.life + 1);
                  }
                }
                if (player.gainXp(xpGained)) openLevelUp();
              }
            }
          }
        }
      }
      camera.offset.x = sw / 2;
      camera.offset.y = sh / 2;
      followCameraSmooth(player.x, player.y);
      camera.zoom = 2 * s;
      ray.BeginMode2D(camera);
      drawWorld(frameCount, camera, sw, sh);
      if (attackTimer > 0) {
        const maxT = player.attackCooldownMax * 0.27 | 0;
        const alpha = Math.round(255 * attackTimer / Math.max(1, maxT));
        const ar = player.attackRadius;
        ray.DrawRectangleLinesEx(
          { x: player.x - ar, y: player.y - ar, width: ar * 2, height: ar * 2 },
          1,
          { r: 255, g: 220, b: 50, a: alpha }
        );
      }
      drawShots();
      drawEnemies();
      drawProjectiles();
      drawParticles();
      player.playerDraw();
      if (devState.enabled) {
        updateFloaters();
        drawFloaters();
      }
      ray.EndMode2D();
      if (player.hurtFlash > 0) {
        const hf = player.hurtFlash;
        const va = Math.round(120 * hf / 18);
        const ew = Math.round(sw * 0.2);
        const eh = Math.round(sh * 0.22);
        ray.DrawRectangle(0, 0, sw, eh, { r: 210, g: 18, b: 18, a: Math.round(va * 0.8) });
        ray.DrawRectangle(0, sh - eh, sw, eh, { r: 210, g: 18, b: 18, a: Math.round(va * 0.8) });
        ray.DrawRectangle(0, 0, ew, sh, { r: 210, g: 18, b: 18, a: Math.round(va * 0.6) });
        ray.DrawRectangle(sw - ew, 0, ew, sh, { r: 210, g: 18, b: 18, a: Math.round(va * 0.6) });
      }
      drawHUD(s, sw, sh);
    }
    function drawDeathScreen(s, sw, sh) {
      camera.offset.x = sw / 2;
      camera.offset.y = sh / 2;
      followCameraSmooth(player.x, player.y);
      camera.zoom = 2 * s;
      ray.BeginMode2D(camera);
      drawWorld(frameCount, camera, sw, sh);
      drawShots();
      drawEnemies();
      drawProjectiles();
      ray.EndMode2D();
      ray.DrawRectangle(0, 0, sw, sh, { r: 0, g: 0, b: 0, a: 195 });
      ray.DrawRectangle(0, 0, sw, sh, { r: 90, g: 0, b: 0, a: 45 });
      const ew = Math.round(sw * 0.22);
      const eh = Math.round(sh * 0.22);
      ray.DrawRectangle(0, 0, ew, sh, { r: 0, g: 0, b: 0, a: 90 });
      ray.DrawRectangle(sw - ew, 0, ew, sh, { r: 0, g: 0, b: 0, a: 90 });
      ray.DrawRectangle(0, 0, sw, eh, { r: 0, g: 0, b: 0, a: 90 });
      ray.DrawRectangle(0, sh - eh, sw, eh, { r: 0, g: 0, b: 0, a: 90 });
      const cx = Math.round(sw / 2);
      const cy = Math.round(sh / 2);
      const panW = Math.round(340 * s);
      const panH = Math.round(290 * s);
      const panX = cx - Math.round(panW / 2);
      const panY = cy - Math.round(panH / 2) - Math.round(18 * s);
      ray.DrawRectangle(panX - Math.round(7 * s), panY - Math.round(7 * s), panW + Math.round(14 * s), panH + Math.round(14 * s), { r: 130, g: 8, b: 8, a: 55 });
      ray.DrawRectangle(panX - Math.round(3 * s), panY - Math.round(3 * s), panW + Math.round(6 * s), panH + Math.round(6 * s), { r: 80, g: 5, b: 5, a: 90 });
      ray.DrawRectangle(panX, panY, panW, panH, { r: 8, g: 2, b: 2, a: 240 });
      ray.DrawRectangle(panX, panY, panW, Math.round(panH * 0.32), { r: 28, g: 6, b: 6, a: 90 });
      ray.DrawRectangleLines(panX - Math.round(2 * s), panY - Math.round(2 * s), panW + Math.round(4 * s), panH + Math.round(4 * s), { r: 70, g: 6, b: 6, a: 160 });
      ray.DrawRectangleLines(panX, panY, panW, panH, { r: 195, g: 38, b: 38, a: 255 });
      ray.DrawRectangleLines(panX + Math.round(2 * s), panY + Math.round(2 * s), panW - Math.round(4 * s), panH - Math.round(4 * s), { r: 100, g: 18, b: 18, a: 110 });
      const cSz = Math.round(6 * s);
      for (const [cx2, cy2] of [
        [panX, panY],
        [panX + panW - cSz, panY],
        [panX, panY + panH - cSz],
        [panX + panW - cSz, panY + panH - cSz]
      ]) {
        ray.DrawRectangle(cx2, cy2, cSz, cSz, { r: 220, g: 55, b: 55, a: 255 });
      }
      const titleFs = Math.max(34, Math.round(64 * s));
      const died = "YOU DIED";
      const diedW = ray.MeasureText(died, titleFs);
      const titleX = cx - Math.round(diedW / 2);
      const titleY = panY + Math.round(18 * s);
      ray.DrawText(died, titleX + Math.round(3 * s), titleY + Math.round(4 * s), titleFs, { r: 0, g: 0, b: 0, a: 200 });
      ray.DrawText(died, titleX - 1, titleY - 1, titleFs, { r: 255, g: 80, b: 30, a: 50 });
      ray.DrawText(died, titleX + 1, titleY + 1, titleFs, { r: 255, g: 30, b: 30, a: 50 });
      ray.DrawText(died, titleX, titleY, titleFs, { r: 225, g: 38, b: 38, a: 255 });
      ray.DrawText(died, titleX, titleY, titleFs, { r: 255, g: 160, b: 160, a: 30 });
      const sep1Y = titleY + titleFs + Math.round(12 * s);
      const sepPad = Math.round(22 * s);
      ray.DrawRectangle(panX + sepPad, sep1Y, panW - sepPad * 2, 1, { r: 180, g: 35, b: 35, a: 200 });
      ray.DrawRectangle(panX + sepPad, sep1Y + Math.round(3 * s), panW - sepPad * 2, 1, { r: 70, g: 12, b: 12, a: 130 });
      const diaS = Math.round(6 * s);
      ray.DrawRectanglePro({ x: cx, y: sep1Y + 1, width: diaS, height: diaS }, { x: diaS * 0.5, y: diaS * 0.5 }, 45, { r: 210, g: 50, b: 50, a: 255 });
      ray.DrawRectanglePro({ x: cx, y: sep1Y + 1, width: diaS - 2, height: diaS - 2 }, { x: (diaS - 2) * 0.5, y: (diaS - 2) * 0.5 }, 45, { r: 255, g: 120, b: 120, a: 120 });
      const valFs = Math.max(14, Math.round(22 * s));
      const lblFs = Math.max(10, Math.round(14 * s));
      const rowH = valFs + Math.round(12 * s);
      const statsY = sep1Y + Math.round(18 * s);
      const colPad = Math.round(26 * s);
      const statRows = [
        { label: "ENEMIES KILLED", value: String(deathStats.kills) },
        { label: "LEVEL REACHED", value: String(deathStats.level) },
        { label: "WAVE SURVIVED", value: String(deathStats.wave) }
      ];
      for (let i = 0; i < statRows.length; i++) {
        const ry = statsY + i * rowH;
        const { label, value } = statRows[i];
        if (i % 2 === 0) {
          ray.DrawRectangle(panX + Math.round(8 * s), ry - Math.round(4 * s), panW - Math.round(16 * s), rowH - Math.round(2 * s), { r: 255, g: 255, b: 255, a: 7 });
        }
        ray.DrawText(label, panX + colPad, ry + Math.round((valFs - lblFs) * 0.5), lblFs, { r: 155, g: 115, b: 115, a: 220 });
        const vw = ray.MeasureText(value, valFs);
        ray.DrawText(value, panX + panW - colPad - vw, ry, valFs, { r: 255, g: 195, b: 195, a: 255 });
        const lblW = ray.MeasureText(label, lblFs);
        const dotX1 = panX + colPad + lblW + Math.round(7 * s);
        const dotX2 = panX + panW - colPad - vw - Math.round(7 * s);
        if (dotX2 > dotX1 + Math.round(8 * s)) {
          ray.DrawRectangle(dotX1, ry + Math.round(lblFs * 0.55), dotX2 - dotX1, 1, { r: 110, g: 40, b: 40, a: 110 });
        }
      }
      const sep2Y = statsY + statRows.length * rowH + Math.round(8 * s);
      ray.DrawRectangle(panX + sepPad, sep2Y, panW - sepPad * 2, 1, { r: 160, g: 30, b: 30, a: 160 });
      const hintFs = Math.max(9, Math.round(13 * s));
      const hint = "ENTER  or  click  to  continue";
      const hintW = ray.MeasureText(hint, hintFs);
      ray.DrawText(hint, cx - Math.round(hintW / 2), sep2Y + Math.round(9 * s), hintFs, { r: 115, g: 72, b: 72, a: 185 });
      const btnFs = Math.max(12, Math.round(18 * s));
      const btnTxt = "BACK TO MENU";
      const btnW = Math.round(210 * s);
      const btnH = Math.round(38 * s);
      const btnX = cx - Math.round(btnW / 2);
      const btnY = sep2Y + hintFs + Math.round(20 * s);
      const mouse = ray.GetMousePosition();
      const hover = ray.CheckCollisionPointRec(mouse, { x: btnX, y: btnY, width: btnW, height: btnH });
      ray.DrawRectangle(btnX + Math.round(3 * s), btnY + Math.round(3 * s), btnW, btnH, { r: 0, g: 0, b: 0, a: 130 });
      ray.DrawRectangle(btnX, btnY, btnW, btnH, hover ? { r: 195, g: 32, b: 32, a: 255 } : { r: 115, g: 16, b: 16, a: 255 });
      ray.DrawRectangle(btnX + Math.round(2 * s), btnY + Math.round(2 * s), btnW - Math.round(4 * s), Math.round(btnH * 0.38), { r: 255, g: 255, b: 255, a: hover ? 22 : 12 });
      ray.DrawRectangleLines(btnX, btnY, btnW, btnH, { r: 215, g: 58, b: 58, a: 255 });
      ray.DrawRectangleLines(btnX + 1, btnY + 1, btnW - 2, btnH - 2, { r: 255, g: 110, b: 110, a: 55 });
      const btnTxtW = ray.MeasureText(btnTxt, btnFs);
      ray.DrawText(btnTxt, cx - Math.round(btnTxtW / 2) + (hover ? 0 : 0), btnY + Math.round((btnH - btnFs) / 2), btnFs, { r: 255, g: 220, b: 220, a: 255 });
      if (hover && ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT) || ray.IsKeyPressed(ray.KEY_ENTER)) {
        if (activeSlot.index !== -1) deleteSlot(activeSlot.index);
        activeSlot.index = -1;
        player.reset();
        resetPlaying();
        currentStatus.current = STATUS.MENU;
      }
    }
    function drawHUD(s, sw, sh) {
      drawDevFPS();
      const hudFs = Math.max(10, Math.round(18 * s));
      const smallFs = Math.max(8, Math.round(13 * s));
      const waveFs = Math.max(14, Math.round(26 * s));
      const barX = Math.round(10 * s);
      const hpY = Math.round(10 * s);
      const barW = Math.round(140 * s);
      const barH = Math.round(9 * s);
      const hpPct = Math.max(0, player.life / player.maxLife);
      const hpCol = hpPct > 0.6 ? { r: 50, g: 210, b: 80, a: 255 } : hpPct > 0.3 ? { r: 240, g: 195, b: 40, a: 255 } : { r: 220, g: 50, b: 50, a: 255 };
      ray.DrawRectangle(barX - Math.round(3 * s), hpY - Math.round(3 * s), barW + Math.round(65 * s), barH + hudFs + Math.round(14 * s), { r: 0, g: 0, b: 0, a: 110 });
      ray.DrawText(`HP  ${player.life} / ${player.maxLife}`, barX, hpY, hudFs, { r: 235, g: 225, b: 255, a: 255 });
      const hpBarY = hpY + hudFs + Math.round(3 * s);
      ray.DrawRectangle(barX, hpBarY, barW, barH, { r: 35, g: 10, b: 10, a: 210 });
      ray.DrawRectangle(barX, hpBarY, Math.round(barW * hpPct), barH, hpCol);
      if (Math.round(barW * hpPct) > 0) ray.DrawRectangle(barX, hpBarY, Math.round(barW * hpPct), Math.round(barH * 0.35), { r: 255, g: 255, b: 255, a: 55 });
      ray.DrawRectangleLines(barX, hpBarY, barW, barH, { r: 70, g: 65, b: 90, a: 200 });
      const lvlFs = Math.max(10, Math.round(16 * s));
      const xpW = Math.round(160 * s);
      const xpH = Math.round(9 * s);
      const xpX = Math.round(10 * s);
      const xpY = sh - Math.round(42 * s);
      const xpFill = Math.round(xpW * player.xp / player.xpNext);
      ray.DrawRectangle(xpX - Math.round(3 * s), xpY - lvlFs - Math.round(5 * s), xpW + Math.round(90 * s), xpH + lvlFs + Math.round(12 * s), { r: 0, g: 0, b: 0, a: 110 });
      ray.DrawText(`Lv ${player.level}`, xpX, xpY - lvlFs - Math.round(2 * s), lvlFs, { r: 255, g: 195, b: 50, a: 255 });
      ray.DrawRectangle(xpX, xpY, xpW, xpH, { r: 20, g: 14, b: 4, a: 210 });
      ray.DrawRectangle(xpX, xpY, xpFill, xpH, { r: 255, g: 185, b: 35, a: 255 });
      if (xpFill > 0) ray.DrawRectangle(xpX, xpY, xpFill, Math.round(xpH * 0.35), { r: 255, g: 235, b: 130, a: 80 });
      ray.DrawRectangleLines(xpX, xpY, xpW, xpH, { r: 100, g: 75, b: 20, a: 200 });
      ray.DrawText(`${player.xp} / ${player.xpNext} XP`, xpX + xpW + Math.round(6 * s), xpY, smallFs, { r: 175, g: 150, b: 70, a: 200 });
      const waveLabel = getWaveNumber() > 0 ? `WAVE  ${getWaveNumber()}` : `WAVE  -`;
      const wlW = ray.MeasureText(waveLabel, waveFs);
      const wlX = Math.round(sw / 2 - wlW / 2);
      const wlY = Math.round(10 * s);
      const wbP = Math.round(10 * s);
      ray.DrawRectangle(wlX - wbP, wlY - Math.round(4 * s), wlW + wbP * 2, waveFs + Math.round(8 * s), { r: 0, g: 0, b: 0, a: 130 });
      ray.DrawRectangleLines(wlX - wbP, wlY - Math.round(4 * s), wlW + wbP * 2, waveFs + Math.round(8 * s), { r: 130, g: 78, b: 30, a: 175 });
      ray.DrawText(waveLabel, wlX, wlY, waveFs, { r: 225, g: 155, b: 60, a: 255 });
      if (getWaveState() === "WAITING") {
        const sec = Math.ceil(getWaveTimer() / 60);
        const next = getWaveNumber() + 1;
        const msg = `Wave ${next} in ${sec}s...`;
        const msgFs = Math.max(9, Math.round(15 * s));
        ray.DrawText(
          msg,
          Math.round(sw / 2 - ray.MeasureText(msg, msgFs) / 2),
          wlY + waveFs + Math.round(6 * s),
          msgFs,
          { r: 205, g: 100, b: 100, a: 225 }
        );
      }
      const slotFs = Math.max(8, Math.round(12 * s));
      const dotR = Math.round(5 * s);
      const slotY = sh - Math.round(30 * s);
      if (player.shotTypes.length === 0) {
        const emptyTxt = "SHOTS: none";
        ray.DrawRectangle(sw - Math.round(ray.MeasureText(emptyTxt, slotFs) + 16 * s), slotY - Math.round(3 * s), Math.round(ray.MeasureText(emptyTxt, slotFs) + 12 * s), slotFs + Math.round(6 * s), { r: 0, g: 0, b: 0, a: 100 });
        ray.DrawText(emptyTxt, sw - Math.round(ray.MeasureText(emptyTxt, slotFs) + 10 * s), slotY, slotFs, { r: 100, g: 90, b: 135, a: 180 });
      } else {
        const slotLabel = "SHOTS:";
        ray.DrawText(
          slotLabel,
          sw - Math.round(ray.MeasureText(slotLabel, slotFs) + player.shotTypes.length * (dotR * 2 + Math.round(64 * s)) + 10 * s),
          slotY - Math.round(16 * s),
          slotFs,
          { r: 130, g: 120, b: 175, a: 200 }
        );
        for (let i = 0; i < player.shotTypes.length; i++) {
          const type = player.shotTypes[i];
          const def = SHOT_DEFS[type];
          const slotX = sw - Math.round((player.shotTypes.length - i) * (dotR * 2 + Math.round(64 * s)) + 10 * s);
          ray.DrawRectangle(slotX - Math.round(2 * s), slotY - Math.round(2 * s), dotR * 2 + Math.round(68 * s), dotR * 2 + Math.round(4 * s), { r: 0, g: 0, b: 0, a: 120 });
          const ic = def.color;
          const ix = slotX;
          const iy = slotY + dotR;
          const iz = dotR;
          drawWeaponHudIcon(type, ix, iy, iz, ic, frameCount);
          ray.DrawText(def.title, slotX + dotR * 2 + Math.round(4 * s), slotY, slotFs, { r: 220, g: 215, b: 245, a: 255 });
        }
      }
    }
    function drawWeaponHudIcon(type, cx, cy, z, ic, tick) {
      const t = tick % 360;
      if (type === "bow") {
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 1.6, height: z * 0.35 },
          { x: z * 0.8, y: z * 0.18 },
          0,
          { r: ic.r, g: ic.g, b: ic.b, a: 255 }
        );
        ray.DrawLineEx(
          { x: cx, y: cy - z * 0.8 },
          { x: cx, y: cy + z * 0.8 },
          0.8 * z / 5,
          { r: 220, g: 200, b: 150, a: 210 }
        );
        ray.DrawLineEx(
          { x: cx - z * 0.3, y: cy },
          { x: cx + z * 1.1, y: cy },
          0.8 * z / 5,
          { r: 200, g: 160, b: 80, a: 255 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 1.1, y: cy, width: z * 0.5, height: z * 0.5 },
          { x: z * 0.25, y: z * 0.25 },
          45,
          { r: 220, g: 180, b: 80, a: 255 }
        );
      } else if (type === "fireball") {
        const fp = Math.round(80 + Math.abs(Math.sin(t * 0.08)) * 80);
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 1.6, height: z * 1.6 },
          { x: z * 0.8, y: z * 0.8 },
          t * 2,
          { r: 255, g: 120, b: 20, a: fp }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z, height: z },
          { x: z * 0.5, y: z * 0.5 },
          t * 4,
          { r: 255, g: 200, b: 80, a: 255 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5 + Math.cos(t * 0.15) * z * 0.8, y: cy + Math.sin(t * 0.15) * z * 0.8, width: z * 0.3, height: z * 0.3 },
          { x: z * 0.15, y: z * 0.15 },
          0,
          { r: 255, g: 60, b: 20, a: 200 }
        );
      } else if (type === "ice") {
        const isz = z * 0.9;
        ray.DrawLineEx({ x: cx + z * 0.5 - isz, y: cy }, { x: cx + z * 0.5 + isz, y: cy }, z * 0.3, { r: ic.r, g: ic.g, b: ic.b, a: 255 });
        ray.DrawLineEx({ x: cx + z * 0.5, y: cy - isz }, { x: cx + z * 0.5, y: cy + isz }, z * 0.3, { r: ic.r, g: ic.g, b: ic.b, a: 255 });
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: isz * 1.4, height: isz * 1.4 },
          { x: isz * 0.7, y: isz * 0.7 },
          45,
          { r: ic.r, g: ic.g, b: ic.b, a: 120 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 0.4, height: z * 0.4 },
          { x: z * 0.2, y: z * 0.2 },
          0,
          { r: 255, g: 255, b: 255, a: 255 }
        );
      } else if (type === "lightning") {
        const ep = Math.round(100 + Math.abs(Math.sin(t * 0.18)) * 155);
        ray.DrawRectanglePro(
          { x: cx + z * 0.4, y: cy - z * 0.4, width: z * 1.2, height: z * 0.4 },
          { x: z * 0.6, y: z * 0.2 },
          -20,
          { r: ic.r, g: ic.g, b: ic.b, a: ep }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.4, y: cy + z * 0.1, width: z * 1.2, height: z * 0.4 },
          { x: z * 0.6, y: z * 0.2 },
          -20,
          { r: ic.r, g: ic.g, b: ic.b, a: Math.round(ep * 0.7) }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 0.35, height: z * 1.8 },
          { x: z * 0.175, y: z * 0.9 },
          -30,
          { r: 255, g: 255, b: 200, a: ep }
        );
      } else if (type === "poison") {
        ray.DrawRectangle(cx + Math.round(z * 0.1), cy - Math.round(z * 0.9), Math.round(z * 0.8), Math.round(z * 0.35), { r: ic.r, g: ic.g, b: ic.b, a: 200 });
        ray.DrawRectangle(cx - Math.round(z * 0.1), cy - Math.round(z * 0.55), Math.round(z * 1.2), Math.round(z * 1.4), { r: ic.r, g: ic.g, b: ic.b, a: 180 });
        ray.DrawRectangleLines(cx - Math.round(z * 0.1), cy - Math.round(z * 0.55), Math.round(z * 1.2), Math.round(z * 1.4), { r: 120, g: 255, b: 80, a: 220 });
        const boff = Math.round(Math.abs(Math.sin(t * 0.07)) * z * 0.3);
        ray.DrawRectangle(cx + Math.round(z * 0.2), cy - Math.round(z * 0.2) + boff, Math.round(z * 0.35), Math.round(z * 0.35), { r: 120, g: 255, b: 80, a: 200 });
      } else if (type === "boomerang") {
        const ba = t * 1.8;
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 2, height: z * 0.5 },
          { x: z, y: z * 0.25 },
          ba,
          { r: ic.r, g: ic.g, b: ic.b, a: 255 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 0.5, height: z * 2 },
          { x: z * 0.25, y: z },
          ba,
          { r: ic.r - 20, g: ic.g - 20, b: Math.max(0, ic.b - 10), a: 220 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 0.5, height: z * 0.5 },
          { x: z * 0.25, y: z * 0.25 },
          ba,
          { r: 240, g: 215, b: 90, a: 255 }
        );
      } else if (type === "shuriken") {
        const sa = t * 2.5;
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 2.2, height: z * 2.2 },
          { x: z * 1.1, y: z * 1.1 },
          sa,
          { r: ic.r, g: ic.g, b: ic.b, a: 230 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 2.2, height: z * 2.2 },
          { x: z * 1.1, y: z * 1.1 },
          sa + 45,
          { r: ic.r - 20, g: ic.g - 20, b: ic.b, a: 180 }
        );
        ray.DrawRectanglePro(
          { x: cx + z * 0.5, y: cy, width: z * 0.5, height: z * 0.5 },
          { x: z * 0.25, y: z * 0.25 },
          0,
          { r: 255, g: 255, b: 255, a: 255 }
        );
      } else if (type === "holy") {
        const gp = Math.round(160 + Math.abs(Math.sin(t * 0.05)) * 95);
        ray.DrawRectangle(cx + Math.round(z * 0.2), cy - Math.round(z), Math.round(z * 0.6), Math.round(z * 2), { r: ic.r, g: ic.g, b: ic.b, a: gp });
        ray.DrawRectangle(cx - Math.round(z * 0.5), cy - Math.round(z * 0.2), Math.round(z * 2), Math.round(z * 0.6), { r: ic.r, g: ic.g, b: ic.b, a: gp });
        ray.DrawRectangleLinesEx(
          { x: cx - Math.round(z * 0.3), y: cy - Math.round(z * 0.3), width: Math.round(z * 1.6), height: Math.round(z * 1.6) },
          1,
          { r: 255, g: 245, b: 160, a: Math.round(gp * 0.5) }
        );
        for (let k = 0; k < 4; k++) {
          const oa = t * 0.07 + k * (Math.PI / 2);
          ray.DrawRectanglePro(
            { x: cx + z * 0.5 + Math.cos(oa) * z * 1.2, y: cy + Math.sin(oa) * z * 1.2, width: z * 0.5, height: z * 0.5 },
            { x: z * 0.25, y: z * 0.25 },
            0,
            { r: 255, g: 230, b: 100, a: 220 }
          );
        }
      } else {
        ray.DrawRectanglePro({ x: cx + z * 0.5, y: cy, width: z * 2, height: z * 2 }, { x: z, y: z }, 0, ic);
        ray.DrawRectangleLinesEx({ x: cx - z * 0.5, y: cy - z, width: z * 2, height: z * 2 }, 1, { r: 220, g: 215, b: 245, a: 180 });
      }
    }
    module.exports = { drawPlaying, resetPlaying, setWaveNumber, getWaveNumber };
  }
});

// menu/mainMenu.js
var require_mainMenu = __commonJS({
  "menu/mainMenu.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { STATUS, currentStatus, getScale } = require_state();
    var { buttons, confirmQuit, refreshButtons } = require_buttons();
    var { hasSave } = require_save();
    var player = require_player();
    var { resetPlaying } = require_playing();
    function requestHostClose() {
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "dungeon4fun:close-request" }, "*");
      }
    }
    function itsMenu() {
      refreshButtons();
      const mousePos = ray.GetMousePosition();
      if (currentStatus.current === STATUS.MENU) {
        if (confirmQuit.active) {
          if (ray.CheckCollisionPointRec(mousePos, confirmQuit.yes)) {
            confirmQuit.yes.color = ray.GREEN;
            if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
              requestHostClose();
              ray.CloseWindow();
            }
          } else {
            confirmQuit.yes.color = ray.DARKGREEN;
          }
          if (ray.CheckCollisionPointRec(mousePos, confirmQuit.no)) {
            confirmQuit.no.color = ray.RED;
            if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
              confirmQuit.active = false;
            }
          } else {
            confirmQuit.no.color = ray.MAROON;
          }
          return;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.play)) {
          buttons.play.color = ray.LIGHTGRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            player.reset();
            resetPlaying();
            currentStatus.current = STATUS.PLAYING;
          }
        } else {
          buttons.play.color = ray.GRAY;
        }
        if (hasSave()) {
          if (ray.CheckCollisionPointRec(mousePos, buttons.continueGame)) {
            buttons.continueGame.color = ray.LIGHTGRAY;
            if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
              resetPlaying();
              currentStatus.current = STATUS.SLOT_SCREEN;
              currentStatus.slotMode = "LOAD";
              currentStatus.slotReady = false;
            }
          } else {
            buttons.continueGame.color = ray.GRAY;
          }
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.config)) {
          buttons.config.color = ray.GRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            currentStatus.current = STATUS.CONFIG;
            currentStatus.configFrom = STATUS.MENU;
          }
        } else {
          buttons.config.color = ray.DARKGRAY;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.book)) {
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            currentStatus.current = STATUS.BOOK;
          }
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.leave)) {
          buttons.leave.color = ray.RED;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            confirmQuit.active = true;
          }
        } else {
          buttons.leave.color = ray.MAROON;
        }
      }
    }
    function drawMenu() {
      refreshButtons();
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const mousePos = ray.GetMousePosition();
      const btnFs = Math.max(14, Math.round(22 * s));
      ray.DrawRectangle(0, 0, sw, sh, { r: 8, g: 6, b: 18, a: 255 });
      ray.DrawRectangle(0, Math.round(sh * 0.115), sw, 1, { r: 90, g: 55, b: 175, a: 55 });
      ray.DrawRectangle(0, Math.round(sh * 0.875), sw, 1, { r: 90, g: 55, b: 175, a: 55 });
      const titleFs = Math.max(28, Math.round(54 * s));
      const subFs = Math.max(9, Math.round(13 * s));
      const title = "DUNGEON4FUN";
      const sub = "~ a dungeon adventure ~";
      const titleW = ray.MeasureText(title, titleFs);
      const subW = ray.MeasureText(sub, subFs);
      const titleY = Math.round(sh * 0.13);
      ray.DrawText(title, Math.round(sw / 2 - titleW / 2 + 3), titleY + 3, titleFs, { r: 50, g: 15, b: 90, a: 220 });
      ray.DrawText(title, Math.round(sw / 2 - titleW / 2), titleY, titleFs, { r: 255, g: 195, b: 50, a: 255 });
      ray.DrawText(sub, Math.round(sw / 2 - subW / 2), titleY + titleFs + Math.round(5 * s), subFs, { r: 155, g: 125, b: 215, a: 200 });
      function drawBtn(btn, text, isDanger) {
        const hov = ray.CheckCollisionPointRec(mousePos, btn);
        const bg = isDanger ? hov ? { r: 195, g: 38, b: 52, a: 255 } : { r: 125, g: 22, b: 35, a: 255 } : hov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
        const border = isDanger ? hov ? { r: 255, g: 90, b: 90, a: 255 } : { r: 180, g: 40, b: 55, a: 200 } : hov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
        ray.DrawRectangleRec(btn, bg);
        ray.DrawRectangleLines(btn.x, btn.y, btn.width, btn.height, border);
        ray.DrawRectangleLines(btn.x + 1, btn.y + 1, btn.width - 2, btn.height - 2, { r: border.r, g: border.g, b: border.b, a: 55 });
        ray.DrawText(
          text,
          btn.x + Math.round((btn.width - ray.MeasureText(text, btnFs)) / 2),
          btn.y + Math.round((btn.height - btnFs) / 2),
          btnFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
      drawBtn(buttons.play, "PLAY", false);
      if (hasSave()) drawBtn(buttons.continueGame, "CONTINUE", false);
      drawBtn(buttons.leave, "LEAVE", true);
      {
        const hov = ray.CheckCollisionPointRec(mousePos, buttons.config);
        const bg = hov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
        const bc = hov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
        ray.DrawRectangleRec(buttons.config, bg);
        ray.DrawRectangleLines(buttons.config.x, buttons.config.y, buttons.config.width, buttons.config.height, bc);
        const cx = buttons.config.x + buttons.config.width / 2;
        const cy = buttons.config.y + buttons.config.height / 2;
        const gc = { r: 200, g: 165, b: 255, a: 255 };
        for (let i = 0; i < 8; i++) {
          const ang = i * 45 * Math.PI / 180;
          ray.DrawRectanglePro(
            { x: cx + Math.cos(ang) * 10 * s, y: cy + Math.sin(ang) * 10 * s, width: 7 * s, height: 5 * s },
            { x: 3.5 * s, y: 2.5 * s },
            i * 45,
            gc
          );
        }
        ray.DrawCircle(cx, cy, Math.round(8 * s), gc);
        ray.DrawCircle(cx, cy, Math.round(3 * s), bg);
      }
      {
        const hov = ray.CheckCollisionPointRec(mousePos, buttons.book);
        const bg2 = hov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
        const bc2 = hov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
        ray.DrawRectangleRec(buttons.book, bg2);
        ray.DrawRectangleLines(buttons.book.x, buttons.book.y, buttons.book.width, buttons.book.height, bc2);
        const bcx = buttons.book.x + buttons.book.width / 2;
        const bcy = buttons.book.y + buttons.book.height / 2;
        const bkFs = Math.max(9, Math.round(12 * s));
        const bkLbl = "B";
        const bkC = { r: 255, g: 210, b: 60, a: 255 };
        const bkW = Math.round(9 * s), bkH = Math.round(7 * s);
        ray.DrawRectangle(Math.round(bcx - bkW - 1), Math.round(bcy - bkH / 2), bkW, bkH, bkC);
        ray.DrawRectangle(Math.round(bcx + 1), Math.round(bcy - bkH / 2), bkW, bkH, bkC);
        ray.DrawLineEx({ x: bcx, y: bcy - bkH / 2 }, { x: bcx, y: bcy + bkH / 2 }, Math.round(1.5 * s), bg2);
        ray.DrawRectangleLines(Math.round(bcx - bkW - 1), Math.round(bcy - bkH / 2), bkW, bkH, { r: bc2.r, g: bc2.g, b: bc2.b, a: 200 });
        ray.DrawRectangleLines(Math.round(bcx + 1), Math.round(bcy - bkH / 2), bkW, bkH, { r: bc2.r, g: bc2.g, b: bc2.b, a: 200 });
      }
      const versionn = "alpha 0.4.2";
      const verFs = Math.max(9, Math.round(12 * s));
      ray.DrawText(versionn, Math.round(10 * s), sh - Math.round(verFs + 8 * s), verFs, { r: 90, g: 80, b: 130, a: 200 });
      if (confirmQuit.active) {
        const boxW = Math.round(400 * s);
        const boxH = Math.round(180 * s);
        const boxX = Math.round(sw / 2 - boxW / 2);
        const boxY = Math.round(sh / 2 - boxH / 2);
        const popFs = Math.round(22 * s);
        ray.DrawRectangle(0, 0, sw, sh, { r: 0, g: 0, b: 0, a: 210 });
        ray.DrawRectangle(boxX, boxY, boxW, boxH, { r: 18, g: 14, b: 36, a: 255 });
        ray.DrawRectangleLines(boxX, boxY, boxW, boxH, { r: 200, g: 40, b: 55, a: 255 });
        const msg = "Leave the game?";
        ray.DrawText(msg, Math.round(sw / 2 - ray.MeasureText(msg, popFs) / 2), boxY + Math.round(boxH * 0.2), popFs, { r: 235, g: 225, b: 255, a: 255 });
        ray.DrawRectangleRec(confirmQuit.yes, confirmQuit.yes.color);
        ray.DrawRectangleLines(confirmQuit.yes.x, confirmQuit.yes.y, confirmQuit.yes.width, confirmQuit.yes.height, { r: 80, g: 210, b: 80, a: 255 });
        ray.DrawText(
          "YES",
          confirmQuit.yes.x + Math.round((confirmQuit.yes.width - ray.MeasureText("YES", popFs)) / 2),
          confirmQuit.yes.y + Math.round((confirmQuit.yes.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
        ray.DrawRectangleRec(confirmQuit.no, confirmQuit.no.color);
        ray.DrawRectangleLines(confirmQuit.no.x, confirmQuit.no.y, confirmQuit.no.width, confirmQuit.no.height, { r: 220, g: 55, b: 55, a: 255 });
        ray.DrawText(
          "NO",
          confirmQuit.no.x + Math.round((confirmQuit.no.width - ray.MeasureText("NO", popFs)) / 2),
          confirmQuit.no.y + Math.round((confirmQuit.no.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
    }
    module.exports = { itsMenu, drawMenu };
  }
});

// menu/pause.js
var require_pause = __commonJS({
  "menu/pause.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var player = require_player();
    var { STATUS, currentStatus, getScale } = require_state();
    var { buttons, confirmBackMenu, refreshButtons } = require_buttons();
    function itsPause() {
      refreshButtons();
      const mousePos = ray.GetMousePosition();
      if (currentStatus.current === STATUS.PAUSED) {
        if (confirmBackMenu.active) {
          if (ray.CheckCollisionPointRec(mousePos, confirmBackMenu.yes)) {
            confirmBackMenu.yes.color = ray.GREEN;
            if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
              confirmBackMenu.active = false;
              currentStatus.current = STATUS.MENU;
              player.reset();
            }
          } else {
            confirmBackMenu.yes.color = ray.DARKGREEN;
          }
          if (ray.CheckCollisionPointRec(mousePos, confirmBackMenu.no)) {
            confirmBackMenu.no.color = ray.RED;
            if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
              confirmBackMenu.active = false;
            }
          } else {
            confirmBackMenu.no.color = ray.MAROON;
          }
          return;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.unpause)) {
          buttons.unpause.color = ray.LIGHTGRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            currentStatus.current = STATUS.PLAYING;
          }
        } else {
          buttons.unpause.color = ray.GRAY;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.save)) {
          buttons.save.color = ray.LIGHTGRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            currentStatus.current = STATUS.SLOT_SCREEN;
            currentStatus.slotMode = "SAVE";
            currentStatus.slotReady = false;
          }
        } else {
          buttons.save.color = ray.GRAY;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.backMenu)) {
          buttons.backMenu.color = ray.LIGHTGRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            confirmBackMenu.active = true;
          }
        } else {
          buttons.backMenu.color = ray.GRAY;
        }
        if (ray.CheckCollisionPointRec(mousePos, buttons.config)) {
          buttons.config.color = ray.GRAY;
          if (ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
            currentStatus.current = STATUS.CONFIG;
            currentStatus.configFrom = STATUS.PAUSED;
          }
        } else {
          buttons.config.color = ray.DARKGRAY;
        }
      }
    }
    function drawPauseScreen() {
      refreshButtons();
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const mousePos = ray.GetMousePosition();
      const btnFs = Math.max(14, Math.round(22 * s));
      ray.DrawRectangle(0, 0, sw, sh, { r: 5, g: 4, b: 15, a: 210 });
      const panW = Math.round(sw * 0.46);
      const panH = Math.round(sh * 0.74);
      const panX = Math.round(sw / 2 - panW / 2);
      const panY = Math.round(sh / 2 - panH / 2);
      ray.DrawRectangle(panX, panY, panW, panH, { r: 14, g: 11, b: 28, a: 245 });
      ray.DrawRectangleLines(panX, panY, panW, panH, { r: 90, g: 55, b: 165, a: 200 });
      ray.DrawRectangleLines(panX + 1, panY + 1, panW - 2, panH - 2, { r: 90, g: 55, b: 165, a: 55 });
      const titleFs = Math.max(20, Math.round(38 * s));
      const pausedText = "PAUSED";
      const pw = ray.MeasureText(pausedText, titleFs);
      ray.DrawText(pausedText, Math.round(sw / 2 - pw / 2 + 3), Math.round(sh * 0.19) + 3, titleFs, { r: 55, g: 18, b: 95, a: 200 });
      ray.DrawText(pausedText, Math.round(sw / 2 - pw / 2), Math.round(sh * 0.19), titleFs, { r: 255, g: 195, b: 50, a: 255 });
      function drawBtn(btn, text, isDanger) {
        const hov = ray.CheckCollisionPointRec(mousePos, btn);
        const bg = isDanger ? hov ? { r: 195, g: 38, b: 52, a: 255 } : { r: 125, g: 22, b: 35, a: 255 } : hov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
        const border = isDanger ? hov ? { r: 255, g: 90, b: 90, a: 255 } : { r: 180, g: 40, b: 55, a: 200 } : hov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
        ray.DrawRectangleRec(btn, bg);
        ray.DrawRectangleLines(btn.x, btn.y, btn.width, btn.height, border);
        ray.DrawRectangleLines(btn.x + 1, btn.y + 1, btn.width - 2, btn.height - 2, { r: border.r, g: border.g, b: border.b, a: 55 });
        ray.DrawText(
          text,
          btn.x + Math.round((btn.width - ray.MeasureText(text, btnFs)) / 2),
          btn.y + Math.round((btn.height - btnFs) / 2),
          btnFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
      drawBtn(buttons.unpause, "UNPAUSE", false);
      drawBtn(buttons.save, "SAVE", false);
      drawBtn(buttons.backMenu, "MENU", false);
      {
        const hov = ray.CheckCollisionPointRec(mousePos, buttons.config);
        const bg = hov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
        const bc = hov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
        ray.DrawRectangleRec(buttons.config, bg);
        ray.DrawRectangleLines(buttons.config.x, buttons.config.y, buttons.config.width, buttons.config.height, bc);
        const cx = buttons.config.x + buttons.config.width / 2;
        const cy = buttons.config.y + buttons.config.height / 2;
        const gc = { r: 200, g: 165, b: 255, a: 255 };
        for (let i = 0; i < 8; i++) {
          const ang = i * 45 * Math.PI / 180;
          ray.DrawRectanglePro(
            { x: cx + Math.cos(ang) * 10 * s, y: cy + Math.sin(ang) * 10 * s, width: 7 * s, height: 5 * s },
            { x: 3.5 * s, y: 2.5 * s },
            i * 45,
            gc
          );
        }
        ray.DrawCircle(cx, cy, Math.round(8 * s), gc);
        ray.DrawCircle(cx, cy, Math.round(3 * s), bg);
      }
      if (confirmBackMenu.active) {
        ray.DrawRectangle(0, 0, sw, sh, { r: 0, g: 0, b: 0, a: 180 });
        const boxW = Math.round(400 * s);
        const boxH = Math.round(180 * s);
        const boxX = Math.round(sw / 2 - boxW / 2);
        const boxY = Math.round(sh / 2 - boxH / 2);
        const popFs = Math.round(22 * s);
        ray.DrawRectangle(boxX, boxY, boxW, boxH, { r: 18, g: 14, b: 36, a: 255 });
        ray.DrawRectangleLines(boxX, boxY, boxW, boxH, { r: 90, g: 55, b: 165, a: 255 });
        const msg = "Go back to menu?";
        ray.DrawText(msg, Math.round(sw / 2 - ray.MeasureText(msg, popFs) / 2), boxY + Math.round(boxH * 0.2), popFs, { r: 235, g: 225, b: 255, a: 255 });
        ray.DrawRectangleRec(confirmBackMenu.yes, confirmBackMenu.yes.color);
        ray.DrawRectangleLines(confirmBackMenu.yes.x, confirmBackMenu.yes.y, confirmBackMenu.yes.width, confirmBackMenu.yes.height, { r: 80, g: 210, b: 80, a: 255 });
        ray.DrawText(
          "YES",
          confirmBackMenu.yes.x + Math.round((confirmBackMenu.yes.width - ray.MeasureText("YES", popFs)) / 2),
          confirmBackMenu.yes.y + Math.round((confirmBackMenu.yes.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
        ray.DrawRectangleRec(confirmBackMenu.no, confirmBackMenu.no.color);
        ray.DrawRectangleLines(confirmBackMenu.no.x, confirmBackMenu.no.y, confirmBackMenu.no.width, confirmBackMenu.no.height, { r: 220, g: 55, b: 55, a: 255 });
        ray.DrawText(
          "NO",
          confirmBackMenu.no.x + Math.round((confirmBackMenu.no.width - ray.MeasureText("NO", popFs)) / 2),
          confirmBackMenu.no.y + Math.round((confirmBackMenu.no.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
    }
    module.exports = { itsPause, drawPauseScreen };
  }
});

// menu/book.js
var require_book = __commonJS({
  "menu/book.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { STATUS, currentStatus, getScale } = require_state();
    var { SHOT_DEFS } = require_shots();
    var { drawUpgradeIcon, UPGRADE_POOL, getCardTheme } = require_levelup();
    var bookState = {
      tab: 0,
      // 0 = Upgrades, 1 = Weapons, 2 = Enemies
      scrollY: 0
    };
    var TABS = ["UPGRADES", "WEAPONS", "ENEMIES"];
    function getBookMaxScroll(tab, sw, sh, s, contentY) {
      const visibleH = sh - contentY;
      if (tab === 0) {
        const cardW2 = Math.round(sw * 0.16);
        const cardH2 = Math.round(sh * 0.38);
        const cols2 = Math.max(2, Math.floor((sw - Math.round(sw * 0.06)) / (cardW2 + Math.round(12 * s))));
        const gap2 = Math.round(12 * s);
        const rows2 = Math.ceil(UPGRADE_POOL.length / cols2);
        const totalH2 = rows2 * (cardH2 + gap2) + Math.round(16 * s);
        return Math.max(0, totalH2 - visibleH);
      }
      if (tab === 1) {
        const keys = Object.keys(SHOT_DEFS);
        const cardW2 = Math.round(sw * 0.27);
        const cardH2 = Math.round(sh * 0.3);
        const cols2 = Math.max(2, Math.floor((sw - Math.round(sw * 0.06)) / (cardW2 + Math.round(14 * s))));
        const gap2 = Math.round(14 * s);
        const rows2 = Math.ceil(keys.length / cols2);
        const totalH2 = rows2 * (cardH2 + gap2) + Math.round(16 * s);
        return Math.max(0, totalH2 - visibleH);
      }
      const cardW = Math.round(sw * 0.42);
      const cardH = Math.round(sh * 0.28);
      const cols = Math.max(1, Math.floor((sw - Math.round(sw * 0.06)) / (cardW + Math.round(16 * s))));
      const gap = Math.round(16 * s);
      const rows = Math.ceil(ENEMY_DEFS.length / cols);
      const totalH = rows * (cardH + gap) + Math.round(16 * s);
      return Math.max(0, totalH - visibleH);
    }
    var ENEMY_DEFS = [
      {
        id: "rat",
        name: "RAT",
        color: { r: 135, g: 85, b: 55, a: 255 },
        accent: { r: 190, g: 130, b: 80, a: 255 },
        radius: 4,
        speed: 0.75,
        hp: 4,
        dmg: 0.75,
        desc: "Fast melee critter.",
        details: ["Fast / Weak", "Charges directly", "XP: 2"]
      },
      {
        id: "bat",
        name: "BAT",
        color: { r: 82, g: 62, b: 122, a: 255 },
        accent: { r: 150, g: 110, b: 220, a: 255 },
        radius: 4,
        speed: 0.92,
        hp: 5,
        dmg: 0.8,
        desc: "Fragile flier that phases through walls.",
        details: ["Fast / Elusive", "Ignores walls", "XP: 4"]
      },
      {
        id: "slime",
        name: "SLIME",
        color: { r: 50, g: 190, b: 50, a: 255 },
        accent: { r: 80, g: 230, b: 80, a: 255 },
        radius: 7,
        speed: 0.55,
        hp: 10,
        dmg: 1.5,
        desc: "Slow tank. Hits hard.",
        details: ["Slow / Tanky", "Melee only", "Always reflects piercing shots!", "XP: 5"]
      },
      {
        id: "skeleton",
        name: "SKELETON",
        color: { r: 215, g: 205, b: 185, a: 255 },
        accent: { r: 235, g: 220, b: 190, a: 255 },
        radius: 5,
        speed: 0.75,
        hp: 7,
        dmg: 1,
        desc: "Ranged \u2014 fires bone projectiles.",
        details: ["Flanks + shoots", "Bone projectile: 2.5 dmg", "XP: 8"]
      },
      {
        id: "fish",
        name: "FISH",
        color: { r: 140, g: 150, b: 162, a: 255 },
        accent: { r: 80, g: 180, b: 255, a: 255 },
        radius: 5,
        speed: 0.65,
        hp: 6,
        dmg: 1,
        desc: "Shoots water \u2014 slows you on hit.",
        details: ["Flanks + shoots", "Water: slows 60%", "XP: 7"]
      },
      {
        id: "wraith",
        name: "WRAITH",
        color: { r: 12, g: 8, b: 18, a: 255 },
        accent: { r: 200, g: 60, b: 255, a: 255 },
        radius: 6,
        speed: 0.85,
        hp: 9,
        dmg: 1,
        desc: "Teleports + fires emerald that warps you.",
        details: ["Teleports nearby", "Emerald: teleports YOU", "XP: 12"]
      },
      {
        id: "golem",
        name: "GOLEM",
        color: { r: 110, g: 102, b: 124, a: 255 },
        accent: { r: 200, g: 175, b: 110, a: 255 },
        radius: 8,
        speed: 0.46,
        hp: 16,
        dmg: 2,
        desc: "Heavy bruiser that bursts forward in charges.",
        details: ["Slow / Durable", "Charge punishes mid-range", "XP: 11"]
      }
    ];
    function drawMiniEnemy(id, cx, cy, s) {
      const scale = s * 1.8;
      const def = ENEMY_DEFS.find((e) => e.id === id);
      const col = def?.color || { r: 200, g: 200, b: 200, a: 255 };
      const r = Math.max(6, Math.round((def?.radius || 5) * scale));
      const sz = r * 2;
      if (id === "slime") {
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 18, g: 105, b: 18, a: 230 });
        ray.DrawRectangleV({ x: cx - 3, y: cy - 2 }, { x: 2, y: 2 }, { r: 220, g: 240, b: 220, a: 255 });
        ray.DrawRectangleV({ x: cx + 1, y: cy - 2 }, { x: 2, y: 2 }, { r: 220, g: 240, b: 220, a: 255 });
      } else if (id === "skeleton") {
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 88, g: 82, b: 72, a: 220 });
        ray.DrawRectangleV({ x: cx - 3, y: cy - 2 }, { x: 2, y: 2 }, { r: 210, g: 28, b: 28, a: 255 });
        ray.DrawRectangleV({ x: cx + 1, y: cy - 2 }, { x: 2, y: 2 }, { r: 210, g: 28, b: 28, a: 255 });
      } else if (id === "rat") {
        ray.DrawRectangleV({ x: cx - r - 1, y: cy - r - 2 }, { x: 3, y: 3 }, { r: 210, g: 140, b: 120, a: 255 });
        ray.DrawRectangleV({ x: cx + r - 2, y: cy - r - 2 }, { x: 3, y: 3 }, { r: 210, g: 140, b: 120, a: 255 });
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 92, g: 52, b: 32, a: 200 });
        ray.DrawRectangleV({ x: cx - 2, y: cy - 1 }, { x: 1, y: 1 }, { r: 25, g: 12, b: 12, a: 255 });
        ray.DrawRectangleV({ x: cx + 1, y: cy - 1 }, { x: 1, y: 1 }, { r: 25, g: 12, b: 12, a: 255 });
      } else if (id === "bat") {
        ray.DrawRectanglePro({ x: cx - r - 4, y: cy, width: r + 4, height: r }, { x: 0, y: r * 0.5 }, 18, { r: 104, g: 82, b: 150, a: 230 });
        ray.DrawRectanglePro({ x: cx + 1, y: cy, width: r + 4, height: r }, { x: 0, y: r * 0.5 }, -18, { r: 104, g: 82, b: 150, a: 230 });
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 56, g: 40, b: 88, a: 220 });
        ray.DrawRectangleV({ x: cx - 2, y: cy - 1 }, { x: 1, y: 1 }, { r: 240, g: 210, b: 250, a: 255 });
        ray.DrawRectangleV({ x: cx + 1, y: cy - 1 }, { x: 1, y: 1 }, { r: 240, g: 210, b: 250, a: 255 });
      } else if (id === "fish") {
        ray.DrawRectangleV({ x: cx + r, y: cy - r + 1 }, { x: 4, y: 3 }, { r: 110, g: 120, b: 135, a: 255 });
        ray.DrawRectangleV({ x: cx + r, y: cy + r - 4 }, { x: 4, y: 3 }, { r: 110, g: 120, b: 135, a: 255 });
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 90, g: 100, b: 115, a: 220 });
        ray.DrawRectangleV({ x: cx - r + 2, y: cy - 2 }, { x: 2, y: 2 }, { r: 230, g: 235, b: 240, a: 255 });
        ray.DrawRectangleV({ x: cx - r + 2, y: cy - 2 }, { x: 1, y: 1 }, { r: 15, g: 20, b: 30, a: 255 });
      } else if (id === "wraith") {
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz + 4, height: sz + 4 }, { x: r + 2, y: r + 2 }, 0, { r: 80, g: 10, b: 110, a: 55 });
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 90, g: 15, b: 120, a: 230 });
        ray.DrawRectangleV({ x: cx - 3, y: cy - 2 }, { x: 2, y: 2 }, { r: 255, g: 40, b: 90, a: 255 });
        ray.DrawRectangleV({ x: cx + 1, y: cy - 2 }, { x: 2, y: 2 }, { r: 255, g: 40, b: 90, a: 255 });
      } else if (id === "golem") {
        ray.DrawRectanglePro({ x: cx, y: cy, width: sz, height: sz }, { x: r, y: r }, 0, col);
        ray.DrawRectangleLinesEx({ x: cx - r, y: cy - r, width: sz, height: sz }, 1, { r: 78, g: 72, b: 94, a: 230 });
        ray.DrawLineEx({ x: cx - r + 2, y: cy - r + 2 }, { x: cx - 1, y: cy - 1 }, 1, { r: 150, g: 142, b: 168, a: 180 });
        ray.DrawLineEx({ x: cx + 1, y: cy - r + 3 }, { x: cx + r - 2, y: cy - 1 }, 1, { r: 142, g: 134, b: 160, a: 180 });
        ray.DrawRectangleV({ x: cx - 4, y: cy - 2 }, { x: 2, y: 2 }, { r: 235, g: 190, b: 110, a: 255 });
        ray.DrawRectangleV({ x: cx + 2, y: cy - 2 }, { x: 2, y: 2 }, { r: 235, g: 190, b: 110, a: 255 });
      }
    }
    function drawWeaponIcon(key, cx, cy, s) {
      const def = SHOT_DEFS[key];
      if (!def) return;
      const col = def.color;
      const r = Math.round(13 * s);
      if (key === "bow") {
        ray.DrawCircleLines(cx, cy, r, col);
        ray.DrawLineEx({ x: cx - r - 2, y: cy }, { x: cx + r + 2, y: cy }, Math.round(2 * s), col);
        ray.DrawTriangle({ x: cx + r + 2, y: cy }, { x: cx + r - 3, y: cy - 4 }, { x: cx + r - 3, y: cy + 4 }, col);
      } else if (key === "fireball") {
        ray.DrawCircle(cx, cy, r, col);
        ray.DrawCircle(cx, cy, Math.round(r * 0.5), { r: 255, g: 210, b: 60, a: 255 });
        for (let k = 0; k < 5; k++) {
          const ang = k / 5 * Math.PI * 2;
          ray.DrawCircle(cx + Math.cos(ang) * r | 0, cy + Math.sin(ang) * r | 0, Math.round(3 * s), { r: 255, g: 140, b: 0, a: 200 });
        }
      } else if (key === "ice") {
        ray.DrawCircle(cx, cy, r, col);
        ray.DrawCircleLines(cx, cy, r, ray.WHITE);
        for (let k = 0; k < 3; k++) {
          const ang = k * (Math.PI / 3);
          ray.DrawLineEx(
            { x: cx + Math.cos(ang) * r | 0, y: cy + Math.sin(ang) * r | 0 },
            { x: cx - Math.cos(ang) * r | 0, y: cy - Math.sin(ang) * r | 0 },
            Math.round(1.5 * s),
            ray.WHITE
          );
        }
      } else if (key === "lightning") {
        const pts = [[-6, 12], [0, -6], [6, 12], [0, -2], [-6, 12]].map(([x, y]) => ({ x: cx + Math.round(x * s), y: cy + Math.round(y * s) }));
        for (let k = 0; k < pts.length - 1; k++) ray.DrawLineEx(pts[k], pts[k + 1], Math.round(2.5 * s), col);
      } else if (key === "poison") {
        ray.DrawCircle(cx, cy, r, col);
        ray.DrawCircle(cx, cy, Math.round(r * 0.5), { r: 40, g: 120, b: 30, a: 255 });
        for (let k = 0; k < 4; k++) {
          const ang = k * (Math.PI / 2);
          ray.DrawCircle(cx + Math.cos(ang) * (r + 3) | 0, cy + Math.sin(ang) * (r + 3) | 0, Math.round(3 * s), { r: 60, g: 180, b: 40, a: 255 });
        }
      } else if (key === "boomerang") {
        const r2 = Math.round(13 * s);
        ray.DrawTriangle(
          { x: cx + r2, y: cy },
          { x: cx + Math.cos(2.4) * r2 | 0, y: cy + Math.sin(2.4) * r2 | 0 },
          { x: cx + Math.cos(-2.4) * r2 | 0, y: cy + Math.sin(-2.4) * r2 | 0 },
          col
        );
        ray.DrawCircleLines(cx, cy, Math.round(6 * s), col);
      } else if (key === "shuriken") {
        const r1 = Math.round(15 * s), r2 = Math.round(6 * s);
        for (let k = 0; k < 4; k++) {
          const tip = k * (Math.PI / 2);
          ray.DrawTriangle(
            { x: cx + Math.cos(tip) * r1 | 0, y: cy + Math.sin(tip) * r1 | 0 },
            { x: cx + Math.cos(tip + Math.PI * 0.34) * r2 | 0, y: cy + Math.sin(tip + Math.PI * 0.34) * r2 | 0 },
            { x: cx + Math.cos(tip - Math.PI * 0.34) * r2 | 0, y: cy + Math.sin(tip - Math.PI * 0.34) * r2 | 0 },
            col
          );
        }
        ray.DrawCircle(cx, cy, Math.round(3 * s), ray.WHITE);
      } else if (key === "holy") {
        ray.DrawCircle(cx, cy, r, col);
        ray.DrawCircleLines(cx, cy, r, ray.GOLD);
        for (let k = 0; k < 4; k++) {
          const ang = k * (Math.PI / 2);
          ray.DrawCircle(cx + Math.cos(ang) * r | 0, cy + Math.sin(ang) * r | 0, Math.round(3 * s), ray.GOLD);
        }
      }
    }
    function itsBook() {
      if (currentStatus.current !== STATUS.BOOK) return;
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const mouse = ray.GetMousePosition();
      const contentY = Math.round(sh * 0.2);
      const maxScroll = getBookMaxScroll(bookState.tab, sw, sh, s, contentY);
      const wheel = ray.GetMouseWheelMove();
      if (wheel !== 0) {
        bookState.scrollY = Math.max(0, Math.min(maxScroll, bookState.scrollY - wheel * 28 * s));
      }
      const tabW = Math.round(sw * 0.22);
      const tabH = Math.round(28 * s);
      const tabY = Math.round(sh * 0.09);
      const tabStartX = Math.round(sw / 2 - (tabW * TABS.length + Math.round(8 * s) * (TABS.length - 1)) / 2);
      for (let i = 0; i < TABS.length; i++) {
        const tx = tabStartX + i * (tabW + Math.round(8 * s));
        const tabRect = { x: tx, y: tabY, width: tabW, height: tabH };
        if (ray.CheckCollisionPointRec(mouse, tabRect) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
          bookState.tab = i;
          bookState.scrollY = 0;
        }
      }
      const backW = Math.round(80 * s);
      const backH = Math.round(26 * s);
      const backRect = { x: Math.round(sw * 0.03), y: Math.round(sh * 0.04), width: backW, height: backH };
      if (ray.CheckCollisionPointRec(mouse, backRect) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
        currentStatus.current = STATUS.MENU;
        bookState.scrollY = 0;
      }
    }
    function drawBook() {
      if (currentStatus.current !== STATUS.BOOK) return;
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const mouse = ray.GetMousePosition();
      const contentY = Math.round(sh * 0.2);
      const maxScroll = getBookMaxScroll(bookState.tab, sw, sh, s, contentY);
      bookState.scrollY = Math.max(0, Math.min(maxScroll, bookState.scrollY));
      const scroll = bookState.scrollY;
      ray.DrawRectangle(0, 0, sw, sh, { r: 6, g: 5, b: 18, a: 255 });
      ray.DrawRectangle(0, Math.round(sh * 0.19), sw, 1, { r: 90, g: 55, b: 175, a: 80 });
      const backW = Math.round(80 * s);
      const backH = Math.round(26 * s);
      const backX = Math.round(sw * 0.03);
      const backY = Math.round(sh * 0.04);
      const backRect = { x: backX, y: backY, width: backW, height: backH };
      const backHov = ray.CheckCollisionPointRec(mouse, backRect);
      ray.DrawRectangle(
        backX,
        backY,
        backW,
        backH,
        backHov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 28, g: 20, b: 55, a: 255 }
      );
      ray.DrawRectangleLines(
        backX,
        backY,
        backW,
        backH,
        backHov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 }
      );
      const backFs = Math.max(9, Math.round(13 * s));
      const backTxt = "< BACK";
      ray.DrawText(
        backTxt,
        Math.round(backX + (backW - ray.MeasureText(backTxt, backFs)) / 2),
        Math.round(backY + (backH - backFs) / 2),
        backFs,
        { r: 210, g: 190, b: 255, a: 255 }
      );
      const titleFs = Math.max(16, Math.round(26 * s));
      const titleTxt = "\u{1F4D6}  BOOK OF KNOWLEDGE";
      const titleW = ray.MeasureText(titleTxt, titleFs);
      ray.DrawText(
        titleTxt,
        Math.round(sw / 2 - titleW / 2 + 2),
        Math.round(sh * 0.038) + 2,
        titleFs,
        { r: 40, g: 12, b: 70, a: 180 }
      );
      ray.DrawText(
        titleTxt,
        Math.round(sw / 2 - titleW / 2),
        Math.round(sh * 0.038),
        titleFs,
        { r: 255, g: 200, b: 60, a: 255 }
      );
      const tabW = Math.round(sw * 0.22);
      const tabH = Math.round(28 * s);
      const tabGap = Math.round(8 * s);
      const tabY = Math.round(sh * 0.09);
      const tabStartX = Math.round(sw / 2 - (tabW * TABS.length + tabGap * (TABS.length - 1)) / 2);
      const tabColors = [
        { r: 255, g: 185, b: 40, a: 255 },
        // upgrades – gold
        { r: 255, g: 100, b: 30, a: 255 },
        // weapons  – orange
        { r: 200, g: 70, b: 255, a: 255 }
        // enemies  – purple
      ];
      const tabFs = Math.max(9, Math.round(13 * s));
      for (let i = 0; i < TABS.length; i++) {
        const tx = tabStartX + i * (tabW + tabGap);
        const ac = tabColors[i];
        const sel = bookState.tab === i;
        const hov = ray.CheckCollisionPointRec(mouse, { x: tx, y: tabY, width: tabW, height: tabH });
        ray.DrawRectangle(
          tx,
          tabY,
          tabW,
          tabH,
          sel ? { r: Math.round(ac.r * 0.28), g: Math.round(ac.g * 0.28), b: Math.round(ac.b * 0.28), a: 255 } : hov ? { r: 38, g: 28, b: 68, a: 255 } : { r: 20, g: 14, b: 40, a: 255 }
        );
        ray.DrawRectangleLines(
          tx,
          tabY,
          tabW,
          tabH,
          sel || hov ? { r: ac.r, g: ac.g, b: ac.b, a: 255 } : { r: 70, g: 50, b: 120, a: 180 }
        );
        if (sel) ray.DrawRectangle(
          tx,
          tabY + tabH - Math.round(3 * s),
          tabW,
          Math.round(3 * s),
          { r: ac.r, g: ac.g, b: ac.b, a: 255 }
        );
        const lbl = TABS[i];
        ray.DrawText(
          lbl,
          Math.round(tx + (tabW - ray.MeasureText(lbl, tabFs)) / 2),
          Math.round(tabY + (tabH - tabFs) / 2),
          tabFs,
          sel ? { r: ac.r, g: ac.g, b: ac.b, a: 255 } : { r: 180, g: 155, b: 225, a: 200 }
        );
      }
      const contentH = sh - contentY;
      ray.BeginScissorMode(0, contentY, sw, contentH);
      if (bookState.tab === 0) drawUpgradesTab(sw, sh, s, scroll, contentY);
      else if (bookState.tab === 1) drawWeaponsTab(sw, sh, s, scroll, contentY);
      else drawEnemiesTab(sw, sh, s, scroll, contentY);
      ray.EndScissorMode();
    }
    function drawUpgradesTab(sw, sh, s, scroll, contentY) {
      const cardW = Math.round(sw * 0.16);
      const cardH = Math.round(sh * 0.38);
      const cols = Math.max(2, Math.floor((sw - Math.round(sw * 0.06)) / (cardW + Math.round(12 * s))));
      const gap = Math.round(12 * s);
      const padX = Math.round((sw - (cols * cardW + (cols - 1) * gap)) / 2);
      const startY = contentY + Math.round(16 * s) - scroll;
      for (let i = 0; i < UPGRADE_POOL.length; i++) {
        const up = UPGRADE_POOL[i];
        const col = Math.floor(i % cols);
        const row = Math.floor(i / cols);
        const cx = padX + col * (cardW + gap);
        const cy = startY + row * (cardH + gap);
        if (cy + cardH < contentY || cy > sh) continue;
        const { accent: ac, bg } = getCardTheme(up.id);
        const bannerH = Math.round(cardH * 0.5);
        ray.DrawRectangle(cx, cy, cardW, cardH, bg);
        ray.DrawRectangle(
          cx,
          cy,
          cardW,
          bannerH,
          { r: Math.round(ac.r * 0.18), g: Math.round(ac.g * 0.18), b: Math.round(ac.b * 0.18), a: 255 }
        );
        ray.DrawRectangle(
          cx,
          cy,
          cardW,
          Math.round(3 * s),
          { r: ac.r, g: ac.g, b: ac.b, a: 210 }
        );
        const icx = Math.round(cx + cardW / 2);
        const icy = Math.round(cy + bannerH / 2);
        ray.DrawCircle(icx, icy, Math.round(22 * s), { r: ac.r, g: ac.g, b: ac.b, a: 30 });
        drawUpgradeIcon(up.id, icx, icy - Math.round(20 * s), s * 0.85, ac);
        ray.DrawRectangleLines(cx, cy, cardW, cardH, { r: ac.r, g: ac.g, b: ac.b, a: 160 });
        ray.DrawRectangle(
          cx + Math.round(8 * s),
          cy + bannerH,
          cardW - Math.round(16 * s),
          1,
          { r: ac.r, g: ac.g, b: ac.b, a: 100 }
        );
        const tFs = Math.max(8, Math.round(11 * s));
        const tTxt = up.title;
        ray.DrawText(
          tTxt,
          Math.round(icx - ray.MeasureText(tTxt, tFs) / 2),
          Math.round(cy + bannerH + Math.round(6 * s)),
          tFs,
          { r: ac.r, g: ac.g, b: ac.b, a: 255 }
        );
        const dFs = Math.max(7, Math.round(10 * s));
        const lines = up.desc.split("\n");
        const maxW = cardW - Math.round(10 * s);
        let dFsAdj = dFs;
        for (const l of lines) while (dFsAdj > 7 && ray.MeasureText(l, dFsAdj) > maxW) dFsAdj--;
        lines.forEach((line, li) => {
          ray.DrawText(
            line,
            Math.round(icx - ray.MeasureText(line, dFsAdj) / 2),
            Math.round(cy + bannerH + tFs + Math.round(10 * s) + li * (dFsAdj + 3)),
            dFsAdj,
            { r: 195, g: 185, b: 220, a: 210 }
          );
        });
      }
      const rows = Math.ceil(UPGRADE_POOL.length / cols);
      const totalH = rows * (cardH + gap) + Math.round(16 * s);
      bookState.scrollY = Math.min(bookState.scrollY, Math.max(0, totalH - (sh - contentY)));
    }
    function drawWeaponsTab(sw, sh, s, scroll, contentY) {
      const keys = Object.keys(SHOT_DEFS);
      const cardW = Math.round(sw * 0.27);
      const cardH = Math.round(sh * 0.3);
      const cols = Math.max(2, Math.floor((sw - Math.round(sw * 0.06)) / (cardW + Math.round(14 * s))));
      const gap = Math.round(14 * s);
      const padX = Math.round((sw - (cols * cardW + (cols - 1) * gap)) / 2);
      const startY = contentY + Math.round(16 * s) - scroll;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const def = SHOT_DEFS[key];
        const col = Math.floor(i % cols);
        const row = Math.floor(i / cols);
        const cx = padX + col * (cardW + gap);
        const cy = startY + row * (cardH + gap);
        if (cy + cardH < contentY || cy > sh) continue;
        const ac = def.color;
        const bg = { r: Math.round(ac.r * 0.06), g: Math.round(ac.g * 0.06), b: Math.round(ac.b * 0.06), a: 255 };
        ray.DrawRectangle(cx, cy, cardW, cardH, bg);
        ray.DrawRectangle(cx, cy, cardW, Math.round(3 * s), { r: ac.r, g: ac.g, b: ac.b, a: 200 });
        ray.DrawRectangleLines(cx, cy, cardW, cardH, { r: ac.r, g: ac.g, b: ac.b, a: 160 });
        const icx = Math.round(cx + cardW * 0.22);
        const icy = Math.round(cy + cardH / 2);
        ray.DrawCircle(icx, icy, Math.round(20 * s), { r: ac.r, g: ac.g, b: ac.b, a: 28 });
        drawWeaponIcon(key, icx, icy, s);
        const divX = Math.round(cx + cardW * 0.42);
        ray.DrawRectangle(
          divX,
          cy + Math.round(8 * s),
          1,
          cardH - Math.round(16 * s),
          { r: ac.r, g: ac.g, b: ac.b, a: 80 }
        );
        const tx = divX + Math.round(10 * s);
        let ty = cy + Math.round(10 * s);
        const rightEdge = cx + cardW - Math.round(8 * s);
        const availW = rightEdge - tx;
        let tFs = Math.max(9, Math.round(13 * s));
        while (tFs > 9 && ray.MeasureText(def.title, tFs) > availW) tFs--;
        ray.DrawText(def.title, tx + 1, ty + 1, tFs, { r: 0, g: 0, b: 0, a: 160 });
        ray.DrawText(def.title, tx, ty, tFs, { r: ac.r, g: ac.g, b: ac.b, a: 255 });
        ty += tFs + Math.round(5 * s);
        let dFs = Math.max(7, Math.round(10 * s));
        while (dFs > 7 && ray.MeasureText(def.desc, dFs) > availW) dFs--;
        ray.DrawText(def.desc, tx, ty, dFs, { r: 195, g: 185, b: 220, a: 200 });
        ty += dFs + Math.round(8 * s);
        const statFs = Math.max(7, Math.round(9 * s));
        const stats = [
          `DMG  ${def.damage}`,
          `SPD  ${def.speed}`,
          `CD   ${def.cooldown}f`
        ];
        for (const st of stats) {
          ray.DrawText(st, tx, ty, statFs, { r: 160, g: 150, b: 200, a: 190 });
          ty += statFs + Math.round(3 * s);
        }
        const tagFs = Math.max(6, Math.round(8 * s));
        const tags = [];
        if (def.pierce) tags.push("PIERCE");
        if (def.chain) tags.push(`CHAIN\xD7${def.chain}`);
        if (def.returning) tags.push("RETURNS");
        if (def.count) tags.push(`\xD7${def.count}SHOT`);
        if (def.onHit) tags.push("ON-HIT");
        let tagX = tx;
        const tagY = cy + cardH - Math.round(18 * s);
        for (const tag of tags) {
          const tw = ray.MeasureText(tag, tagFs) + Math.round(6 * s);
          if (tagX + tw > rightEdge) break;
          ray.DrawRectangle(
            tagX,
            tagY,
            tw,
            Math.round(tagFs + 4 * s),
            { r: ac.r, g: ac.g, b: ac.b, a: 40 }
          );
          ray.DrawRectangleLines(
            tagX,
            tagY,
            tw,
            Math.round(tagFs + 4 * s),
            { r: ac.r, g: ac.g, b: ac.b, a: 130 }
          );
          ray.DrawText(
            tag,
            tagX + Math.round(3 * s),
            tagY + Math.round(2 * s),
            tagFs,
            { r: ac.r, g: ac.g, b: ac.b, a: 230 }
          );
          tagX += tw + Math.round(4 * s);
        }
      }
      const rows = Math.ceil(keys.length / cols);
      const totalH = rows * (cardH + gap) + Math.round(16 * s);
      bookState.scrollY = Math.min(bookState.scrollY, Math.max(0, totalH - (sh - contentY)));
    }
    function drawEnemiesTab(sw, sh, s, scroll, contentY) {
      const cardW = Math.round(sw * 0.42);
      const cardH = Math.round(sh * 0.28);
      const cols = Math.max(1, Math.floor((sw - Math.round(sw * 0.06)) / (cardW + Math.round(16 * s))));
      const gap = Math.round(16 * s);
      const padX = Math.round((sw - (cols * cardW + (cols - 1) * gap)) / 2);
      const startY = contentY + Math.round(16 * s) - scroll;
      for (let i = 0; i < ENEMY_DEFS.length; i++) {
        const def = ENEMY_DEFS[i];
        const col = Math.floor(i % cols);
        const row = Math.floor(i / cols);
        const cx = padX + col * (cardW + gap);
        const cy = startY + row * (cardH + gap);
        if (cy + cardH < contentY || cy > sh) continue;
        const ac = def.accent;
        const bg = { r: Math.round(ac.r * 0.05), g: Math.round(ac.g * 0.05), b: Math.round(ac.b * 0.05), a: 255 };
        ray.DrawRectangle(cx, cy, cardW, cardH, bg);
        ray.DrawRectangle(cx, cy, Math.round(4 * s), cardH, { r: ac.r, g: ac.g, b: ac.b, a: 200 });
        ray.DrawRectangleLines(cx, cy, cardW, cardH, { r: ac.r, g: ac.g, b: ac.b, a: 160 });
        const spriteCx = cx + Math.round(cardW * 0.13);
        const spriteCy = cy + Math.round(cardH * 0.4);
        ray.DrawCircle(spriteCx, spriteCy, Math.round(22 * s), { r: ac.r, g: ac.g, b: ac.b, a: 22 });
        drawMiniEnemy(def.id, spriteCx, spriteCy, s);
        const divX = cx + Math.round(cardW * 0.29);
        ray.DrawRectangle(
          divX,
          cy + Math.round(10 * s),
          1,
          cardH - Math.round(20 * s),
          { r: ac.r, g: ac.g, b: ac.b, a: 80 }
        );
        let tx = divX + Math.round(12 * s);
        let ty = cy + Math.round(10 * s);
        const nFs = Math.max(10, Math.round(14 * s));
        ray.DrawText(def.name, tx + 1, ty + 1, nFs, { r: 0, g: 0, b: 0, a: 160 });
        ray.DrawText(def.name, tx, ty, nFs, { r: ac.r, g: ac.g, b: ac.b, a: 255 });
        ty += nFs + Math.round(4 * s);
        const dFs = Math.max(7, Math.round(9 * s));
        ray.DrawText(def.desc, tx, ty, dFs, { r: 180, g: 168, b: 215, a: 200 });
        ty += dFs + Math.round(8 * s);
        const statFs = Math.max(7, Math.round(9 * s));
        const stats = [
          { lbl: "HP", val: `${def.hp}` },
          { lbl: "DMG", val: `${def.dmg}` },
          { lbl: "SPD", val: `${def.speed}` }
        ];
        for (const st of stats) {
          const lW = ray.MeasureText(`${st.lbl} `, statFs);
          const vW = ray.MeasureText(st.val, statFs);
          const pH = Math.round(statFs + 4 * s);
          const pW = lW + vW + Math.round(8 * s);
          ray.DrawRectangle(tx, ty, pW, pH, { r: ac.r, g: ac.g, b: ac.b, a: 35 });
          ray.DrawRectangleLines(tx, ty, pW, pH, { r: ac.r, g: ac.g, b: ac.b, a: 100 });
          ray.DrawText(`${st.lbl} `, tx + Math.round(4 * s), ty + Math.round(2 * s), statFs, { r: 165, g: 155, b: 210, a: 190 });
          ray.DrawText(st.val, tx + Math.round(4 * s) + lW, ty + Math.round(2 * s), statFs, { r: ac.r, g: ac.g, b: ac.b, a: 255 });
          tx += pW + Math.round(6 * s);
        }
        tx = divX + Math.round(12 * s);
        ty += Math.round(statFs + 4 * s + 8 * s);
        const bFs = Math.max(7, Math.round(9 * s));
        for (const detail of def.details) {
          ray.DrawText(`\u2022 ${detail}`, tx, ty, bFs, { r: 200, g: 188, b: 230, a: 210 });
          ty += bFs + Math.round(3 * s);
        }
      }
      const rows = Math.ceil(ENEMY_DEFS.length / cols);
      const totalH = rows * (cardH + gap) + Math.round(16 * s);
      bookState.scrollY = Math.min(bookState.scrollY, Math.max(0, totalH - (sh - contentY)));
    }
    module.exports = { itsBook, drawBook };
  }
});

// menu/menu.js
var require_menu = __commonJS({
  "menu/menu.js"(exports, module) {
    module.exports = {
      ...require_state(),
      // STATUS, currentStatus, getScale
      ...require_buttons(),
      // buttons, confirmBackMenu, confirmQuit, refreshButtons
      ...require_mainMenu(),
      // itsMenu, drawMenu
      ...require_pause(),
      // itsPause, drawPauseScreen
      ...require_book()
      // itsBook, drawBook
    };
  }
});

// saves/slotScreen.js
var require_slotScreen = __commonJS({
  "saves/slotScreen.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var player = require_player();
    var { getSlots, saveSlot, deleteSlot, activeSlot } = require_save();
    var { STATUS, currentStatus, getScale } = require_state();
    var { resetPlaying, setWaveNumber, getWaveNumber } = require_playing();
    var SLOT_MODE = { SAVE: "SAVE", LOAD: "LOAD" };
    var slotButtons = [
      { x: 0, y: 0, width: 0, height: 0, color: ray.GRAY }
    ];
    var trashButtons = [
      { x: 0, y: 0, width: 0, height: 0, color: ray.MAROON }
    ];
    var backSlotButton = { x: 300, y: 355, width: 200, height: 50, color: ray.GRAY };
    function refreshSlotLayout() {
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const cx = sw / 2;
      const slotH = Math.round(90 * s);
      const slotW = Math.round(sw * 0.519);
      const slotX = Math.round(sw * 0.1875);
      const trashW = Math.round(75 * s);
      const trashX = slotX + slotW + Math.round(7 * s);
      const slotY = Math.round(sh * 0.36);
      slotButtons[0].x = slotX;
      slotButtons[0].y = slotY;
      slotButtons[0].width = slotW;
      slotButtons[0].height = slotH;
      trashButtons[0].x = trashX;
      trashButtons[0].y = slotY;
      trashButtons[0].width = trashW;
      trashButtons[0].height = slotH;
      const backW = Math.round(200 * s);
      const backH = Math.round(50 * s);
      backSlotButton.x = cx - backW / 2;
      backSlotButton.y = Math.round(sh * 0.75);
      backSlotButton.width = backW;
      backSlotButton.height = backH;
      const boxH = Math.round(180 * s);
      const boxY = Math.round(sh / 2 - boxH / 2);
      const cw = Math.round(120 * s);
      const ch = Math.round(50 * s);
      confirm.yes.x = cx - cw - 10;
      confirm.yes.y = boxY + Math.round(boxH * 0.6);
      confirm.yes.width = cw;
      confirm.yes.height = ch;
      confirm.no.x = cx + 10;
      confirm.no.y = boxY + Math.round(boxH * 0.6);
      confirm.no.width = cw;
      confirm.no.height = ch;
      confirmDelete.yes.x = cx - cw - 10;
      confirmDelete.yes.y = boxY + Math.round(boxH * 0.6);
      confirmDelete.yes.width = cw;
      confirmDelete.yes.height = ch;
      confirmDelete.no.x = cx + 10;
      confirmDelete.no.y = boxY + Math.round(boxH * 0.6);
      confirmDelete.no.width = cw;
      confirmDelete.no.height = ch;
    }
    var lastSaved = { index: -1, time: 0 };
    var FLASH_DURATION = 1500;
    var confirm = {
      active: false,
      slotIndex: -1,
      yes: { x: 255, y: 270, width: 120, height: 50, color: ray.DARKGREEN },
      no: { x: 425, y: 270, width: 120, height: 50, color: ray.MAROON }
    };
    var confirmDelete = {
      active: false,
      slotIndex: -1,
      yes: { x: 255, y: 270, width: 120, height: 50, color: ray.DARKGREEN },
      no: { x: 425, y: 270, width: 120, height: 50, color: ray.MAROON }
    };
    function itsSlotScreen() {
      if (currentStatus.current !== STATUS.SLOT_SCREEN) return;
      refreshSlotLayout();
      if (!currentStatus.slotReady) {
        if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT))
          currentStatus.slotReady = true;
        return;
      }
      if (lastSaved.index !== -1) {
        if (Date.now() - lastSaved.time >= FLASH_DURATION) {
          lastSaved.index = -1;
          currentStatus.current = STATUS.PAUSED;
        }
        return;
      }
      const mousePos = ray.GetMousePosition();
      const slots = getSlots();
      const mode = currentStatus.slotMode;
      if (confirm.active) {
        if (ray.CheckCollisionPointRec(mousePos, confirm.yes)) {
          confirm.yes.color = ray.GREEN;
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            saveSlot(confirm.slotIndex, player, getWaveNumber());
            lastSaved.index = confirm.slotIndex;
            lastSaved.time = Date.now();
            confirm.active = false;
          }
        } else {
          confirm.yes.color = ray.DARKGREEN;
        }
        if (ray.CheckCollisionPointRec(mousePos, confirm.no)) {
          confirm.no.color = ray.RED;
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            confirm.active = false;
          }
        } else {
          confirm.no.color = ray.MAROON;
        }
        return;
      }
      if (confirmDelete.active) {
        if (ray.CheckCollisionPointRec(mousePos, confirmDelete.yes)) {
          confirmDelete.yes.color = ray.GREEN;
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            deleteSlot(confirmDelete.slotIndex);
            confirmDelete.active = false;
          }
        } else {
          confirmDelete.yes.color = ray.DARKGREEN;
        }
        if (ray.CheckCollisionPointRec(mousePos, confirmDelete.no)) {
          confirmDelete.no.color = ray.RED;
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            confirmDelete.active = false;
          }
        } else {
          confirmDelete.no.color = ray.MAROON;
        }
        return;
      }
      const btn = slotButtons[0];
      const isEmpty = slots[0] === null;
      const clickable = mode === SLOT_MODE.SAVE || !isEmpty;
      if (clickable && ray.CheckCollisionPointRec(mousePos, btn)) {
        btn.color = ray.LIGHTGRAY;
        if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
          if (mode === SLOT_MODE.SAVE) {
            confirm.active = true;
            confirm.slotIndex = 0;
          } else {
            activeSlot.index = 0;
            player.loadFrom(slots[0]);
            resetPlaying();
            if (slots[0].waveNumber) setWaveNumber(slots[0].waveNumber);
            currentStatus.current = STATUS.PLAYING;
          }
        }
      } else {
        btn.color = isEmpty && mode === SLOT_MODE.LOAD ? ray.DARKGRAY : ray.GRAY;
      }
      if (!isEmpty) {
        if (ray.CheckCollisionPointRec(mousePos, trashButtons[0])) {
          trashButtons[0].color = ray.RED;
          if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
            confirmDelete.active = true;
            confirmDelete.slotIndex = 0;
          }
        } else {
          trashButtons[0].color = ray.MAROON;
        }
      }
      if (ray.CheckCollisionPointRec(mousePos, backSlotButton)) {
        backSlotButton.color = ray.LIGHTGRAY;
        if (ray.IsMouseButtonReleased(ray.MOUSE_BUTTON_LEFT)) {
          currentStatus.current = mode === SLOT_MODE.SAVE ? STATUS.PAUSED : STATUS.MENU;
        }
      } else {
        backSlotButton.color = ray.GRAY;
      }
    }
    function drawSlotScreen() {
      refreshSlotLayout();
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = getScale();
      const slots = getSlots();
      const isSave = currentStatus.slotMode === SLOT_MODE.SAVE;
      ray.DrawRectangle(0, 0, sw, sh, { r: 8, g: 6, b: 18, a: 255 });
      const panelX = Math.round(sw * 0.125);
      const panelW = Math.round(sw * 0.75);
      ray.DrawRectangle(panelX, 10, panelW, sh - 20, { r: 16, g: 12, b: 30, a: 255 });
      ray.DrawRectangleLines(panelX, 10, panelW, sh - 20, { r: 90, g: 55, b: 165, a: 200 });
      ray.DrawRectangleLines(panelX + 1, 11, panelW - 2, sh - 22, { r: 90, g: 55, b: 165, a: 55 });
      const titleFs = Math.round(28 * s);
      const title = "SELECT YOUR SAVE";
      const titW = ray.MeasureText(title, titleFs);
      const titY = Math.round(sh * 0.056);
      ray.DrawText(title, Math.round(sw / 2 - titW / 2 + 2), titY + 2, titleFs, { r: 50, g: 15, b: 90, a: 180 });
      ray.DrawText(title, Math.round(sw / 2 - titW / 2), titY, titleFs, { r: 255, g: 195, b: 50, a: 255 });
      const slotLabelFs = Math.round(20 * s);
      const subFs = Math.round(16 * s);
      const emptyFs = Math.round(18 * s);
      const savedFs = Math.round(22 * s);
      {
        const btn = slotButtons[0];
        const hasData = slots[0] !== null;
        const clickable = isSave || hasData;
        const isFlashing = lastSaved.index === 0 && Date.now() - lastSaved.time < FLASH_DURATION;
        const cardBg = isFlashing ? { r: 20, g: 80, b: 30, a: 255 } : !clickable ? { r: 18, g: 14, b: 30, a: 255 } : { r: 28, g: 22, b: 50, a: 255 };
        const cardBorder = isFlashing ? { r: 60, g: 220, b: 80, a: 255 } : !clickable ? { r: 55, g: 45, b: 80, a: 180 } : { r: 90, g: 60, b: 165, a: 200 };
        ray.DrawRectangleRec(btn, cardBg);
        ray.DrawRectangleLines(btn.x, btn.y, btn.width, btn.height, cardBorder);
        ray.DrawRectangleLines(btn.x + 1, btn.y + 1, btn.width - 2, btn.height - 2, { r: cardBorder.r, g: cardBorder.g, b: cardBorder.b, a: 55 });
        ray.DrawText("SAVE SLOT", btn.x + Math.round(14 * s), btn.y + Math.round(12 * s), slotLabelFs, { r: 255, g: 195, b: 50, a: 255 });
        if (hasData) {
          ray.DrawLine(btn.x + Math.round(14 * s), btn.y + Math.round(42 * s), btn.x + btn.width - Math.round(14 * s), btn.y + Math.round(42 * s), { r: 75, g: 50, b: 140, a: 160 });
          ray.DrawText(`HP: ${slots[0].player.life}`, btn.x + Math.round(14 * s), btn.y + Math.round(52 * s), subFs, { r: 75, g: 210, b: 90, a: 255 });
          ray.DrawText(`Lv ${slots[0].player.level}`, btn.x + Math.round(120 * s), btn.y + Math.round(52 * s), subFs, { r: 255, g: 195, b: 50, a: 200 });
          ray.DrawText(`${slots[0].savedAt}`, btn.x + Math.round(200 * s), btn.y + Math.round(52 * s), subFs, { r: 155, g: 145, b: 190, a: 200 });
        } else {
          ray.DrawText("EMPTY", btn.x + btn.width / 2 - ray.MeasureText("EMPTY", emptyFs) / 2, btn.y + Math.round(32 * s), emptyFs, { r: 80, g: 70, b: 120, a: 200 });
        }
        if (isFlashing)
          ray.DrawText("SAVED!", btn.x + btn.width / 2 - ray.MeasureText("SAVED!", savedFs) / 2, btn.y + Math.round(30 * s), savedFs, ray.WHITE);
        if (hasData) {
          const tb = trashButtons[0];
          const thov = ray.CheckCollisionPointRec(ray.GetMousePosition(), tb);
          const tbg = thov ? { r: 145, g: 22, b: 35, a: 255 } : { r: 90, g: 16, b: 26, a: 255 };
          const tbc = thov ? { r: 255, g: 80, b: 80, a: 255 } : { r: 160, g: 45, b: 55, a: 200 };
          ray.DrawRectangleRec(tb, tbg);
          ray.DrawRectangleLines(tb.x, tb.y, tb.width, tb.height, tbc);
          const tx = tb.x + tb.width / 2;
          const ty = tb.y + Math.round(14 * s);
          const ic = { r: 230, g: 195, b: 195, a: 240 };
          ray.DrawRectangle(Math.round(tx - 8 * s), ty, Math.round(16 * s), Math.round(5 * s), ic);
          ray.DrawRectangle(Math.round(tx - 14 * s), ty + Math.round(5 * s), Math.round(28 * s), Math.round(5 * s), ic);
          ray.DrawRectangle(Math.round(tx - 11 * s), ty + Math.round(12 * s), Math.round(22 * s), Math.round(22 * s), ic);
          ray.DrawLine(Math.round(tx - 5 * s), ty + Math.round(15 * s), Math.round(tx - 5 * s), ty + Math.round(31 * s), tbg);
          ray.DrawLine(Math.round(tx), ty + Math.round(15 * s), Math.round(tx), ty + Math.round(31 * s), tbg);
          ray.DrawLine(Math.round(tx + 5 * s), ty + Math.round(15 * s), Math.round(tx + 5 * s), ty + Math.round(31 * s), tbg);
        }
      }
      const backFs = Math.round(20 * s);
      const backHov = ray.CheckCollisionPointRec(ray.GetMousePosition(), backSlotButton);
      const backBg = backHov ? { r: 68, g: 54, b: 130, a: 255 } : { r: 38, g: 28, b: 72, a: 255 };
      const backBc = backHov ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 };
      ray.DrawRectangleRec(backSlotButton, backBg);
      ray.DrawRectangleLines(backSlotButton.x, backSlotButton.y, backSlotButton.width, backSlotButton.height, backBc);
      ray.DrawText(
        "BACK",
        backSlotButton.x + Math.round((backSlotButton.width - ray.MeasureText("BACK", backFs)) / 2),
        backSlotButton.y + Math.round((backSlotButton.height - backFs) / 2),
        backFs,
        { r: 235, g: 225, b: 255, a: 255 }
      );
      const popFs = Math.round(22 * s);
      const boxW = Math.round(400 * s);
      const boxH = Math.round(180 * s);
      const boxX = Math.round(sw / 2 - boxW / 2);
      const boxY = Math.round(sh / 2 - boxH / 2);
      if (confirm.active) {
        ray.DrawRectangle(0, 0, sw, sh, { r: 0, g: 0, b: 0, a: 200 });
        ray.DrawRectangle(boxX, boxY, boxW, boxH, { r: 18, g: 14, b: 36, a: 255 });
        ray.DrawRectangleLines(boxX, boxY, boxW, boxH, { r: 90, g: 55, b: 165, a: 255 });
        const msg = `Save in SLOT ${confirm.slotIndex + 1}?`;
        ray.DrawText(msg, Math.round(sw / 2 - ray.MeasureText(msg, popFs) / 2), boxY + Math.round(boxH * 0.2), popFs, { r: 235, g: 225, b: 255, a: 255 });
        ray.DrawRectangleRec(confirm.yes, confirm.yes.color);
        ray.DrawRectangleLines(confirm.yes.x, confirm.yes.y, confirm.yes.width, confirm.yes.height, { r: 80, g: 210, b: 80, a: 255 });
        ray.DrawText(
          "YES",
          confirm.yes.x + Math.round((confirm.yes.width - ray.MeasureText("YES", popFs)) / 2),
          confirm.yes.y + Math.round((confirm.yes.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
        ray.DrawRectangleRec(confirm.no, confirm.no.color);
        ray.DrawRectangleLines(confirm.no.x, confirm.no.y, confirm.no.width, confirm.no.height, { r: 220, g: 55, b: 55, a: 255 });
        ray.DrawText(
          "NO",
          confirm.no.x + Math.round((confirm.no.width - ray.MeasureText("NO", popFs)) / 2),
          confirm.no.y + Math.round((confirm.no.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
      if (confirmDelete.active) {
        ray.DrawRectangle(0, 0, sw, sh, { r: 0, g: 0, b: 0, a: 200 });
        ray.DrawRectangle(boxX, boxY, boxW, boxH, { r: 22, g: 10, b: 10, a: 255 });
        ray.DrawRectangleLines(boxX, boxY, boxW, boxH, { r: 200, g: 40, b: 55, a: 255 });
        const msg = `Delete SLOT ${confirmDelete.slotIndex + 1}?`;
        ray.DrawText(msg, Math.round(sw / 2 - ray.MeasureText(msg, popFs) / 2), boxY + Math.round(boxH * 0.2), popFs, { r: 235, g: 225, b: 255, a: 255 });
        ray.DrawRectangleRec(confirmDelete.yes, confirmDelete.yes.color);
        ray.DrawRectangleLines(confirmDelete.yes.x, confirmDelete.yes.y, confirmDelete.yes.width, confirmDelete.yes.height, { r: 80, g: 210, b: 80, a: 255 });
        ray.DrawText(
          "YES",
          confirmDelete.yes.x + Math.round((confirmDelete.yes.width - ray.MeasureText("YES", popFs)) / 2),
          confirmDelete.yes.y + Math.round((confirmDelete.yes.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
        ray.DrawRectangleRec(confirmDelete.no, confirmDelete.no.color);
        ray.DrawRectangleLines(confirmDelete.no.x, confirmDelete.no.y, confirmDelete.no.width, confirmDelete.no.height, { r: 220, g: 55, b: 55, a: 255 });
        ray.DrawText(
          "NO",
          confirmDelete.no.x + Math.round((confirmDelete.no.width - ray.MeasureText("NO", popFs)) / 2),
          confirmDelete.no.y + Math.round((confirmDelete.no.height - popFs) / 2),
          popFs,
          { r: 235, g: 225, b: 255, a: 255 }
        );
      }
    }
    module.exports = { SLOT_MODE, itsSlotScreen, drawSlotScreen, activeSlot };
  }
});

// menu/config.js
var require_config = __commonJS({
  "menu/config.js"(exports, module) {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var { STATUS, currentStatus, getScale } = require_state();
    var { saveSettings } = require_save();
    var { devState } = require_devMode();
    var resolutions = [
      { label: "800 x 450", w: 800, h: 450 },
      { label: "1280 x 720", w: 1280, h: 720 },
      { label: "1920 x 1080", w: 1920, h: 1080 }
    ];
    var configState = { currentRes: 0 };
    var fullscreenActive = false;
    function enterFullscreen() {
      ray.ClearWindowState(ray.FLAG_WINDOW_TOPMOST);
      ray.SetWindowState(ray.FLAG_WINDOW_UNDECORATED);
      const mon = ray.GetCurrentMonitor();
      const mw = ray.GetMonitorWidth(mon);
      const mh = ray.GetMonitorHeight(mon);
      ray.SetWindowPosition(0, 0);
      ray.SetWindowSize(mw, mh);
      ray.SetWindowPosition(0, 0);
      ray.SetWindowSize(mw, mh);
      fullscreenActive = true;
    }
    function exitFullscreen() {
      ray.ClearWindowState(ray.FLAG_WINDOW_UNDECORATED | ray.FLAG_WINDOW_TOPMOST);
      const res = resolutions[configState.currentRes];
      ray.SetWindowSize(res.w, res.h);
      const mon = ray.GetCurrentMonitor();
      ray.SetWindowPosition(
        Math.round((ray.GetMonitorWidth(mon) - res.w) / 2),
        Math.round((ray.GetMonitorHeight(mon) - res.h) / 2)
      );
      fullscreenActive = false;
    }
    function isFullscreen() {
      return fullscreenActive;
    }
    function uiScale() {
      return Math.min(getScale(), 1.35);
    }
    function panelRect() {
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = uiScale();
      const width = Math.round(Math.min(sw * 0.82, 820 * s));
      const height = Math.round(Math.min(sh - Math.round(20 * s), Math.max(sh * 0.85, 430 * s)));
      return {
        x: Math.round(sw / 2 - width / 2),
        y: Math.round(sh / 2 - height / 2),
        width,
        height
      };
    }
    function displayCardRect() {
      const p = panelRect();
      const s = uiScale();
      return {
        x: p.x + Math.round(24 * s),
        y: p.y + Math.round(84 * s),
        width: p.width - Math.round(48 * s),
        height: Math.round(182 * s)
      };
    }
    function toggleCardRect() {
      const card = displayCardRect();
      const s = uiScale();
      return {
        x: card.x,
        y: card.y + card.height + Math.round(16 * s),
        width: card.width,
        height: Math.round(122 * s)
      };
    }
    function resRect(i) {
      const card = displayCardRect();
      const s = uiScale();
      const width = Math.round(card.width * 0.54);
      const gap = Math.round(9 * s);
      const availableH = card.height - Math.round(54 * s);
      const height = Math.max(Math.round(28 * s), Math.floor((availableH - gap * 2) / 3));
      return {
        x: card.x + Math.round(18 * s),
        y: card.y + Math.round(36 * s) + i * (height + gap),
        width,
        height
      };
    }
    function toggleRowRect(i) {
      const card = toggleCardRect();
      const s = uiScale();
      const gap = Math.round(10 * s);
      const rowH = Math.round((card.height - Math.round(40 * s) - gap) / 2);
      return {
        x: card.x + Math.round(14 * s),
        y: card.y + Math.round(28 * s) + i * (rowH + gap),
        width: card.width - Math.round(28 * s),
        height: rowH
      };
    }
    function backRect() {
      const p = panelRect();
      const s = uiScale();
      const width = Math.round(112 * s);
      const height = Math.round(28 * s);
      return {
        x: p.x + p.width - width - Math.round(18 * s),
        y: p.y + Math.round(18 * s),
        width,
        height
      };
    }
    function previewRect() {
      const card = displayCardRect();
      const s = uiScale();
      const width = Math.round(card.width * 0.28);
      const height = Math.round(card.height - 60 * s);
      return {
        x: card.x + card.width - width - Math.round(18 * s),
        y: card.y + Math.round(42 * s),
        width,
        height
      };
    }
    function checkboxInRow(row) {
      const s = uiScale();
      const sz = Math.max(18, Math.round(22 * s));
      return {
        x: row.x + Math.round(12 * s),
        y: Math.round(row.y + row.height / 2 - sz / 2),
        width: sz,
        height: sz
      };
    }
    function drawFrame(rec, fill, border, shineAlpha = 38) {
      ray.DrawRectangleRec(rec, fill);
      ray.DrawRectangleLines(rec.x, rec.y, rec.width, rec.height, border);
      ray.DrawRectangleLines(rec.x + 1, rec.y + 1, rec.width - 2, rec.height - 2, { r: border.r, g: border.g, b: border.b, a: 55 });
      ray.DrawRectangle(rec.x + 2, rec.y + 2, rec.width - 4, Math.max(4, Math.round(rec.height * 0.18)), { r: 255, g: 255, b: 255, a: shineAlpha });
    }
    function drawSectionTitle(text, x, y, s) {
      const fs = Math.max(10, Math.round(14 * s));
      ray.DrawText(text, x, y, fs, { r: 200, g: 170, b: 255, a: 220 });
    }
    function applyResolution(i) {
      configState.currentRes = i;
      const res = resolutions[i];
      if (fullscreenActive) exitFullscreen();
      else {
        ray.SetWindowSize(res.w, res.h);
        const mon = ray.GetCurrentMonitor();
        ray.SetWindowPosition(
          Math.round((ray.GetMonitorWidth(mon) - res.w) / 2),
          Math.round((ray.GetMonitorHeight(mon) - res.h) / 2)
        );
      }
      saveSettings(i, false, devState.enabled);
    }
    function toggleFullscreen() {
      if (!fullscreenActive) {
        enterFullscreen();
        saveSettings(configState.currentRes, true, devState.enabled);
      } else {
        exitFullscreen();
        saveSettings(configState.currentRes, false, devState.enabled);
      }
    }
    function toggleDevMode() {
      devState.enabled = !devState.enabled;
      saveSettings(configState.currentRes, fullscreenActive, devState.enabled);
    }
    function leaveConfig() {
      currentStatus.current = currentStatus.configFrom || STATUS.MENU;
    }
    function itsConfig() {
      if (currentStatus.current !== STATUS.CONFIG) return;
      const mousePos = ray.GetMousePosition();
      resolutions.forEach((_, i) => {
        const btn = resRect(i);
        if (ray.CheckCollisionPointRec(mousePos, btn) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
          applyResolution(i);
        }
      });
      if (ray.CheckCollisionPointRec(mousePos, toggleRowRect(0)) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
        toggleFullscreen();
      }
      if (ray.CheckCollisionPointRec(mousePos, toggleRowRect(1)) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
        toggleDevMode();
      }
      if (ray.CheckCollisionPointRec(mousePos, backRect()) && ray.IsMouseButtonPressed(ray.MOUSE_BUTTON_LEFT)) {
        leaveConfig();
      }
    }
    function drawResolutionButton(btn, label, isSelected, hovered, s) {
      const fill = isSelected ? { r: 58, g: 42, b: 112, a: 255 } : hovered ? { r: 42, g: 32, b: 82, a: 255 } : { r: 26, g: 20, b: 50, a: 255 };
      const border = isSelected ? { r: 255, g: 195, b: 60, a: 255 } : hovered ? { r: 170, g: 120, b: 235, a: 255 } : { r: 92, g: 60, b: 160, a: 180 };
      drawFrame(btn, fill, border, isSelected ? 30 : 18);
      if (isSelected) {
        ray.DrawRectangle(btn.x + 2, btn.y + 2, Math.max(4, Math.round(5 * s)), btn.height - 4, { r: 255, g: 195, b: 60, a: 220 });
      }
      const fs = Math.max(10, Math.round(15 * s));
      ray.DrawText(label, btn.x + Math.round(18 * s), btn.y + Math.round((btn.height - fs) / 2), fs, { r: 240, g: 232, b: 255, a: 255 });
      if (isSelected) {
        const tag = "ACTIVE";
        const tagFs = Math.max(7, Math.round(9 * s));
        const tagW = ray.MeasureText(tag, tagFs);
        const tagX = btn.x + btn.width - tagW - Math.round(14 * s);
        const tagY = btn.y + Math.round((btn.height - tagFs) / 2);
        ray.DrawText(tag, tagX, tagY, tagFs, { r: 255, g: 210, b: 95, a: 255 });
      }
    }
    function drawToggleRow(row, label, desc, enabled, hovered, iconType) {
      const s = uiScale();
      const fill = enabled ? hovered ? { r: 28, g: 70, b: 44, a: 255 } : { r: 22, g: 54, b: 34, a: 255 } : hovered ? { r: 34, g: 26, b: 68, a: 255 } : { r: 22, g: 18, b: 44, a: 255 };
      const border = enabled ? { r: 72, g: 225, b: 120, a: 235 } : hovered ? { r: 180, g: 130, b: 245, a: 235 } : { r: 92, g: 60, b: 160, a: 180 };
      drawFrame(row, fill, border, enabled ? 28 : 18);
      const cb = checkboxInRow(row);
      ray.DrawRectangleLines(cb.x, cb.y, cb.width, cb.height, enabled ? { r: 100, g: 255, b: 145, a: 255 } : { r: 185, g: 175, b: 220, a: 215 });
      if (enabled) {
        const inner = Math.max(3, Math.round(4 * s));
        ray.DrawRectangle(cb.x + inner, cb.y + inner, cb.width - inner * 2, cb.height - inner * 2, { r: 38, g: 230, b: 90, a: 255 });
      }
      const iconX = cb.x + cb.width + Math.round(16 * s);
      const iconY = Math.round(row.y + row.height / 2);
      if (iconType === "screen") {
        ray.DrawRectangle(iconX, iconY - Math.round(9 * s), Math.round(18 * s), Math.round(12 * s), { r: 175, g: 145, b: 235, a: 220 });
        ray.DrawRectangle(iconX + Math.round(2 * s), iconY - Math.round(7 * s), Math.round(14 * s), Math.round(8 * s), { r: 26, g: 18, b: 42, a: 255 });
        ray.DrawRectangle(iconX + Math.round(7 * s), iconY + Math.round(4 * s), Math.round(4 * s), Math.round(2 * s), { r: 175, g: 145, b: 235, a: 220 });
      } else {
        ray.DrawRectangle(iconX + Math.round(3 * s), iconY - Math.round(9 * s), Math.round(12 * s), Math.round(16 * s), { r: 255, g: 195, b: 60, a: 235 });
        ray.DrawRectangle(iconX + Math.round(6 * s), iconY - Math.round(5 * s), Math.round(2 * s), Math.round(8 * s), { r: 90, g: 55, b: 165, a: 255 });
        ray.DrawRectangle(iconX + Math.round(10 * s), iconY - Math.round(5 * s), Math.round(2 * s), Math.round(8 * s), { r: 90, g: 55, b: 165, a: 255 });
        ray.DrawRectangle(iconX + Math.round(6 * s), iconY - Math.round(1 * s), Math.round(6 * s), Math.round(2 * s), { r: 90, g: 55, b: 165, a: 255 });
      }
      const titleFs = Math.max(10, Math.round(14 * s));
      const descFs = Math.max(7, Math.round(8 * s));
      const textX = iconX + Math.round(28 * s);
      const titleY = row.y + Math.round(8 * s);
      const descY = titleY + titleFs + Math.round(4 * s);
      ray.DrawText(label, textX, titleY, titleFs, { r: 240, g: 232, b: 255, a: 255 });
      const descFits = descY + descFs <= row.y + row.height - Math.round(3 * s);
      if (descFits) {
        ray.DrawText(desc, textX, descY, descFs, { r: 170, g: 150, b: 215, a: 215 });
      }
      const stateText = enabled ? "ON" : "OFF";
      const stateFs = Math.max(9, Math.round(12 * s));
      const stateW = ray.MeasureText(stateText, stateFs);
      ray.DrawText(
        stateText,
        row.x + row.width - stateW - Math.round(12 * s),
        row.y + Math.round(row.height / 2 - stateFs / 2),
        stateFs,
        enabled ? { r: 100, g: 255, b: 145, a: 255 } : { r: 175, g: 165, b: 205, a: 210 }
      );
    }
    function drawPreview(selectedRes) {
      const s = uiScale();
      const box = previewRect();
      const border = fullscreenActive ? { r: 72, g: 225, b: 120, a: 220 } : { r: 120, g: 90, b: 190, a: 210 };
      drawFrame(box, { r: 20, g: 16, b: 40, a: 255 }, border, 16);
      const monitor = {
        x: box.x + Math.round(18 * s),
        y: box.y + Math.round(12 * s),
        width: box.width - Math.round(36 * s),
        height: Math.round(42 * s)
      };
      ray.DrawRectangleLines(monitor.x, monitor.y, monitor.width, monitor.height, { r: 205, g: 185, b: 250, a: 200 });
      ray.DrawRectangle(
        monitor.x + 2,
        monitor.y + 2,
        monitor.width - 4,
        monitor.height - 4,
        fullscreenActive ? { r: 20, g: 78, b: 44, a: 255 } : { r: 30, g: 22, b: 62, a: 255 }
      );
      ray.DrawRectangle(monitor.x + Math.round(monitor.width * 0.18), monitor.y + monitor.height + Math.round(5 * s), Math.round(monitor.width * 0.64), Math.round(3 * s), { r: 125, g: 105, b: 180, a: 180 });
      const resFs = Math.max(8, Math.round(11 * s));
      const resW = ray.MeasureText(selectedRes.label, resFs);
      ray.DrawText(
        selectedRes.label,
        Math.round(monitor.x + monitor.width / 2 - resW / 2),
        Math.round(monitor.y + monitor.height / 2 - resFs / 2),
        resFs,
        { r: 240, g: 232, b: 255, a: 255 }
      );
      const mode = fullscreenActive ? "FULLSCREEN" : "WINDOWED";
      const modeFs = Math.max(8, Math.round(10 * s));
      const modeW = ray.MeasureText(mode, modeFs);
      ray.DrawText(
        mode,
        Math.round(box.x + box.width / 2 - modeW / 2),
        box.y + box.height - Math.round(18 * s),
        modeFs,
        fullscreenActive ? { r: 100, g: 255, b: 145, a: 255 } : { r: 255, g: 195, b: 60, a: 255 }
      );
    }
    function drawConfig() {
      const sw = ray.GetScreenWidth();
      const sh = ray.GetScreenHeight();
      const s = uiScale();
      const mousePos = ray.GetMousePosition();
      const panel = panelRect();
      const display = displayCardRect();
      const toggles = toggleCardRect();
      const selectedRes = resolutions[configState.currentRes];
      ray.DrawRectangle(0, 0, sw, sh, { r: 8, g: 6, b: 18, a: 255 });
      ray.DrawRectangle(0, Math.round(sh * 0.12), sw, 1, { r: 90, g: 55, b: 165, a: 55 });
      ray.DrawRectangle(0, Math.round(sh * 0.88), sw, 1, { r: 90, g: 55, b: 165, a: 55 });
      ray.DrawRectangle(Math.round(sw * 0.08), Math.round(sh * 0.16), Math.round(sw * 0.84), 1, { r: 255, g: 195, b: 60, a: 18 });
      ray.DrawRectangle(panel.x - Math.round(6 * s), panel.y - Math.round(6 * s), panel.width + Math.round(12 * s), panel.height + Math.round(12 * s), { r: 35, g: 12, b: 58, a: 70 });
      ray.DrawRectangle(panel.x, panel.y, panel.width, panel.height, { r: 14, g: 11, b: 28, a: 245 });
      ray.DrawRectangle(panel.x, panel.y, panel.width, Math.round(panel.height * 0.18), { r: 30, g: 18, b: 54, a: 145 });
      ray.DrawRectangleLines(panel.x, panel.y, panel.width, panel.height, { r: 90, g: 55, b: 165, a: 210 });
      ray.DrawRectangleLines(panel.x + 1, panel.y + 1, panel.width - 2, panel.height - 2, { r: 90, g: 55, b: 165, a: 55 });
      const corner = Math.max(5, Math.round(6 * s));
      for (const [cx, cy] of [
        [panel.x, panel.y],
        [panel.x + panel.width - corner, panel.y],
        [panel.x, panel.y + panel.height - corner],
        [panel.x + panel.width - corner, panel.y + panel.height - corner]
      ]) {
        ray.DrawRectangle(cx, cy, corner, corner, { r: 255, g: 195, b: 60, a: 235 });
      }
      const title = "CONFIGURATION";
      const titleFs = Math.max(24, Math.round(34 * s));
      const sub = "Tune your display and useful extras";
      const subFs = Math.max(9, Math.round(12 * s));
      const titleW = ray.MeasureText(title, titleFs);
      const subW = ray.MeasureText(sub, subFs);
      const titleY = panel.y + Math.round(20 * s);
      ray.DrawText(title, Math.round(panel.x + panel.width / 2 - titleW / 2 + 2), titleY + 2, titleFs, { r: 50, g: 15, b: 90, a: 220 });
      ray.DrawText(title, Math.round(panel.x + panel.width / 2 - titleW / 2), titleY, titleFs, { r: 255, g: 195, b: 50, a: 255 });
      ray.DrawText(sub, Math.round(panel.x + panel.width / 2 - subW / 2), titleY + titleFs + Math.round(4 * s), subFs, { r: 165, g: 140, b: 220, a: 205 });
      drawFrame(display, { r: 18, g: 14, b: 36, a: 255 }, { r: 90, g: 55, b: 165, a: 180 }, 14);
      drawFrame(toggles, { r: 18, g: 14, b: 36, a: 255 }, { r: 90, g: 55, b: 165, a: 180 }, 14);
      drawSectionTitle("DISPLAY", display.x + Math.round(14 * s), display.y + Math.round(10 * s), s);
      drawSectionTitle("PREFERENCES", toggles.x + Math.round(14 * s), toggles.y + Math.round(10 * s), s);
      const pillText = fullscreenActive ? "LIVE: FULLSCREEN" : "LIVE: WINDOWED";
      const pillFs = Math.max(8, Math.round(10 * s));
      const pillW = ray.MeasureText(pillText, pillFs) + Math.round(20 * s);
      const pillH = Math.round(20 * s);
      const pillX = display.x + display.width - pillW - Math.round(14 * s);
      const pillY = display.y + Math.round(8 * s);
      ray.DrawRectangle(pillX, pillY, pillW, pillH, fullscreenActive ? { r: 22, g: 62, b: 34, a: 255 } : { r: 44, g: 30, b: 80, a: 255 });
      ray.DrawRectangleLines(pillX, pillY, pillW, pillH, fullscreenActive ? { r: 72, g: 225, b: 120, a: 220 } : { r: 255, g: 195, b: 60, a: 220 });
      ray.DrawText(
        pillText,
        pillX + Math.round(10 * s),
        pillY + Math.round((pillH - pillFs) / 2),
        pillFs,
        fullscreenActive ? { r: 100, g: 255, b: 145, a: 255 } : { r: 255, g: 205, b: 95, a: 255 }
      );
      drawPreview(selectedRes);
      resolutions.forEach((res, i) => {
        const btn = resRect(i);
        const hovered = ray.CheckCollisionPointRec(mousePos, btn);
        const isSelected = configState.currentRes === i;
        drawResolutionButton(btn, res.label, isSelected, hovered, s);
      });
      const fullRow = toggleRowRect(0);
      const devRow = toggleRowRect(1);
      drawToggleRow(fullRow, "Fullscreen", "Borderless full monitor display for cleaner immersion.", fullscreenActive, ray.CheckCollisionPointRec(mousePos, fullRow), "screen");
      drawToggleRow(devRow, "Dev Mode", "Shows debug helpers like FPS and combat values.", devState.enabled, ray.CheckCollisionPointRec(mousePos, devRow), "dev");
      const back = backRect();
      const backHovered = ray.CheckCollisionPointRec(mousePos, back);
      drawFrame(
        back,
        backHovered ? { r: 42, g: 32, b: 82, a: 255 } : { r: 26, g: 20, b: 50, a: 255 },
        backHovered ? { r: 210, g: 160, b: 255, a: 255 } : { r: 90, g: 60, b: 160, a: 200 },
        20
      );
      const backLabel = "BACK";
      const backFs = Math.max(10, Math.round(14 * s));
      ray.DrawText(
        backLabel,
        Math.round(back.x + back.width / 2 - ray.MeasureText(backLabel, backFs) / 2),
        back.y + Math.round((back.height - backFs) / 2),
        backFs,
        { r: 240, g: 232, b: 255, a: 255 }
      );
      const hint = "Tip: press ESC to go back.";
      const hintFs = Math.max(8, Math.round(10 * s));
      ray.DrawText(
        hint,
        panel.x + Math.round(24 * s),
        panel.y + panel.height - Math.round(22 * s),
        hintFs,
        { r: 135, g: 120, b: 185, a: 180 }
      );
    }
    module.exports = { itsConfig, drawConfig, configState, resolutions, enterFullscreen, exitFullscreen, isFullscreen };
  }
});

// .generated-entry.js
var require_generated_entry = __commonJS({
  ".generated-entry.js"() {
    var ray = (init_raylib_web_runtime(), __toCommonJS(raylib_web_runtime_exports));
    var player = require_player();
    var { STATUS, currentStatus, itsMenu, itsPause, drawMenu, drawPauseScreen, itsBook, drawBook } = require_menu();
    var { drawPlaying } = require_playing();
    var { itsSlotScreen, drawSlotScreen } = require_slotScreen();
    var { itsConfig, drawConfig } = require_config();
    var { loadSettings } = require_save();
    var { resolutions, configState, enterFullscreen } = require_config();
    var { devState } = require_devMode();
    var screenWidth = 800;
    var screenHeight = 450;
    ray.InitWindow(screenWidth, screenHeight, "dungeon4fun");
    ray.SetTargetFPS(60);
    ray.SetExitKey(0);
    var savedSettings = loadSettings();
    if (savedSettings) {
      configState.currentRes = savedSettings.resIndex;
      if (savedSettings.devMode) devState.enabled = true;
      const res = resolutions[savedSettings.resIndex];
      if (savedSettings.fullscreen) {
        enterFullscreen();
      } else {
        ray.SetWindowSize(res.w, res.h);
      }
    }
    if (!savedSettings || !savedSettings.fullscreen) {
      const mon = ray.GetCurrentMonitor();
      ray.SetWindowPosition(
        Math.round((ray.GetMonitorWidth(mon) - ray.GetScreenWidth()) / 2),
        Math.round((ray.GetMonitorHeight(mon) - ray.GetScreenHeight()) / 2)
      );
    }
    var __running = true;
    var __stepMs = 1e3 / (ray.__getTargetFPS ? ray.__getTargetFPS() : 60);
    var __acc = 0;
    var __lastTs = performance.now();
    function __update() {
      itsMenu();
      itsPause();
      itsBook();
      itsSlotScreen();
      itsConfig();
      if (ray.IsKeyReleased(ray.KEY_ESCAPE)) {
        if (currentStatus.current === STATUS.PLAYING) {
          currentStatus.current = STATUS.PAUSED;
        } else if (currentStatus.current === STATUS.PAUSED) {
          currentStatus.current = STATUS.PLAYING;
        } else if (currentStatus.current === STATUS.SLOT_SCREEN) {
          currentStatus.current = currentStatus.slotMode === "SAVE" ? STATUS.PAUSED : STATUS.MENU;
        } else if (currentStatus.current === STATUS.CONFIG) {
          currentStatus.current = currentStatus.configFrom || STATUS.MENU;
        } else if (currentStatus.current === STATUS.BOOK) {
          currentStatus.current = STATUS.MENU;
        }
      }
    }
    function __render() {
      ray.BeginDrawing();
      ray.ClearBackground({ r: 56, g: 102, b: 40, a: 255 });
      if (currentStatus.current === STATUS.MENU) {
        drawMenu();
      }
      if (currentStatus.current === STATUS.PLAYING) {
        drawPlaying();
      }
      if (currentStatus.current === STATUS.PAUSED) {
        drawPauseScreen();
      }
      if (currentStatus.current === STATUS.SLOT_SCREEN) {
        drawSlotScreen();
      }
      if (currentStatus.current === STATUS.CONFIG) {
        drawConfig();
      }
      if (currentStatus.current === STATUS.BOOK) {
        drawBook();
      }
      ray.EndDrawing();
    }
    function __frame(ts) {
      if (!__running || ray.WindowShouldClose()) {
        __running = false;
        ray.CloseWindow();
        return;
      }
      const __now = typeof ts === "number" ? ts : performance.now();
      let __dt = __now - __lastTs;
      __lastTs = __now;
      if (__dt > 250) __dt = __stepMs;
      __acc += __dt;
      let __loops = 0;
      while (__acc >= __stepMs && __loops < 3) {
        __update();
        __acc -= __stepMs;
        __loops += 1;
      }
      if (__loops === 0) __update();
      ray.__beginFrame();
      __render();
      ray.__endFrame();
      requestAnimationFrame(__frame);
    }
    requestAnimationFrame(__frame);
  }
});
export default require_generated_entry();
