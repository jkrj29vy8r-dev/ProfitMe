/* ============================================================================
   Stage — scroll storytelling, counters, theme, nav state
   ---------------------------------------------------------------------------
   Reveals are IntersectionObserver-driven and fire once. Groups cascade at
   --motion-stagger (40ms), matching the measured Apple/Rimac menu reveal.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- 1. Reveal on enter --------------------------------------------- */

  function initReveals() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal]")
    );
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var STAGGER = 40;

    var io = new IntersectionObserver(
      function (entries) {
        // Sort so a group entering together cascades top-to-bottom regardless
        // of the order the observer happens to report them in.
        entries
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return (
              a.boundingClientRect.top - b.boundingClientRect.top
            );
          })
          .forEach(function (entry, i) {
            var el = entry.target;
            var own = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
            el.style.setProperty(
              "--reveal-delay",
              (own || i * STAGGER) + "ms"
            );
            el.classList.add("is-revealed");
            io.unobserve(el);
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* --- 2. Counters ----------------------------------------------------- */
  /* Data animates to its value on mount, once. A later value change would
     tween from the current number, never re-grow from zero. */

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1100;

    if (reduceMotion.matches) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    var start = performance.now();

    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      // Matches --ease-entry: fast out of the gate, long settle.
      var eased = 1 - Math.pow(1 - p, 4);
      var value = target * eased;
      el.textContent =
        prefix +
        value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) +
        suffix;
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = Array.prototype.slice.call(
      document.querySelectorAll("[data-count]")
    );
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      io.observe(el);
    });
  }

  /* --- 3. Bars and rails grow to value --------------------------------- */

  function initGrowth() {
    var grows = Array.prototype.slice.call(
      document.querySelectorAll("[data-grow]")
    );
    if (!grows.length) return;

    if (!("IntersectionObserver" in window)) {
      grows.forEach(function (el) {
        el.style.setProperty("--grown", el.getAttribute("data-grow"));
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-grow-delay") || "0", 10);
          setTimeout(function () {
            el.style.setProperty("--grown", el.getAttribute("data-grow"));
          }, delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    grows.forEach(function (el) {
      io.observe(el);
    });
  }

  /* --- 4. Theme -------------------------------------------------------- */

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");
    var stored = null;

    try {
      stored = localStorage.getItem("profitme-theme");
    } catch (e) {
      /* storage unavailable — fall through to system preference */
    }

    var system = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

    root.setAttribute("data-theme", stored || system);

    if (!toggle) return;

    function sync() {
      var isLight = root.getAttribute("data-theme") === "light";
      toggle.setAttribute("aria-pressed", String(isLight));
      toggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
    }

    sync();

    toggle.addEventListener("click", function () {
      var next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("profitme-theme", next);
      } catch (e) {
        /* non-fatal */
      }
      sync();
    });
  }

  /* --- 5. Nav edge appears only once it floats above content ----------- */

  function initNav() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;

    var ticking = false;

    function update() {
      nav.classList.toggle("is-stuck", (window.scrollY || 0) > 8);
      ticking = false;
    }

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

    update();
  }

  function init() {
    initTheme();
    initNav();
    initReveals();
    initCounters();
    initGrowth();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
