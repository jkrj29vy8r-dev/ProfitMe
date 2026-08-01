/* ============================================================================
   Scroll choreography — Lenis + GSAP ScrollTrigger
   ---------------------------------------------------------------------------
   One scroll system owns the whole page. The previous IntersectionObserver
   reveals were removed rather than left running alongside: two systems writing
   the same properties is the classic source of scroll jank.

   PERFORMANCE CONTRACT
   Scrubbed (scroll-synchronised) animations touch transform and opacity only.
   Those composite on the GPU, so a scrubbed timeline costs no layout and no
   repaint per frame.

   Blur is handled deliberately, because animated `filter: blur()` forces a
   re-rasterisation every frame and is the single easiest way to lose 60fps on
   a scroll-linked page:
     - Scrubbed large surfaces      → never blurred.
     - Small elements (words, cards)→ blurred on a short *timed* tween, so it
                                      rasterises for a handful of frames and
                                      then stops.
     - Depth layers                 → blurred *statically*. A constant filter
                                      rasterises once into its layer, after
                                      which the layer is only transformed —
                                      free to animate.
   This is the design system's rule ("never blur a large surface that animates
   or scroll-links") applied literally.
   ========================================================================== */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    /* --- Reduced motion: no smoothing, no scrubbing, final states --------
       The page must still be fully readable, so everything is set to its
       resting value rather than left mid-animation. */
    if (reduce.matches) {
      restAll();
      return;
    }

    /* --- 1. Lenis ------------------------------------------------------- */
    /* lerp is the whole "weight" of the page. 0.085 gives the heavy, slightly
       trailing glide that reads as expensive; higher feels twitchy, lower
       feels broken. touchMultiplier stays near 1 so touch never feels laggy —
       smoothing a touch drag is what makes smooth-scroll libraries feel wrong
       on phones. */
    var lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      smoothWheel: true
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    /* Drive Lenis from GSAP's ticker so there is exactly ONE rAF loop
       coordinating both libraries. Two independent loops is how scroll
       positions end up a frame apart and edges shimmer. */
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* --- 1b. Hero intro -------------------------------------------------- */
    /* The one sequence that plays on load rather than on scroll. It is
       choreographed against the headline's word cascade so the sub-copy and
       CTAs arrive as the last words land, not on top of them. */
    var heroBits = document.querySelectorAll("[data-hero-in]");
    if (heroBits.length) {
      gsap.set(heroBits, { y: 22, opacity: 0 });
      gsap.to(heroBits, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.45
      });
    }

    /* --- 2. Text reveal ------------------------------------------------- */
    /* Words rise, unblur and fade in on a stagger. Blur here is a timed tween
       on small inline elements — cheap, and it is what gives the type the
       "resolving into focus" quality rather than a flat fade. */
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var words = splitWords(el);
      if (!words.length) return;

      gsap.set(words, { yPercent: 118, opacity: 0, filter: "blur(9px)" });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "expo.out",
            stagger: 0.045,
            onComplete: function () {
              /* Drop the filter entirely once settled. Leaving a blur(0px)
                 on the element keeps it on a rasterised layer for the rest
                 of the session for no benefit. */
              gsap.set(words, { filter: "none", willChange: "auto" });
            }
          });
        }
      });
    });

    /* --- 3. Progressive reveal: fade / scale / rotation ----------------- */
    /* Grouped by container so siblings cascade rather than each element
       firing independently — the 40ms cascade from the design system, scaled
       up slightly here because these are larger objects than menu rows. */
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      var kids = group.querySelectorAll("[data-reveal-item]");
      if (!kids.length) return;

      gsap.set(kids, { y: 34, opacity: 0, scale: 0.985 });

      ScrollTrigger.create({
        trigger: group,
        start: "top 82%",
        once: true,
        onEnter: function () {
          gsap.to(kids, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: "expo.out",
            stagger: 0.075
          });
        }
      });
    });

    /* --- 4. Cards reveal: adds rotation + a short blur ------------------ */
    document.querySelectorAll("[data-cards]").forEach(function (group) {
      var cards = group.querySelectorAll("[data-card]");
      if (!cards.length) return;

      gsap.set(cards, {
        y: 56,
        opacity: 0,
        scale: 0.94,
        rotateX: 7,
        filter: "blur(7px)",
        transformPerspective: 1000
      });

      ScrollTrigger.create({
        trigger: group,
        start: "top 80%",
        once: true,
        onEnter: function () {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            onComplete: function () {
              gsap.set(cards, { filter: "none", willChange: "auto" });
            }
          });
        }
      });
    });

    document.querySelectorAll("[data-card-solo]").forEach(function (card) {
      gsap.set(card, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        rotateY: -5,
        filter: "blur(8px)",
        transformPerspective: 1200
      });

      ScrollTrigger.create({
        trigger: card,
        start: "top 84%",
        once: true,
        onEnter: function () {
          gsap.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "expo.out",
            onComplete: function () {
              gsap.set(card, { filter: "none", willChange: "auto" });
            }
          });
        }
      });
    });

    /* --- 5. Sticky product reveal -------------------------------------- */
    /* The page's one pinned moment. The dashboard is held while it rotates
       up out of perspective and scales into place, scrubbed to scroll so the
       user is driving it frame by frame.

       No blur on this timeline: the frame is the largest element on the page,
       and blurring it while scrubbing is exactly the thing that would cost
       the frame budget. Depth is carried by rotateX and scale instead. */
    var stage = document.querySelector("[data-pin-stage]");
    var frame = document.querySelector("[data-pin-frame]");
    var stageHead = document.querySelector("[data-pin-head]");

    if (stage && frame && window.innerWidth >= 900) {
      gsap.set(frame, { transformPerspective: 1400, transformOrigin: "50% 100%" });

      var pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=90%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1
        }
      });

      pinTl
        .fromTo(
          frame,
          { scale: 0.84, rotateX: 15, y: 70, opacity: 0.55 },
          { scale: 1, rotateX: 0, y: 0, opacity: 1, ease: "none" },
          0
        )
        .fromTo(
          stageHead,
          { y: 0, opacity: 1 },
          { y: -70, opacity: 0.25, ease: "none" },
          0
        );
    } else if (frame) {
      gsap.set(frame, { opacity: 1 });
    }

    /* --- 6. Parallax + depth ------------------------------------------- */
    /* data-parallax is the movement in px across the element's scroll span.
       Larger value = nearer the viewer. Layers marked data-depth-blur carry a
       *static* blur, which rasterises once and then only transforms. */
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var dist = parseFloat(el.getAttribute("data-parallax")) || 60;
      gsap.fromTo(
        el,
        { y: dist },
        {
          y: -dist,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-parallax-scope]") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
          }
        }
      );
    });

    /* --- 7. Chart reveal, scrubbed -------------------------------------- */
    /* The line draws under the user's thumb rather than on a fixed timer, so
       the chart is genuinely synchronised with scroll position. */
    document.querySelectorAll("[data-draw]").forEach(function (path) {
      var len = path.getTotalLength ? path.getTotalLength() : 500;
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        opacity: 1
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: path.closest("[data-draw-scope]") || path,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.4
        }
      });
    });

    document.querySelectorAll("[data-draw-dot]").forEach(function (dot) {
      gsap.fromTo(
        dot,
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          ease: "back.out(2)",
          duration: 0.5,
          scrollTrigger: {
            trigger: dot.closest("[data-draw-scope]") || dot,
            start: "bottom 66%",
            once: true
          }
        }
      );
    });

    /* --- 8. Bars and rails grow, scrubbed ------------------------------- */
    document.querySelectorAll("[data-grow]").forEach(function (el) {
      var to = el.getAttribute("data-grow");
      gsap.fromTo(
        el,
        { width: "0%" },
        {
          width: to,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-grow-scope]") || el,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5
          }
        }
      );
    });

    document.querySelectorAll("[data-grow-h]").forEach(function (el) {
      var to = el.getAttribute("data-grow-h");
      gsap.fromTo(
        el,
        { height: "0%" },
        {
          height: to,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-grow-scope]") || el,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5
          }
        }
      );
    });

    /* --- 9. Counters ---------------------------------------------------- */
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var obj = { v: 0 };

      gsap.to(obj, {
        v: target,
        ease: "power3.out",
        duration: 1.4,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: function () {
          el.textContent =
            prefix +
            obj.v.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            }) +
            suffix;
        }
      });
    });

    /* --- 10. Section exit: fade + scale + blur --------------------------- */
    /* Sections recede slightly as they leave, which is what gives a long page
       the layered, receding-into-depth quality rather than a flat conveyor.
       Scale and opacity only — scrubbed, so no blur here. */
    document.querySelectorAll("[data-recede]").forEach(function (el) {
      gsap.to(el, {
        scale: 0.965,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "bottom 62%",
          end: "bottom 12%",
          scrub: 0.5
        }
      });
    });

    ScrollTrigger.refresh();

    /* Re-measure once webfonts and images settle, otherwise pinned distances
       are computed against the wrong layout. */
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  }

  /* --- Helpers ---------------------------------------------------------- */

  /* Wrap each word in a span while preserving inline markup (the accent <em>
     inside the hero headline has to survive the split). Word spans sit inside
     a clipping wrapper so the rise reads as a mask rather than a slide. */
  function splitWords(root) {
    var spans = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (!chunk.trim()) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        var clip = document.createElement("span");
        clip.className = "sw-clip";
        var word = document.createElement("span");
        word.className = "sw";
        word.textContent = chunk;
        clip.appendChild(word);
        frag.appendChild(clip);
        spans.push(word);
      });
      node.parentNode.replaceChild(frag, node);
    });

    return spans;
  }

  /* Everything at rest, for reduced-motion users. */
  function restAll() {
    document
      .querySelectorAll(
        "[data-reveal-item], [data-card], [data-card-solo], [data-pin-frame], [data-hero-in], .sw"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    document.querySelectorAll("[data-draw]").forEach(function (p) {
      p.style.strokeDasharray = "none";
      p.style.strokeDashoffset = "0";
    });
    document.querySelectorAll("[data-grow]").forEach(function (el) {
      el.style.width = el.getAttribute("data-grow");
    });
    document.querySelectorAll("[data-grow-h]").forEach(function (el) {
      el.style.height = el.getAttribute("data-grow-h");
    });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var t = parseFloat(el.getAttribute("data-count"));
      var d = parseInt(el.getAttribute("data-decimals") || "0", 10);
      el.textContent =
        (el.getAttribute("data-prefix") || "") +
        t.toLocaleString(undefined, {
          minimumFractionDigits: d,
          maximumFractionDigits: d
        }) +
        (el.getAttribute("data-suffix") || "");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
