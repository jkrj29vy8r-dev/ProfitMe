/* ============================================================================
   Hero 3D scene — vanilla Three.js
   ---------------------------------------------------------------------------
   NOT React Three Fiber. R3F is a React reconciler; this page has no React
   anywhere, and bootstrapping React + ReactDOM + Three.js + the R3F runtime
   to mount one decorative background would cost roughly 3x this file's actual
   dependency (Three.js alone) for zero capability gain — R3F does not draw
   anything React itself can't already delegate straight to Three.js. If the
   product ever becomes a React app, this scene graph ports to R3F components
   near 1:1; nothing here is React-hostile, it's just not React-dependent.

   This file is an ES module, bundled + tree-shaken by esbuild into
   scripts/hero-scene.js (see build.py). Edit this file, not the built one.

   PERFORMANCE CONTRACT
   - No shadow maps, no post-processing, no env-map PBR — one directional key
     light + one hemisphere fill, MeshStandardMaterial kept cheap.
   - Every repeating group (chart bars) is merged into a single BufferGeometry:
     one draw call instead of N.
   - Particle field is one THREE.Points draw call regardless of count.
   - Devicelet ratio capped — GPU cost on retina displays is quadratic in
     pixel ratio, and this scene does not need retina sharpness to read as
     premium; it needs to hold frame rate.
   - The render loop is owned by requestAnimationFrame and stops completely
     (not throttled — CANCELLED) whenever the hero is off-screen or the tab
     is hidden. An WebGL context doing nothing still schedules work if the
     loop keeps calling itself; the loop itself has to stop.
   - Rotation is continuous but slow (40–140s per revolution) — "everything
     slowly rotates" taken literally, like a museum turntable, not a spin.
   ========================================================================== */

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function readTheme() {
  var s = getComputedStyle(document.documentElement);
  var get = function (name, fallback) {
    var v = s.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    accent: get("--accent", "#b3762c"),
    accentHover: get("--accent-hover", "#c98a3d"),
    bgPage: get("--bg-page", "#0f0d0a"),
    bgCard: get("--bg-card", "#1a1712"),
    positive: get("--positive", "#3aa876"),
    negative: get("--negative", "#e5484d"),
    textPrimary: get("--text-primary", "#f0ece4"),
    isLight: document.documentElement.getAttribute("data-theme") === "light"
  };
}

/* --- Small canvas-texture helpers ---------------------------------------- */
/* Every "screen" in the scene (coin face, invoice, KPI card) is a 2D canvas
   drawn once and mapped as a texture. This is dramatically cheaper than real
   3D text geometry (no font loading, no per-glyph triangles) and it is also
   how the coin/chip/doc language in the 2D hero (superseded by this scene)
   was authored — same visual vocabulary, now lit and rotating in real 3D. */

