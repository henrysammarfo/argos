import { useEffect, useRef, useState, type ReactNode } from "react";
import heroPoster from "@/assets/hero-poster.jpg";
import { SiteNav } from "./site-nav";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4";

const HERO_DESCRIPTION =
  "Ambient footage: agent nodes pulse across a dark network graph while grant proposals flow through review lanes.";

interface VideoHeroProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function VideoHero({ children, fullscreen = true }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const handlePause = () => {
    const v = videoRef.current;
    if (v && !v.paused) v.pause();
  };
  const handlePlay = () => {
    const v = videoRef.current;
    if (v && v.paused && !prefersReducedMotion) void v.play().catch(() => {});
  };

  return (
    <section
      aria-label="ARGOS product hero"
      className={`relative w-full overflow-hidden ${fullscreen ? "h-dvh" : "min-h-[80vh]"}`}
    >
      {/* Screen-reader description of the ambient background */}
      <p className="sr-only" id="hero-video-desc">
        {HERO_DESCRIPTION}
      </p>

      {/* Background: static poster when reduced motion is requested, video otherwise */}
      {prefersReducedMotion ? (
        <img
          src={heroPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-describedby="hero-video-desc"
          aria-label="Decorative ambient background video"
          onMouseEnter={handlePause}
          onMouseLeave={handlePlay}
          onFocus={handlePause}
          onBlur={handlePlay}
        >
          <track kind="descriptions" srcLang="en" label="Description" default />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      {/* Foreground */}
      <div className="relative z-10 flex h-full min-h-inherit flex-col">
        <SiteNav />
        {children}
      </div>
    </section>
  );
}
