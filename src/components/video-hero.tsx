import type { ReactNode } from "react";
import heroPoster from "@/assets/hero-poster.jpg";
import { SiteNav } from "./site-nav";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4";

interface VideoHeroProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function VideoHero({ children, fullscreen = true }: VideoHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${fullscreen ? "h-screen" : "min-h-[80vh]"}`}
    >
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Foreground */}
      <div className="relative z-10 flex h-full min-h-inherit flex-col">
        <SiteNav />
        {children}
      </div>
    </section>
  );
}