function makeCanvas(w, h) {
  var c = document.createElement("canvas");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = w * dpr;
  c.height = h * dpr;
  var ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  return { c: c, ctx: ctx, w: w, h: h };
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function coinFaceTexture(glyph, theme) {
  var s = makeCanvas(128, 128);
  var ctx = s.ctx;
  var cx = 64, cy = 64;

  var grad = ctx.createRadialGradient(cx - 16, cy - 20, 6, cx, cy, 70);
  if (theme.isLight) {
    grad.addColorStop(0, "rgba(255,244,232,0.95)");
    grad.addColorStop(0.55, "rgba(214,160,104,0.55)");
    grad.addColorStop(1, "rgba(120,74,32,0.35)");
  } else {
    grad.addColorStop(0, "rgba(230,180,130,0.55)");
    grad.addColorStop(0.55, "rgba(120,80,45,0.4)");
    grad.addColorStop(1, "rgba(30,20,12,0.5)");
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = theme.isLight
    ? "rgba(120,74,32,0.4)"
    : "rgba(230,180,130,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = theme.isLight ? "#5b3b1a" : "#f2ddb8";
  ctx.font = "600 46px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, cx, cy + 2);

  return new THREE.CanvasTexture(s.c);
}

function invoiceTexture(theme) {
  var s = makeCanvas(180, 220);
  var ctx = s.ctx;
  roundRectPath(ctx, 1, 1, 178, 218, 14);
  ctx.fillStyle = theme.isLight
    ? "rgba(255,255,255,0.92)"
    : "rgba(26,23,18,0.9)";
  ctx.fill();

  /* Directional light-catch wash — upper-left highlight fading to a soft
     lower-right falloff, baked into the texture rather than left flat. Coins
     already had this via coinFaceTexture's radial gradient; invoices and KPI
     cards didn't, which is why the scene's single key light visibly caught
     the coins but read as flat paper everywhere else (see design-system.md,
     Motion → 3D scenes). */
  ctx.save();
  roundRectPath(ctx, 1, 1, 178, 218, 14);
  ctx.clip();
  var wash = ctx.createLinearGradient(0, 0, 180, 220);
  wash.addColorStop(0, theme.isLight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)");
  wash.addColorStop(0.45, "rgba(255,255,255,0)");
  wash.addColorStop(1, theme.isLight ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.24)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 180, 220);
  ctx.restore();

  ctx.strokeStyle = theme.isLight
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.09)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = theme.accent;
  ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("INVOICE", 22, 34);

  ctx.strokeStyle = theme.isLight
    ? "rgba(20,20,20,0.28)"
    : "rgba(240,236,228,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(154, 30, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(150, 30);
  ctx.lineTo(153, 33);
  ctx.lineTo(159, 26);
  ctx.stroke();

  ctx.fillStyle = theme.isLight
    ? "rgba(20,20,20,0.14)"
    : "rgba(240,236,228,0.16)";
  var lines = [0.82, 0.6, 0.72, 0.42];
  lines.forEach(function (frac, i) {
    roundRectPath(ctx, 22, 62 + i * 20, 136 * frac, 6, 3);
    ctx.fill();
  });

  ctx.strokeStyle = theme.isLight
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.09)";
  ctx.beginPath();
  ctx.moveTo(22, 168);
  ctx.lineTo(158, 168);
  ctx.stroke();

  ctx.fillStyle = theme.isLight ? "#1a1712" : "#f0ece4";
  ctx.font = "600 15px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("€ 14,280", 22, 196);
  ctx.fillStyle = theme.isLight ? "rgba(0,0,0,0.45)" : "rgba(240,236,228,0.5)";
  ctx.font = "500 10px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("PAID", 158, 196);

  return new THREE.CanvasTexture(s.c);
}

