import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Fade in up/down/left/right for elements with data-animate attribute
  const elements = document.querySelectorAll("[data-animate]");

  elements.forEach((el) => {
    const direction = el.getAttribute("data-animate") || "up";
    const delay = parseFloat(el.getAttribute("data-delay") || "0");

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
    };

    switch (direction) {
      case "up":
        fromVars.y = 40;
        toVars.y = 0;
        break;
      case "down":
        fromVars.y = -40;
        toVars.y = 0;
        break;
      case "left":
        fromVars.x = 40;
        toVars.x = 0;
        break;
      case "right":
        fromVars.x = -40;
        toVars.x = 0;
        break;
      case "scale":
        fromVars.scale = 0.9;
        toVars.scale = 1;
        break;
      default:
        fromVars.y = 40;
        toVars.y = 0;
    }

    toVars.scrollTrigger = {
      trigger: el,
      start: "top 95%",
      once: true,
    };

    gsap.fromTo(el, fromVars, toVars);
  });

  // Parallax elements
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-parallax") || "0.5");
    gsap.to(el, {
      yPercent: speed * 30,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Stagger children animations
  document.querySelectorAll("[data-stagger]").forEach((container) => {
    const children = Array.from(container.children);
    const staggerDelay = parseFloat(
      container.getAttribute("data-stagger") || "0.1"
    );

    children.forEach((child, i) => {
      gsap.fromTo(
        child,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * staggerDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 95%",
            once: true,
          },
        }
      );
    });
  });

  // Horizontal line reveal (dividers)
  document.querySelectorAll("[data-line]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      }
    );
  });

  // Refresh ScrollTrigger after images load to recalculate positions
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // Also refresh after a short delay to catch late layout shifts
  setTimeout(() => ScrollTrigger.refresh(), 1500);
}

export function initSmoothScroll() {
  import("lenis").then(({ default: Lenis }) => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  });
}
