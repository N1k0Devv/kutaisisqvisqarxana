// Lazy-load GSAP ScrollSmoother to keep the critical rendering path small.
//
// This file intentionally does *nothing* on small screens / touch devices / reduced-motion
// to avoid scroll jank and improve performance.
(function () {
  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function isLikelyTouchDevice() {
    return (
      ("ontouchstart" in window && window.ontouchstart !== undefined) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );
  }

  function shouldEnableSmoother() {
    if (prefersReducedMotion()) return false;
    if (isLikelyTouchDevice()) return false;

    // Desktop/tablet landscape only. This avoids the heavy work on mobile.
    return window.innerWidth >= 1024;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  async function init() {
    if (!shouldEnableSmoother()) return;

    try {
      // Order matters.
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"
      );

      if (typeof gsap === "undefined") return;
      if (typeof ScrollTrigger === "undefined") return;
      if (typeof ScrollSmoother === "undefined") return;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      // One global smoother instance.
      ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      });
    } catch (e) {
      // Fail silently - the site should still function without ScrollSmoother.
    }
  }

  // Defer all work until the page is fully loaded (keeps LCP fast).
  window.addEventListener("load", init, { once: true });
})();