function kpiTexture(label, value, deltaUp, theme) {
  var s = makeCanvas(220, 130);
  var ctx = s.ctx;
  roundRectPath(ctx, 1, 1, 218, 128, 14);
  ctx.fillStyle = theme.isLight
    ? "rgba(255,255,255,0.92)"
    : "rgba(26,23,18,0.9)";
  ctx.fill();

  /* Same light-catch wash as invoiceTexture — see the comment there. */
  ctx.save();
  roundRectPath(ctx, 1, 1, 218, 128, 14);
  ctx.clip();
  var wash = ctx.createLinearGradient(0, 0, 220, 130);
  wash.addColorStop(0, theme.isLight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)");
  wash.addColorStop(0.45, "rgba(255,255,255,0)");
  wash.addColorStop(1, theme.isLight ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.24)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 220, 130);
  ctx.restore();

  ctx.strokeStyle = theme.isLight
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.09)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = theme.isLight ? "rgba(0,0,0,0.42)" : "rgba(240,236,228,0.45)";
  ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.save();
  ctx.translate(22, 34);
  ctx.scale(1, 1);
  ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(label.toUpperCase(), 0, 0);
  ctx.restore();

  ctx.fillStyle = theme.isLight ? "#1a1712" : "#f5f1e8";
  ctx.font = "600 30px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(value, 22, 76);

  ctx.fillStyle = deltaUp ? theme.positive : theme.negative;
  ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText((deltaUp ? "▲ " : "▼ ") + (deltaUp ? "3.1%" : "0.8%"), 22, 100);

  var sparkX = 130,
    sparkW = 70,
    sparkY = 70;
  var pts = deltaUp
    ? [8, 14, 6, 18, 4, 22, 2, 26]
    : [4, 8, 10, 14, 18, 20, 24, 22];
  ctx.strokeStyle = deltaUp ? theme.positive : theme.negative;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach(function (v, i) {
    var x = sparkX + (i / (pts.length - 1)) * sparkW;
    var y = sparkY + (30 - v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  return new THREE.CanvasTexture(s.c);
}

/* --- Fullscreen gradient background --------------------------------------
   Two flat colour stops plus a slow vertical drift and one soft roving
   highlight. Analytic (no texture sampling, no loops) — cheap enough that
   full-hero fill rate is a non-issue even on integrated GPUs. */

var bgVertex =
  "varying vec2 vUv;\nvoid main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}";

var bgFragment =
  "precision mediump float;\n" +
  "varying vec2 vUv;\n" +
  "uniform vec3 uTop;\n" +
  "uniform vec3 uBottom;\n" +
  "uniform vec3 uGlow;\n" +
  "uniform float uTime;\n" +
  "uniform float uAspect;\n" +
  "void main(){\n" +
  "  float t = smoothstep(0.0, 1.0, vUv.y + sin(uTime*0.05)*0.03);\n" +
  "  vec3 col = mix(uBottom, uTop, t);\n" +
  "  vec2 p = vUv - vec2(0.5 + sin(uTime*0.045)*0.10, 0.82 + cos(uTime*0.037)*0.05);\n" +
  "  p.x *= uAspect;\n" +
  "  float d = length(p);\n" +
  /* This is the scene's one dominant light source — a single soft glow behind
     the headline, the pattern measured off Verdikt's dashboard hero and, now,
     the title-reveal glow in two of the references/animations clips
     (Anyflow's vortex mark, Dragonfly's wordmark). It replaces two separate
     light-beam planes that rendered at 12–16% opacity and read as functionally
     absent (design-system.md, Motion → 3D scenes flagged this as open). One
     stronger glow, in copper, is both cheaper (no extra draw calls) and closer
     to what every "premium lighting" reference in the library actually does. */
  "  float glow = smoothstep(0.7, 0.0, d) * 0.4;\n" +
  "  col += uGlow * glow;\n" +
  "  gl_FragColor = vec4(col, 1.0);\n" +
  "}";

/* --- Public init ----------------------------------------------------------
   Called once per page load. Returns nothing; the module manages its own
   lifecycle via IntersectionObserver + visibilitychange. */

function init() {
  var mount = document.querySelector("[data-hero-scene]");
  if (!mount) return;

  /* Below this width the hero already drops decorative depth (see hero.css
     — the type carries the section alone on narrow screens). A 3D scene is
     the most GPU/battery-expensive thing on the page; it has no business
     running on a phone showing a single-column hero. */
  if (window.innerWidth < 900) return;

  var canvas = document.createElement("canvas");
  canvas.className = "hero-scene__canvas";
  mount.appendChild(canvas);

  var gl;
  try {
    gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
  } catch (e) {
    gl = null;
  }
  if (!gl) {
    mount.removeChild(canvas);
    return; // No WebGL: the existing CSS grid/wash behind this element carries the hero alone.
  }

  var theme = readTheme();

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    /* Off deliberately. MSAA is close to free on real GPU hardware, but this
       scene's cost is being kept low enough to hold 60fps even on the kind
       of integrated/software rendering that has no fast path for it — and
       these are small decorative objects glimpsed while scrolling, not
       artwork examined up close, so the trade is a clear win. */
    antialias: false,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 13);

  /* --- Lighting: one key, one fill, both cheap -------------------------- */
  var key = new THREE.DirectionalLight(0xffffff, theme.isLight ? 1.1 : 1.4);
  key.position.set(4, 6, 8);
  scene.add(key);

  var fill = new THREE.HemisphereLight(
    theme.isLight ? 0xfff3e6 : 0x6b4a2a,
    theme.isLight ? 0x9c8060 : 0x0b0908,
    theme.isLight ? 0.55 : 0.7
  );
  scene.add(fill);

  /* --- Background quad ---------------------------------------------------
     Rendered in its own scene with a camera-independent full-screen
     triangle-pair, so it never needs to track the perspective camera. */
  var bgScene = new THREE.Scene();
  var bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var bgUniforms = {
    uTop: { value: new THREE.Color(theme.isLight ? 0xfaf3ea : 0x181310) },
    uBottom: { value: new THREE.Color(theme.isLight ? 0xf6ede0 : 0x0e0c0a) },
    uGlow: { value: new THREE.Color(theme.accent) },
    uTime: { value: 0 },
    uAspect: { value: 1 }
  };
  var bgMat = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    vertexShader: bgVertex,
    fragmentShader: bgFragment,
    depthWrite: false,
    depthTest: false
  });
  var bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgScene.add(bgQuad);

  /* --- Particles: one draw call regardless of count ---------------------- */
  var PARTICLE_COUNT = 100;
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var seeds = new Float32Array(PARTICLE_COUNT * 3); // per-particle phase/speed/scale
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    seeds[i * 3] = Math.random() * Math.PI * 2;
    seeds[i * 3 + 1] = 0.15 + Math.random() * 0.3;
    seeds[i * 3 + 2] = 0.5 + Math.random() * 1.2;
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var particleTex = (function () {
    var s = makeCanvas(32, 32);
    var g = s.ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    s.ctx.fillStyle = g;
    s.ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(s.c);
  })();
  var particleMat = new THREE.PointsMaterial({
    size: 0.055,
    map: particleTex,
    transparent: true,
    opacity: theme.isLight ? 0.5 : 0.65,
    color: new THREE.Color(theme.isLight ? 0x6b4a28 : 0xf0dcc0),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);
  var basePositions = positions.slice();

  /* --- Contact shadows: one soft dark decal per floater --------------------
     Every reference that reads as premium grounds its floating shapes with a
     shadow, even without a visible floor (Spline: a contact shadow under
     every shape; the logistics concept: a shadow under every tilted panel).
     A THREE.Sprite always faces the camera for free, so this is one cheap
     billboarded blob per object rather than a rotation-aware mesh — it
     follows the object's drift but, correctly, never spins with it. */
  var shadowTex = (function () {
    var s = makeCanvas(64, 64);
    var g = s.ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(0,0,0,0.6)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    s.ctx.fillStyle = g;
    s.ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(s.c);
  })();
  var shadowSprites = [];

  /* --- Floating objects group ---------------------------------------------
     Positioned in screen-fraction space, not raw world coordinates — this
     is the fix for a real bug the first render caught: a fixed world-space X
     lands at a wildly different screen position depending on how deep (z)
     the object sits, because perspective shrinks apparent lateral offset
     with distance. Every floater is defined as (xFrac, yFrac, z), where
     xFrac/yFrac are -1..1 across the visible frustum AT THAT OBJECT'S DEPTH,
     and converted to world x/y through the camera's actual FOV and aspect.
     That is the same "keep it in the margins, out of the text column"
     discipline the 2D hero used with CSS percentages — ported to 3D.

     |xFrac| stays >= ~0.5 for every object so nothing enters the centred
     ~15ch headline column even at the narrowest width this scene runs at
     (900px, where hero-scene bails out below). Recomputed on resize, since
     aspect changes what a given xFrac maps to in world units. */

  function screenToWorld(xFrac, yFrac, z) {
    var distance = camera.position.z - z;
    var vFov = (camera.fov * Math.PI) / 180;
    var halfH = Math.tan(vFov / 2) * distance;
    var halfW = halfH * camera.aspect;
    return { x: xFrac * halfW, y: yFrac * halfH };
  }

  var floaters = [];

  function addFloater(mesh, opts) {
    var pos = screenToWorld(opts.xFrac, opts.yFrac, opts.z);
    mesh.position.set(pos.x, pos.y, opts.z);
    if (opts.tiltX) mesh.rotation.x = opts.tiltX;
    if (opts.tiltZ) mesh.rotation.z = opts.tiltZ;
    scene.add(mesh);

    var shadow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: shadowTex,
        color: 0x000000,
        transparent: true,
        opacity: theme.isLight ? 0.22 : 0.4,
        depthWrite: false
      })
    );
    var shadowScale = opts.shadowScale || 1.2;
    shadow.scale.set(shadowScale, shadowScale * 0.42, 1);
    scene.add(shadow);
    shadowSprites.push(shadow);

    floaters.push({
      mesh: mesh,
      shadow: shadow,
      xFrac: opts.xFrac,
      yFrac: opts.yFrac,
      z: opts.z,
      base: mesh.position.clone(),
      spinSpeed: (Math.PI * 2) / (opts.period || 70),
      spinAxis: opts.spinAxis || "y",
      driftAmp: opts.driftAmp || 0.22,
      driftPeriod: opts.driftPeriod || 9000 + Math.random() * 4000,
      phase: Math.random() * Math.PI * 2,
      depth: opts.depth || 1,
      shadowOffsetY: opts.shadowOffsetY != null ? opts.shadowOffsetY : -0.6,
      shadowOffsetZ: opts.shadowOffsetZ != null ? opts.shadowOffsetZ : -0.3
    });
  }

  /* Recomputes every floater's base position for the current camera aspect.
     Called once after all floaters are added (aspect is already correct by
     then) and again on every resize. */
  function relayoutFloaters() {
    floaters.forEach(function (f) {
      var pos = screenToWorld(f.xFrac, f.yFrac, f.z);
      f.base.set(pos.x, pos.y, f.z);
      f.shadow.position.set(
        pos.x,
        pos.y + f.shadowOffsetY,
        f.z + f.shadowOffsetZ
      );
    });
  }

  /* Coins — short cylinders so a real bevelled edge is visible at every
     rotation, unlike a flat disc which vanishes edge-on.

     Two, not three: the reference set's actual 3D-composition principle is
     fewer, larger, better-lit, grounded objects, not a dense field of small
     ones — confirmed again by Monolith and Drip, both of which compose
     around a single focal subject (design-system.md, Motion → 3D scenes).
     Nine floaters was already more than anything in the library; this pass
     trims to six rather than adding more. */
  [
    { glyph: "€", xFrac: -0.62, yFrac: 0.4, z: -1, r: 0.62, period: 58 },
    { glyph: "$", xFrac: 0.66, yFrac: 0.5, z: -2.2, r: 0.48, period: 74 }
  ].forEach(function (c) {
    var faceMap = coinFaceTexture(c.glyph, theme);
    var rimColor = new THREE.Color(theme.accent);
    var rimMat = new THREE.MeshStandardMaterial({
      color: rimColor,
      metalness: 0.55,
      roughness: 0.35
    });
    var faceMat = new THREE.MeshStandardMaterial({
      map: faceMap,
      metalness: 0.25,
      roughness: 0.4,
      transparent: true
    });
    var geo = new THREE.CylinderGeometry(c.r, c.r, c.r * 0.16, 28);
    var mesh = new THREE.Mesh(geo, [rimMat, faceMat, faceMat]);
    addFloater(mesh, {
      xFrac: c.xFrac,
      yFrac: c.yFrac,
      z: c.z,
      tiltX: 1.3,
      tiltZ: 0.15,
      period: c.period,
      driftAmp: 0.16,
      depth: 1.1,
      shadowScale: c.r * 2.1,
      shadowOffsetY: -0.45
    });
  });

  /* Documents — thin rounded cards, canvas-textured. One, not two, per the
     fewer-objects note above. */
  [{ xFrac: -0.82, yFrac: -0.48, z: -2.5, period: 110 }].forEach(function (d) {
    var tex = invoiceTexture(theme);
    var mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      metalness: 0.05,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.65), mat);
    addFloater(mesh, {
      xFrac: d.xFrac,
      yFrac: d.yFrac,
      z: d.z,
      tiltX: -0.12,
      tiltZ: 0.06,
      period: d.period,
      driftAmp: 0.14,
      depth: 0.85,
      shadowScale: 1.5,
      shadowOffsetY: -0.85
    });
  });

  /* Dashboard KPI card — same texture language as the 2D dashboard mock. One,
     not two, per the fewer-objects note above. */
  [
    { label: "Contribution", value: "€31.2k", up: false, xFrac: 0.72, yFrac: -0.2, z: -1.5, period: 88 }
  ].forEach(function (k) {
    var tex = kpiTexture(k.label, k.value, k.up, theme);
    var mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      metalness: 0.08,
      roughness: 0.65,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 0.98), mat);
    addFloater(mesh, {
      xFrac: k.xFrac,
      yFrac: k.yFrac,
      z: k.z,
      tiltX: 0.08,
      tiltZ: -0.04,
      period: k.period,
      driftAmp: 0.12,
      depth: 0.7,
      shadowScale: 1.7,
      shadowOffsetY: -0.55
    });
  });

  /* 3D bar chart — merged into one BufferGeometry: one draw call for the
     whole chart regardless of bar count. */
  (function () {
    var heights = [0.5, 0.85, 0.35, 1.15, 0.7, 1.4];
    var colors = [
      theme.accent, theme.accent, theme.negative,
      theme.accent, theme.positive, theme.accent
    ];
    var geos = [];
    heights.forEach(function (h, i) {
      var g = new THREE.BoxGeometry(0.26, h, 0.26);
      g.translate(i * 0.36 - (heights.length * 0.36) / 2, h / 2, 0);
      var vcol = new THREE.Color(colors[i]);
      var count = g.attributes.position.count;
      var carr = new Float32Array(count * 3);
      for (var v = 0; v < count; v++) {
        carr[v * 3] = vcol.r;
        carr[v * 3 + 1] = vcol.g;
        carr[v * 3 + 2] = vcol.b;
      }
      g.setAttribute("color", new THREE.BufferAttribute(carr, 3));
      geos.push(g);
    });
    var merged = mergeGeometries(geos, false);
    var mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.2,
      roughness: 0.5
    });
    var mesh = new THREE.Mesh(merged, mat);
    addFloater(mesh, {
      xFrac: -0.56,
      yFrac: -0.74,
      z: -0.9,
      tiltX: 0.22,
      period: 120,
      driftAmp: 0.1,
      depth: 1,
      shadowScale: 1.9,
      shadowOffsetY: -0.75
    });
  })();

  /* 3D line chart — a tube following a gentle rising curve. This is the one
     element that only makes sense as real 3D: an extruded ribbon with actual
     thickness and specular response as it turns, not a flat sparkline. */
  (function () {
    var pts = [
      new THREE.Vector3(-0.9, -0.25, 0),
      new THREE.Vector3(-0.5, -0.05, 0.12),
      new THREE.Vector3(-0.1, -0.15, -0.05),
      new THREE.Vector3(0.35, 0.2, 0.08),
      new THREE.Vector3(0.75, 0.45, 0)
    ];
    var curve = new THREE.CatmullRomCurve3(pts);
    var geo = new THREE.TubeGeometry(curve, 48, 0.028, 8, false);
    var mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(theme.accentHover),
      metalness: 0.4,
      roughness: 0.3,
      emissive: new THREE.Color(theme.accent),
      emissiveIntensity: 0.25
    });
    var mesh = new THREE.Mesh(geo, mat);
    addFloater(mesh, {
      xFrac: 0.58,
      yFrac: 0.7,
      z: -1.0,
      tiltX: -0.1,
      period: 84,
      driftAmp: 0.15,
      depth: 1.05,
      shadowScale: 1.4,
      shadowOffsetY: -0.4
    });
  })();

  /* All floaters are positioned relative to the camera's aspect at the
     moment each was added — refresh once now that the full set exists and
     the camera has its final startup aspect (resize() below keeps this in
     sync afterward). */
  relayoutFloaters();

  /* --- Pointer parallax: damped spring on the camera, small amplitude ----
     Same critically-damped approach as the retired 2D field's pointer
     response, applied to the camera instead of DOM transforms. */
  var pointerX = 0,
    pointerY = 0;
  var camSX = 0,
    camSY = 0,
    camVX = 0,
    camVY = 0;
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      function (e) {
        var r = mount.getBoundingClientRect();
        pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
      },
      { passive: true }
    );
  }

  /* --- Scroll fade: recede as the hero leaves, and STOP once invisible ----
     The IntersectionObserver below only reports "not intersecting" once the
     mount is ~99% scrolled past, which is well after this fade has already
     reached zero — meaning the render loop was measured to keep costing a
     full WebGL frame for a stretch of scroll where the canvas was already
     invisible, overlapping with the reveal-heavy sections right below the
     hero and dragging the whole page's frame time down. Tying stop()/start()
     to the fade itself, not just the observer, closes that gap. */
  var scrollFade = 1;
  function updateScrollFade() {
    var r = mount.getBoundingClientRect();
    var vh = window.innerHeight;
    var past = Math.max(0, -r.top);
    scrollFade = Math.max(0, 1 - past / (vh * 0.45));
    if (scrollFade <= 0.002) stop();
    else if (!document.hidden) start();
  }
  /* Lenis, when present, is the single source of truth for scroll position
     everywhere else on this page (see progress.js) — attaching the native
     event too would run this twice per frame for no benefit. */
  if (window.__lenis) {
    window.__lenis.on("scroll", updateScrollFade);
  } else {
    window.addEventListener("scroll", updateScrollFade, { passive: true });
  }

  /* --- Resize -------------------------------------------------------------- */
  function resize() {
    var r = mount.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    bgUniforms.uAspect.value = r.width / r.height;
    /* Aspect just changed, which changes what each floater's fixed xFrac/
       yFrac maps to in world space — recompute so the margin discipline
       holds at every width, not just the one the scene happened to init at. */
    relayoutFloaters();
  }
  var resizeTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    },
    { passive: true }
  );
  resize();

  /* --- Theme reactivity -----------------------------------------------------
     The scene is not rebuilt on a theme flip — only the colours it already
     reads from CSS custom properties are refreshed on the existing
     materials/uniforms. Geometry, positions and the running clock are
     untouched. */
  new MutationObserver(function () {
    theme = readTheme();
    bgUniforms.uTop.value.set(theme.isLight ? 0xfaf3ea : 0x181310);
    bgUniforms.uBottom.value.set(theme.isLight ? 0xf6ede0 : 0x0e0c0a);
    bgUniforms.uGlow.value.set(theme.accent);
    particleMat.color.set(theme.isLight ? 0x6b4a28 : 0xf0dcc0);
    particleMat.opacity = theme.isLight ? 0.5 : 0.65;
    fill.color.set(theme.isLight ? 0xfff3e6 : 0x6b4a2a);
    fill.groundColor.set(theme.isLight ? 0x9c8060 : 0x0b0908);
    fill.intensity = theme.isLight ? 0.55 : 0.7;
    key.intensity = theme.isLight ? 1.1 : 1.4;
    shadowSprites.forEach(function (s) {
      s.material.opacity = theme.isLight ? 0.22 : 0.4;
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  /* --- Render loop, gated on visibility ------------------------------------ */
  var running = false;
  var rafId = null;
  var startTime = performance.now();
  var frameCount = 0;

  /* Debug/introspection hook, same pattern as window.__lenis — lets other
     code (or a test) confirm the loop actually starts and stops rather than
     assuming it from the outside. */
  window.__heroScene = {
    get running() { return running; },
    get frameCount() { return frameCount; }
  };

  function renderStaticFrame() {
    bgUniforms.uTime.value = 0;
    renderer.autoClear = true;
    renderer.render(bgScene, bgCamera);
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = true;
  }

  function frame(now) {
    if (!running) return;
    frameCount++;
    var t = (now - startTime) / 1000;

    bgUniforms.uTime.value = t;

    camVX = (camVX + (pointerX * 0.4 - camSX) * 0.05) * 0.85;
    camVY = (camVY + (-pointerY * 0.25 - camSY) * 0.05) * 0.85;
    camSX += camVX;
    camSY += camVY;
    camera.position.x = camSX;
    camera.position.y = camSY;
    camera.lookAt(0, 0, 0);

    floaters.forEach(function (f) {
      f.mesh.rotation[f.spinAxis] += f.spinSpeed * (1 / 60);
      var driftT = (now / f.driftPeriod) * Math.PI * 2 + f.phase;
      f.mesh.position.x = f.base.x + Math.sin(driftT) * f.driftAmp;
      f.mesh.position.y =
        f.base.y + Math.cos(driftT * 0.8) * f.driftAmp * 0.8;
      /* The shadow tracks the object's drift but, correctly, never its
         spin — a sprite always faces the camera, so it doesn't need to. */
      f.shadow.position.x = f.mesh.position.x;
      f.shadow.position.y = f.mesh.position.y + f.shadowOffsetY;
    });

    var pa = particleGeo.attributes.position.array;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var sx = seeds[i * 3],
        freq = seeds[i * 3 + 1],
        amp = seeds[i * 3 + 2];
      pa[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t * freq + sx) * amp * 0.12;
      pa[i * 3] = basePositions[i * 3] + Math.cos(t * freq * 0.7 + sx) * amp * 0.08;
    }
    particleGeo.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.00025;

    canvas.style.opacity = String(scrollFade);

    renderer.autoClear = true;
    renderer.render(bgScene, bgCamera);
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = true;

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (reduceMotion.matches) {
    renderStaticFrame();
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !document.hidden) start();
            else stop();
          });
        },
        { threshold: 0.01 }
      ).observe(mount);
    } else {
      start();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (mount.getBoundingClientRect().bottom > 0) start();
    });
  }

  reduceMotion.addEventListener("change", function (e) {
    if (e.matches) {
      stop();
      renderStaticFrame();
    } else {
      start();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
