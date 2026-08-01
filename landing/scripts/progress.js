/* ============================================================================
   Scroll progress indicator — driver
   ---------------------------------------------------------------------------
   Reads Lenis' already-smoothed scroll position and writes it straight to a
   transform. Deliberately NOT a ScrollTrigger scrub: Lenis smooths the scroll
   value, and a scrub would then smooth the smoothed value, so the bar would
   visibly trail the page. One smoothing pass, applied once, is what makes the
   fill feel locked to the content instead of lagging behind it.

   Writes go through gsap.quickSetter, which resolves the property once at
   setup and then does a bare style write per frame — no tween allocation, no
   per-frame property parsing.

   Fill and empty are the same mechanism: scaleX tracks progress, so scrolling
   up empties it with exactly the same smoothing that filled it.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var root = document.querySelector("[data-progress]");
    if (!root) return;

    var glow = root.querySelector(".progress__glow");
    var bar = root.querySelector(".progress__bar");
    var head = root.querySelector(".progress__head");
    if (!bar) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    var hasGsap = !!window.gsap;

    var setGlow = hasGsap ? gsap.quickSetter(glow, "scaleX") : null;
    var setBar = hasGsap ? gsap.quickSetter(bar, "scaleX") : null;
    var setHead = hasGsap ? gsap.quickSetter(head, "x", "px") : null;

    /* Smoothed velocity response. Raw velocity is spiky — a wheel notch
       produces a single large value — so it is eased toward, which turns the
       glow into a swell rather than a flicker. */
    var glowEased = 0;
    var lastProgress = -1;

    function apply(progress, velocity) {
      progress = Math.max(0, Math.min(1, progress || 0));

      /* Skip the write when nothing moved. On a still page this takes the
         indicator to zero cost. */
      if (Math.abs(progress - lastProgress) < 0.0002 && glowEased < 0.01) return;
      lastProgress = progress;

      if (setBar) {
        setBar(progress);
        if (setGlow) setGlow(progress);
      } else {
        bar.style.transform = "scaleX(" + progress + ")";
        if (glow) glow.style.transform = "scaleX(" + progress + ")";
      }

      if (head) {
        var x = progress * root.clientWidth;
        if (setHead) setHead(x);
        else head.style.transform = "translate3d(" + x + "px,0,0)";
      }

      if (reduce.matches) return;

      /* Map speed to atmosphere. The ceiling is low on purpose: the point is a
         subtle swell while moving, not a light show. */
      var speed = Math.min(Math.abs(velocity || 0) / 26, 1);
      glowEased += (speed - glowEased) * 0.12;

      root.style.setProperty(
        "--progress-glow",
        (0.3 + glowEased * 0.5).toFixed(3)
      );
      root.style.setProperty(
        "--progress-head",
        (progress > 0.004 ? 0.45 + glowEased * 0.55 : 0).toFixed(3)
      );
    }

    /* --- Source of truth ------------------------------------------------- */

    var lenis = window.__lenis;

    if (lenis && !reduce.matches) {
      /* Lenis reports progress and velocity together, already smoothed. */
      lenis.on("scroll", function (e) {
        apply(e.progress, e.velocity);
      });

      /* Keep easing the glow down after scrolling stops, so it settles rather
         than snapping off. Piggybacks the existing GSAP ticker — no second
         rAF loop. */
      if (hasGsap) {
        gsap.ticker.add(function () {
          if (glowEased > 0.002) {
            glowEased *= 0.92;
            root.style.setProperty(
              "--progress-glow",
              (0.3 + glowEased * 0.5).toFixed(3)
            );
          }
        });
      }

      apply(lenis.progress || 0, 0);
    } else {
      /* No Lenis (reduced motion, or scripts partially unavailable): read the
         native scroll position, coalesced into rAF so a fast wheel cannot
         queue more work than the display can show. */
      var ticking = false;

      var update = function () {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        apply(max > 0 ? (window.scrollY || 0) / max : 0, 0);
        ticking = false;
      };

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );

      window.addEventListener("resize", update, { passive: true });
      update();
    }

    /* The head is positioned in px, so a width change has to re-derive it. */
    window.addEventListener(
      "resize",
      function () {
        lastProgress = -1;
        apply(
          lenis
            ? lenis.progress || 0
            : (window.scrollY || 0) /
                Math.max(
                  1,
                  document.documentElement.scrollHeight -
                    document.documentElement.clientHeight
                ),
          0
        );
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
