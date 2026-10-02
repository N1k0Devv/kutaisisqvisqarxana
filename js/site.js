(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuButton = document.getElementById("menu");
  const navMenu = document.getElementById("navMenu");
  const header = document.querySelector("[data-header]");

  function setMenu(open) {
    if (!menuButton || !navMenu) return;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "მენიუს დახურვა" : "მენიუს გახსნა");
    navMenu.classList.toggle("is-open", open);
    navMenu.hidden = false;
    document.body.classList.toggle("menu-open", open);
    if (header) header.classList.toggle("is-open", open);
    if (window.lenis) {
      if (open) window.lenis.stop();
      else window.lenis.start();
    }
    if (!open) {
      setTimeout(() => {
        if (!navMenu.classList.contains("is-open")) navMenu.hidden = true;
      }, 450);
    }
  }

  window.toggleMenu = function toggleMenu() {
    if (!navMenu) return;
    setMenu(!navMenu.classList.contains("is-open"));
  };

  if (menuButton && navMenu) {
    navMenu.hidden = true;
    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      window.toggleMenu();
    });
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) setMenu(false);
    });
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 24 || header.hasAttribute("data-solid"));
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    if (window.lenis && !reduceMotion) {
      window.lenis.scrollTo(target, { offset: -20 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDescription = document.getElementById("lightbox-description");
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      document.body.classList.remove("modal-open");
    };
    window.closeLightbox = closeLightbox;
    document.querySelectorAll("[data-lightbox]").forEach((button) => {
      button.addEventListener("click", () => {
        const img = button.querySelector("img");
        if (lightboxImage && img) {
          lightboxImage.src = img.currentSrc || img.src;
          lightboxImage.alt = img.alt;
        }
        if (lightboxTitle) lightboxTitle.textContent = button.getAttribute("data-title") || "";
        if (lightboxDescription) lightboxDescription.textContent = button.getAttribute("data-text") || "";
        lightbox.hidden = false;
        lightbox.classList.add("is-open");
        document.body.classList.add("modal-open");
      });
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  if (reduceMotion || typeof gsap === "undefined") {
    document.documentElement.classList.remove("js-anim");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof SplitText !== "undefined") gsap.registerPlugin(SplitText);

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 900px)").matches;

  if (finePointer && wide && typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
    });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.config({ ignoreMobileResize: true });

  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  document.querySelectorAll("[data-split]").forEach((el) => {
    const play = () => {
      if (typeof SplitText === "undefined") {
        gsap.from(el, { y: 28, autoAlpha: 0, duration: 1, ease: "power3.out" });
        return;
      }
      const split = new SplitText(el, {
        type: "lines,words",
        linesClass: "split-line",
        wordsClass: "split-word",
      });
      gsap.from(split.words, {
        yPercent: 140,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.035,
      });
    };

    if (el.hasAttribute("data-split-load")) {
      play();
      return;
    }
    ScrollTrigger.create({
      trigger: el,
      start: "top 86%",
      once: true,
      onEnter: play,
    });
  });

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.set(el, { y: 28 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });

  document.querySelectorAll("[data-clip]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(14% 14% 14% 14%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      }
    );
  });

  const heroStage = document.querySelector("[data-hero-stage]");
  if (heroStage) {
    const zoom = document.querySelector("[data-hero-zoom]");
    const backLayer = heroStage.querySelector(".hero-layer-back");
    const compactIntro = window.matchMedia("(max-width: 980px)").matches;
    if (zoom) {
      gsap.fromTo(zoom, { scale: 1.12 }, { scale: 1, duration: compactIntro ? 1.15 : 1.7, ease: "power3.out" });
    }
    if (backLayer) {
      gsap.fromTo(
        backLayer,
        { clipPath: compactIntro ? "inset(3% 3% 3% 3%)" : "inset(5% 5% 5% 5%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: compactIntro ? 0.95 : 1.3, ease: "power3.inOut" }
      );
    }
    gsap.fromTo(
      ".hero-intro",
      { autoAlpha: 0, y: compactIntro ? 14 : 20 },
      { autoAlpha: 1, y: 0, duration: compactIntro ? 0.75 : 0.95, stagger: 0.07, delay: 0.08, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-slab",
      { autoAlpha: 0, y: 24, x: compactIntro ? 0 : 18 },
      { autoAlpha: 1, y: 0, x: 0, duration: compactIntro ? 0.85 : 1.15, delay: 0.16, ease: "power3.out" }
    );
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 981px)", () => {
    const scroll = document.querySelector("[data-hero-scroll]");
    const stage = document.querySelector("[data-hero-stage]");
    if (scroll && stage) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scroll,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });
      tl.fromTo(stage, {
        scale: 1,
        clipPath: "inset(0% 0% 0% 0% round 0px)",
      }, {
        scale: 0.86,
        clipPath: "inset(7% 5.5% 9% 5.5% round 28px)",
        ease: "none",
        duration: 1,
      }, 0)
        .to(".hero-foreground", { y: -28, autoAlpha: 0, ease: "none", duration: 0.42 }, 0.48)
        .to(".hero-home .scroll-hint", { autoAlpha: 0, y: 10, ease: "none", duration: 0.28 }, 0)
        .fromTo("[data-hero-back]", { scale: 1 }, { scale: 1.1, ease: "none", duration: 1 }, 0)
        .fromTo(".hero-slab-wrap", { yPercent: 0 }, { yPercent: -16, ease: "none", duration: 1 }, 0);
      return () => tl.kill();
    }
  });

  mm.add("(max-width: 980px)", () => {
    const back = document.querySelector("[data-hero-back]");
    const hero = document.querySelector(".hero-home");
    if (!back || !hero) return;
    const tween = gsap.to(back, {
      yPercent: 7,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => tween.kill();
  });

  mm.add("(min-width: 981px)", () => {
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    const pin = document.querySelector("[data-hpin]");
    const track = document.querySelector("[data-htrack]");
    if (pin && track) {
      pin.classList.add("is-pinned");
      const tween = gsap.to(track, {
        x: () => -Math.max(track.scrollWidth - window.innerWidth, 0),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => "+=" + Math.max(track.scrollWidth - window.innerWidth, 0),
        },
      });
      return () => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    }
  });

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    if (!Number.isFinite(target)) return;
    const counter = { value: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            const rounded = Math.round(counter.value);
            const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            el.textContent = prefix + formatted + suffix;
          },
        });
      },
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
