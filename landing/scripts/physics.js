/* ============================================================================
   Floating field — motion
   ---------------------------------------------------------------------------
   Three forces, summed per object, written to CSS custom properties once per
   frame. Nothing here touches a layout property; the browser only ever sees a
   changed transform, so every object stays on the compositor.

     1. DRIFT    Two sine waves at incommensurable periods. Because the periods
                 never share a common multiple, the path never visibly repeats —
                 which is what separates "alive" from "looping GIF".
     2. POINTER  A critically-damped spring toward a pointer-derived target.
                 Damped, not eased: the object carries momentum and settles
                 without overshoot. This is the whole "luxurious" feel — an
                 ease() would arrive and stop dead.
     3. SCROLL   Depth-scaled parallax. Far objects move least.

   Deliberately NOT a rigid-body simulation: at these speeds collision response
   reads as jitter, which is the opposite of expensive.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function init() {
    var field = document.querySelector("[data-field]");
    if (!field) return;

    var nodes = Array.prototype.slice.call(
      field.querySelectorAll("[data-float]")
    );
    if (!nodes.length) return;

    // Depth → how strongly each force applies. One place to tune the whole feel.
    var DEPTH = {
      far: { drift: 0.55, pointer: 6, scroll: 0.04, rot: 0.5 },
      mid: { drift: 0.85, pointer: 14, scroll: 0.09, rot: 0.9 },
      near: { drift: 1.15, pointer: 26, scroll: 0.16, rot: 1.3 }
    };

    var objects = nodes.map(function (el, i) {
      var depth = el.getAttribute("data-depth") || "mid";
      var cfg = DEPTH[depth] || DEPTH.mid;

      return {
        el: el,
        cfg: cfg,
        // Amplitudes in px. Small — luxury motion is slow and short, not swoopy.
        ax: 10 + (i % 3) * 4,
        ay: 13 + (i % 4) * 4,
        // Periods in ms, intentionally non-harmonic so the sum never repeats.
        px: 11000 + i * 1370,
        py: 14500 + i * 1730,
        phase: i * 1.7,
        rotAmp: 1.6 + (i % 3) * 0.7,
        rotPeriod: 17000 + i * 2100,
        // Spring state for pointer response
        sx: 0,
        sy: 0,
        vx: 0,
        vy: 0
      };
    });

    // --- Pointer target (normalised -1..1 from viewport centre) ------------
    var pointerX = 0;
    var pointerY = 0;
    var hasPointer = window.matchMedia("(pointer: fine)").matches;

    if (hasPointer) {
      window.addEventListener(
        "pointermove",
        function (e) {
          pointerX = (e.clientX / window.innerWidth) * 2 - 1;
          pointerY = (e.clientY / window.innerHeight) * 2 - 1;
        },
        { passive: true }
      );
    }

    // --- Scroll offset, read once per frame rather than per event ---------
    var scrollY = window.scrollY || 0;
    window.addEventListener(
      "scroll",
      function () {
        scrollY = window.scrollY || 0;
      },
      { passive: true }
    );

    // Critically damped spring: no overshoot, settles smoothly.
    var STIFFNESS = 0.055;
    var DAMPING = 0.86;

    var running = true;
    var start = performance.now();

    function frame(now) {
      if (!running) return;
      var t = now - start;

      for (var i = 0; i < objects.length; i++) {
        var o = objects[i];
        var c = o.cfg;

        // 1. Drift
        var dx =
          Math.sin(t / o.px + o.phase) * o.ax * c.drift +
          Math.sin(t / (o.px * 0.41) + o.phase * 2) * o.ax * 0.28 * c.drift;
        var dy =
          Math.cos(t / o.py + o.phase) * o.ay * c.drift +
          Math.cos(t / (o.py * 0.37) + o.phase * 1.5) * o.ay * 0.24 * c.drift;

        // 2. Pointer spring
        var tx = pointerX * c.pointer;
        var ty = pointerY * c.pointer;
        o.vx = (o.vx + (tx - o.sx) * STIFFNESS) * DAMPING;
        o.vy = (o.vy + (ty - o.sy) * STIFFNESS) * DAMPING;
        o.sx += o.vx;
        o.sy += o.vy;

        // 3. Scroll parallax
        var sp = scrollY * c.scroll;

        var rot = Math.sin(t / o.rotPeriod + o.phase) * o.rotAmp * c.rot;

        o.el.style.setProperty("--tx", (dx + o.sx).toFixed(2) + "px");
        o.el.style.setProperty("--ty", (dy + o.sy - sp).toFixed(2) + "px");
        o.el.style.setProperty("--rot", rot.toFixed(2) + "deg");
      }

      requestAnimationFrame(frame);
    }

    // Pause entirely when the hero is off screen — no reason to burn frames
    // animating something nobody can see.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !running) {
              running = true;
              start = performance.now();
              requestAnimationFrame(frame);
            } else if (!entry.isIntersecting) {
              running = false;
            }
          });
        },
        { rootMargin: "120px" }
      );
      io.observe(field);
    }

    if (!reduceMotion.matches) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }

    // Honour a mid-session preference change rather than only reading at load.
    reduceMotion.addEventListener("change", function (e) {
      if (e.matches) {
        running = false;
        objects.forEach(function (o) {
          o.el.style.setProperty("--tx", "0px");
          o.el.style.setProperty("--ty", "0px");
          o.el.style.setProperty("--rot", "0deg");
        });
      } else {
        running = true;
        start = performance.now();
        requestAnimationFrame(frame);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
