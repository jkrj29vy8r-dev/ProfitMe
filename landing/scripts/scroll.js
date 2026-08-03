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
       "resolving into focus" quality rather than a flat fade.

       A copper afterimage trails each word and dissolves before the word
       settles — measured off two clips in references/animations/ (Monolith's
       "MEET THE ARTIST", Dragonfly's company list), both of which resolve
       kinetic type from a duplicated/ghost stack rather than a plain rise.
       Layered on top of the existing reveal, not a replacement for it: same
       transform/opacity-only budget, same once-per-element trigger. */
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var split = splitWords(el);
      var words = split.words;
      var ghosts = split.ghosts;
      if (!words.length) return;

      gsap.set(words, { yPercent: 118, opacity: 0, filter: "blur(9px)" });
      gsap.set(ghosts, { yPercent: 150, opacity: 0 });

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
          gsap.to(ghosts, {
            yPercent: 0,
            opacity: 0.4,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.045,
            delay: 0.08
          });
          gsap.to(ghosts, {
            opacity: 0,
            duration: 0.45,
            ease: "power1.in",
            stagger: 0.045,
            delay: 0.42,
            onComplete: function () {
              gsap.set(ghosts, { willChange: "auto" });
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

      /* Icon strokes draw in just after the card settles, reusing the same
         getTotalLength/strokeDashoffset technique already proven on the
         product-reveal chart (#7 below) — timed, not scrubbed, since these
         are small one-shot elements rather than a scroll-linked surface.
         Extracted from Drip's icon-assembles-with-the-stat clip in
         references/animations/. */
      var icons = group.querySelectorAll("[data-icon-draw]");
      icons.forEach(function (shape) {
        var len = shape.getTotalLength ? shape.getTotalLength() : 60;
        gsap.set(shape, { strokeDasharray: len, strokeDashoffset: len });
      });

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
            /* Arrival with a small overshoot — the card settles ~5% past its
               resting scale and comes back once. back.out(1.1) is the restrained
               end of the family; anything at 2+ crosses from weight into the
               cheap bounce the brief rules out. */
            ease: "back.out(1.1)",
            stagger: 0.09,
            onComplete: function () {
              /* Hand the element back to CSS. GSAP leaves an inline transform
                 behind when it finishes, and an inline transform beats the
                 stylesheet — leaving it would silently kill the .lift hover on
                 every card on the page. Entry belongs to GSAP, the resting and
                 hover states belong to CSS, and this is the handover. */
              gsap.set(cards, {
                filter: "none",
                clearProps: "transform,willChange"
              });
            }
          });
          if (icons.length) {
            gsap.to(icons, {
              strokeDashoffset: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.09,
              delay: 0.25
            });
          }
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
            ease: "back.out(1.1)",
            onComplete: function () {
              gsap.set(card, {
                filter: "none",
                clearProps: "transform,willChange"
              });
            }
          });
        }
      });
    });

    /* --- 5. Cinematic product reveal ------------------------------------ */
    /* The page's one pinned moment, and the only place a full sequence plays.
       Everything below is a POSITION ON ONE TIMELINE rather than a set of
       independent triggers — that is what makes it genuinely scroll-driven:
       scrub a single timeline and every beat is a function of scroll offset,
       so nothing can pop in on its own clock and scrubbing backwards runs the
       whole sequence in reverse.

       Beat order is not invented. The mid-load capture in
       references/dashboards/ shows a real dashboard part-way through loading:
       chrome, labels and headline numbers are already painted, while the area
       chart, the progress bars and the activity list are still absent. So:
       shell first, numbers second, charts and rows last, assistant last of
       all. That is also the design system's "a dashboard assembles rather
       than switching on", with the ordering filled in from evidence.

       PERFORMANCE
       The lid carries the entire dashboard subtree and rotates for the whole
       scrub, so nothing inside it may animate a filter, and nothing inside it
       samples a backdrop. Beats are transform/opacity, plus two SVG geometry
       properties (strokeDashoffset, width) that are cheap on elements this
       small. */
    var stage = document.querySelector("[data-pin-stage]");
    var stageHead = document.querySelector("[data-pin-head]");
    var rig = document.querySelector("[data-rig]");
    var rigScale = document.querySelector("[data-rig-scale]");
    var laptop = document.querySelector("[data-laptop]");
    var lid = document.querySelector("[data-laptop-lid]");

    var LID_W = 1000;
    var LID_H = 625;

    /* The rig is laid out at a fixed design size, then scaled to the space
       actually available — width-bound on narrow desktops, height-bound on
       short ones, whichever bites first, so the laptop is never taller than
       the viewport it is pinned inside. */
    function fitRig() {
      if (!rig || !rigScale || window.innerWidth < 900) return;
      var byWidth = rig.clientWidth / LID_W;
      /* The lid is not the only thing on the pinned stage — the head sits
         above it and the deck reads below it — so the height budget is well
         under the full viewport. 0.58 keeps the whole machine, including the
         open-lid silhouette, inside a 900px-tall window. */
      var byHeight = (window.innerHeight * 0.58) / LID_H;
      var s = Math.min(byWidth, byHeight, 1);
      rigScale.style.setProperty("--rig-scale", s.toFixed(4));
      rigScale.style.setProperty("--rig-height", Math.round(LID_H * s) + "px");
    }

    if (stage && laptop && lid && window.innerWidth >= 900) {
      fitRig();
      window.addEventListener(
        "resize",
        function () {
          fitRig();
        },
        { passive: true }
      );

      var kpis = stage.querySelectorAll("[data-rig-kpi]");
      var rows = stage.querySelectorAll("[data-rig-row]");
      var chrome = stage.querySelector("[data-rig-chrome]");
      var area = stage.querySelector("[data-rig-area]");
      var line = stage.querySelector("[data-rig-draw]");
      var dot = stage.querySelector("[data-rig-dot]");
      var ai = stage.querySelector("[data-ai]");
      var aiUser = stage.querySelector("[data-ai-user]");
      var aiThinking = stage.querySelector("[data-ai-thinking]");
      var aiAnswer = stage.querySelector("[data-ai-answer]");

      var lit = stage.querySelector("[data-laptop-lit]");
      var glare = stage.querySelector("[data-laptop-glare]");

      /* Resting states — everything absent, lid shut, screen dark. */
      gsap.set(laptop, { rotateX: 18 });
      gsap.set(lid, { rotateX: -90 });
      gsap.set(lit, { opacity: 0 });
      gsap.set(glare, { opacity: 1 });
      gsap.set(chrome, { opacity: 0, y: 10 });
      gsap.set(kpis, { opacity: 0, y: 14 });
      gsap.set(".dash__panels", { opacity: 0 });
      gsap.set(rows, { opacity: 0, x: -8 });
      gsap.set(area, { opacity: 0 });
      gsap.set(dot, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(ai, { opacity: 0, y: 34 });
      gsap.set([aiUser, aiThinking, aiAnswer], { opacity: 0, y: 8 });

      var lineLen = line && line.getTotalLength ? line.getTotalLength() : 900;
      gsap.set(line, { strokeDasharray: lineLen, strokeDashoffset: lineLen });

      stage.querySelectorAll("[data-rig-grow]").forEach(function (el) {
        gsap.set(el, { width: "0%" });
      });

      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          /* Long enough that six beats each get real scroll distance. Too
             short and the sequence reads as one blurred event. */
          end: "+=260%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      /* Beat 1 — the machine turns to face you and opens. */
      /* The head clears out completely rather than lingering at low opacity:
         it is positioned over the stage, so any residue sits on top of the
         screen once the lid is upright. */
      tl.to(stageHead, { y: -60, opacity: 0, duration: 0.13 }, 0)
        .to(laptop, { rotateX: 3, duration: 0.34 }, 0)
        .to(lid, { rotateX: 0, duration: 0.3 }, 0.02)

        /* Beat 2 — the panel lights before anything is drawn on it. */
        .to(lit, { opacity: 1, duration: 0.14 }, 0.16)
        .to(glare, { opacity: 0.3, duration: 0.14 }, 0.16)

        /* Beat 3 — chrome and labels, the first thing painted in the
           reference's mid-load frame. */
        .to(chrome, { opacity: 1, y: 0, duration: 0.08 }, 0.24)

        /* Beat 4 — KPI tiles cascade, numbers running as they arrive. */
        .to(
          kpis,
          { opacity: 1, y: 0, duration: 0.1, stagger: 0.035 },
          0.3
        )

        /* Beat 5 — charts and rows, last to resolve. The line draws under
           the user's own scroll rather than on a timer. */
        .to(".dash__panels", { opacity: 1, duration: 0.06 }, 0.42)
        .to(line, { strokeDashoffset: 0, duration: 0.22 }, 0.44)
        .to(area, { opacity: 1, duration: 0.16 }, 0.5)
        .to(dot, { scale: 1, duration: 0.05, ease: "back.out(1.1)" }, 0.65)
        .to(rows, { opacity: 1, x: 0, duration: 0.08, stagger: 0.03 }, 0.46)

        /* Beat 6 — the assistant arrives, asks, thinks, answers. The hold is
           a designed state, and it crossfades out under the answer rather
           than clearing first. */
        .to(ai, { opacity: 1, y: 0, duration: 0.1 }, 0.6)
        .to(aiUser, { opacity: 1, y: 0, duration: 0.05 }, 0.67)
        .to(aiThinking, { opacity: 1, y: 0, duration: 0.04 }, 0.73)
        /* Overlapping crossfade — the hold is still fading as the answer
           arrives, never a blank gap between the two. */
        .to(aiThinking, { opacity: 0, duration: 0.05 }, 0.82)
        .to(aiAnswer, { opacity: 1, y: 0, duration: 0.06 }, 0.81);
      /* 0.87 → 1.00 is deliberate hold: the finished screen sits still for a
         beat before the pin releases, so the sequence has an ending rather
         than just stopping. */

      /* Counters ride the same timeline, so the numbers are literally a
         function of scroll position. */
      stage.querySelectorAll("[data-rig-count]").forEach(function (el, i) {
        var target = parseFloat(el.getAttribute("data-rig-count"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var obj = { v: 0 };
        tl.to(
          obj,
          {
            v: target,
            duration: 0.16,
            onUpdate: function () {
              el.textContent =
                prefix +
                obj.v.toLocaleString(undefined, {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals
                }) +
                suffix;
            }
          },
          0.32 + i * 0.035
        );
      });

      /* Bars grow in the same late window as the chart. */
      stage.querySelectorAll("[data-rig-grow]").forEach(function (el, i) {
        tl.to(
          el,
          { width: el.getAttribute("data-rig-grow"), duration: 0.14 },
          0.48 + i * 0.03
        );
      });

      window.addEventListener("load", fitRig);
    } else {
      /* Narrow screens: no pin, no laptop, no sequence. The dashboard is a
         plain panel and its contents reveal with the same patterns the rest
         of the page uses, so nothing is stuck invisible. */
      restRig(true);
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

    /* The generic [data-draw] / [data-draw-dot] scrubbed-chart handlers were
       removed on 2026-08-03: nothing in the page used them. The product-reveal
       chart draws through the pinned timeline's own [data-rig-draw] beat, and
       restRig() covers the unpinned path. Two dead querySelectorAll sweeps at
       init, plus a third in restAll(), were the only thing they did. */

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
     a clipping wrapper so the rise reads as a mask rather than a slide.

     Each clip also gets a "ghost" twin — the same text, absolutely
     positioned over the live word — which the reveal briefly shows and
     dissolves as the copper afterimage described above. It carries no
     layout weight (position: absolute) so it never changes how the words
     wrap. */
  function splitWords(root) {
    var words = [];
    var ghosts = [];
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
        var ghost = document.createElement("span");
        ghost.className = "sw-ghost";
        ghost.textContent = chunk;
        ghost.setAttribute("aria-hidden", "true");
        clip.appendChild(word);
        clip.appendChild(ghost);
        frag.appendChild(clip);
        words.push(word);
        ghosts.push(ghost);
      });
      node.parentNode.replaceChild(frag, node);
    });

    return { words: words, ghosts: ghosts };
  }

  /* The reveal rig outside its cinematic path.
     `animate` true  → narrow screens: no pin and no laptop, but the contents
                       still reveal on scroll like every other section.
     `animate` false → reduced motion: everything already at its final value. */
  function restRig(animate) {
    var stage = document.querySelector("[data-pin-stage]");
    if (!stage) return;

    var statics = stage.querySelectorAll(
      "[data-rig-chrome], [data-rig-kpi], [data-rig-row], [data-ai], [data-ai-user], [data-ai-answer], .dash__panels, [data-rig-area]"
    );
    statics.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });

    /* The hold has nothing to hold for once the answer is already there. */
    var thinking = stage.querySelector("[data-ai-thinking]");
    if (thinking) thinking.style.display = "none";

    var line = stage.querySelector("[data-rig-draw]");
    var dot = stage.querySelector("[data-rig-dot]");
    var bars = stage.querySelectorAll("[data-rig-grow]");
    var counts = stage.querySelectorAll("[data-rig-count]");

    function settle() {
      if (line) {
        line.style.strokeDasharray = "none";
        line.style.strokeDashoffset = "0";
      }
      if (dot) dot.style.transform = "none";
      bars.forEach(function (el) {
        el.style.width = el.getAttribute("data-rig-grow");
      });
      counts.forEach(function (el) {
        writeCount(el, parseFloat(el.getAttribute("data-rig-count")));
      });
    }

    if (!animate || !window.gsap) {
      settle();
      return;
    }

    if (line) {
      var len = line.getTotalLength ? line.getTotalLength() : 900;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: line.closest(".panel--chart") || line,
          start: "top 82%",
          end: "bottom 60%",
          scrub: 0.4
        }
      });
    }

    if (dot) {
      gsap.fromTo(
        dot,
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.1)",
          scrollTrigger: {
            trigger: dot.closest(".panel--chart") || dot,
            start: "bottom 68%",
            once: true
          }
        }
      );
    }

    bars.forEach(function (el) {
      gsap.fromTo(
        el,
        { width: "0%" },
        {
          width: el.getAttribute("data-rig-grow"),
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".panel") || el,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5
          }
        }
      );
    });

    counts.forEach(function (el) {
      var obj = { v: 0 };
      gsap.to(obj, {
        v: parseFloat(el.getAttribute("data-rig-count")),
        ease: "power3.out",
        duration: 1.4,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () {
          writeCount(el, obj.v);
        }
      });
    });
  }

  /* Shared number formatter — the counters in the rig and the ones elsewhere
     on the page must format identically, so there is one implementation. */
  function writeCount(el, value) {
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    el.textContent =
      (el.getAttribute("data-prefix") || "") +
      value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) +
      (el.getAttribute("data-suffix") || "");
  }

  /* Everything at rest, for reduced-motion users. */
  function restAll() {
    restRig(false);
    document
      .querySelectorAll(
        "[data-reveal-item], [data-card], [data-card-solo], [data-pin-frame], [data-hero-in], .sw"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    document.querySelectorAll("[data-icon-draw]").forEach(function (p) {
      p.style.strokeDasharray = "none";
      p.style.strokeDashoffset = "0";
    });
    document.querySelectorAll(".sw-ghost").forEach(function (g) {
      g.style.opacity = "0";
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
