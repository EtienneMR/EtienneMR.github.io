const GLYPHS = [
  "{",
  "}",
  "<",
  ">",
  "(",
  ")",
  ";",
  "/",
  "*",
  "!==",
  "//",
  "=>",
  "0",
  "1",
  "def",
  "let",
  "const",
  "var",
  "💻",
];

const TOKEN_PER_PIXEL2 = 60000;
const MIN_TOKEN_COUNT = 22;
const MAX_TOKEN_COUNT = 140;
const SMALL_SCREEN_MAX = 600;
const SMALL_SCREEN_SCALE = 0.6;
const MOUSE_RADIUS = 120;
const RESIZE_DEBOUNCE_MS = 120;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface MouseState {
  x: number;
  y: number;
  down: boolean;
}

class Token {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  speed: number = 0;
  size: number = 0;
  glyph: string = "";
  hue: number = 0;
  alpha: number = 1;
  sway: number = 0;
  phase: number = 0;

  constructor(width: number, height: number) {
    this.reset(width, height, true);
  }

  reset(width: number, height: number, init = false) {
    this.x = rand(0, width);
    this.y = init ? rand(0, height) : -30;
    this.vx = 0;
    this.vy = 0;
    this.speed = rand(0.02, 0.1);
    this.size = Math.round(rand(10, 18));
    this.glyph = GLYPHS[randInt(0, GLYPHS.length - 1)];
    this.hue = rand(180, 320);
    this.alpha = rand(0.1, 0.5);
    this.sway = rand(0.0002, 0.0011);
    this.phase = rand(0, Math.PI * 2);
  }

  update(dt: number, w: number, h: number, mouse: MouseState) {
    this.phase += this.sway * dt;
    this.y += this.speed * dt * (0.6 + Math.sin(this.phase) * 0.4);
    this.x += this.speed * dt * Math.sin(this.phase) * 0.5;

    if (mouse.down) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d2 = 1 + Math.max(0.001, Math.sqrt(dx * dx + dy * dy)) * 10000;
      this.vx += (dx / d2) * dt;
      this.vy += (dy / d2) * dt;
    }

    this.vx *= 0.96;
    this.vy *= 0.96;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.y > h + 30) {
      this.reset(w, h, false);
    }
    if (this.y < -60) {
      this.y = h + 30;
    }
    if (this.x < -60) this.x = w + 60;
    if (this.x > w + 60) this.x = -60;
  }
}

export class CodeCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  tokens: Token[] = [];
  mouse: MouseState = { x: 0, y: 0, down: false };
  _running = false;
  _reduced = false;
  _last = 0;
  _requestedAnimationFrameId: number | null = null;
  _resizeTimeout: number | undefined;
  width = 0;
  height = 0;

  constructor(public canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      console.warn("CodeCanvas: canvas element not defined");
      return;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      this._reduced = true;
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      console.warn("CodeCanvas: failed to get 2D context");
      return;
    }
    this.ctx = ctx;

    this.tokens = [];
    this.mouse = { x: 0, y: 0, down: false };

    this._onPointerMove = this._onPointerMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._loop = this._loop.bind(this);
    this._resizeSoon = this._resizeSoon.bind(this);

    this._setupListeners();
    this._resizeSoon();
  }

  _setupListeners() {
    const opts: AddEventListenerOptions = {
      passive: true,
    };

    window.addEventListener("pointermove", this._onPointerMove, opts);
    window.addEventListener("resize", this._onResize, opts);
    document.addEventListener(
      "visibilitychange",
      this._onVisibilityChange,
      opts,
    );
    window.addEventListener("mousedown", () => (this.mouse.down = true), opts);
    window.addEventListener("mouseup", () => (this.mouse.down = false), opts);
  }

  _onPointerMove(e: PointerEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  _onResize() {
    if (typeof window !== "undefined") {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = window.setTimeout(
        this._resizeSoon,
        RESIZE_DEBOUNCE_MS,
      );
    }
  }

  _onVisibilityChange() {
    if (document.hidden) this.stop();
    else this.start();
  }

  _resizeSoon() {
    const width = (this.width = window.innerWidth);
    const height = (this.height = window.innerHeight);

    const DPR = Math.max(1, window.devicePixelRatio || 1);
    if (!this.canvas || !this.ctx) return;

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.canvas.width = Math.round(width * DPR);
    this.canvas.height = Math.round(height * DPR);

    this.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    this.mouse.x = width / 2;
    this.mouse.y = height / 2;

    this._recomputeTokens(width, height);
  }

  _recomputeTokens(width: number, height: number) {
    const base = (width * height) / TOKEN_PER_PIXEL2;
    let count = Math.round(clamp(base, MIN_TOKEN_COUNT, MAX_TOKEN_COUNT));
    if (width < SMALL_SCREEN_MAX)
      count = Math.round(Math.max(14, count * SMALL_SCREEN_SCALE));

    this.tokens.forEach((t) => {
      t.x = clamp(t.x, 0, width);
      t.y = clamp(t.y, 0, height);
    });

    while (this.tokens.length < count)
      this.tokens.push(new Token(width, height));
    while (this.tokens.length > count) this.tokens.pop();
  }

  start() {
    if (this._reduced || this._running) return;
    this._running = true;
    this._last = performance.now();
    this._requestedAnimationFrameId = requestAnimationFrame(this._loop);
  }

  stop() {
    this._running = false;
    if (this._requestedAnimationFrameId)
      cancelAnimationFrame(this._requestedAnimationFrameId);
    this._requestedAnimationFrameId = null;
  }

  _loop(now: number) {
    if (!this._running) return;
    const dt = Math.min(40, now - this._last);
    this._last = now;

    this._update(dt);
    this._render();
    this._requestedAnimationFrameId = requestAnimationFrame(this._loop);
  }

  _update(dt: number) {
    for (const t of this.tokens)
      t.update(dt, this.width, this.height, this.mouse);
  }

  _render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    ctx.clearRect(0, 0, W, H);

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(126,227,255,0.01)");
    g.addColorStop(1, "rgba(255,143,191,0.01)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (const p of this.tokens) {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const d = Math.hypot(dx, dy);
      const near = Math.max(0, 1 - d / MOUSE_RADIUS);
      const alpha = Math.min(1, p.alpha + near * 0.9);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.sin(p.phase) * 0.06);

      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
      glow.addColorStop(0, `hsla(${p.hue},85%,60%,${alpha * 0.12})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${p.hue},85%,75%,${alpha})`;
      ctx.font = `${p.size}px "SF Mono", Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.glyph, 0, 0);

      ctx.restore();
    }

    for (let i = 0; i < 3; i++) {
      const x = i * 12 + 20;
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.cos(this._last / 1000 - i) / 10})`;
      ctx.fillRect(x, 20, 8, 8);
    }
  }
}
