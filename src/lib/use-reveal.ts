import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once it scrolls into view. Content is visible by default;
 * the hidden state is only applied after mount, so SSR and no-JS render fully.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "pending" | "visible">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const alreadyInView = node.getBoundingClientRect().top < window.innerHeight;
    if (
      alreadyInView ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setState("visible");
      return;
    }

    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const className =
    state === "pending" ? "reveal-pending" : state === "visible" ? "reveal-visible" : "";

  return { ref, className };
}
