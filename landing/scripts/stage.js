/* ============================================================================
   Stage — theme and nav only
   ---------------------------------------------------------------------------
   Everything scroll-driven moved to scroll.js when GSAP took over. This file
   deliberately owns no scroll behaviour: a second observer writing the same
   properties is what makes a smooth-scrolled page stutter.
   ========================================================================== */

(function () {
  "use strict";

  function initTheme() {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");

    if (!root.getAttribute("data-theme")) {
      var stored = null;
      try {
        stored = localStorage.getItem("profitme-theme");
      } catch (e) {
        /* storage unavailable */
      }
      root.setAttribute(
        "data-theme",
        stored ||
          (window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark")
      );
    }

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
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("profitme-theme", next);
      } catch (e) {
        /* non-fatal */
      }
      sync();
    });
  }

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

  /* In-page anchors have to be handed to Lenis, otherwise native smooth
     scrolling fights the smoothed scroll and the page jumps. */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { offset: -64, duration: 1.15 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  function init() {
    initTheme();
    initNav();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
