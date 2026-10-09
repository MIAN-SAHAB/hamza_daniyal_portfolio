"use client";

/* eslint-disable @next/next/no-img-element -- Steam's CDN already serves sized JPGs; skipping the optimizer avoids
   dozens of simultaneous proxy fetches, which is what made covers intermittently fail to appear. */

import { useCallback, useState } from "react";
import { images } from "@/lib/site";

type Props = {
  /** Candidate URLs, tried in order. */
  sources: (string | undefined)[];
  name: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  /** Load right away but behind everything else (below-the-fold grids). */
  lowPriority?: boolean;
};

/**
 * Game artwork with a fallback chain: each source is tried in turn, then a
 * generic gaming photo, and if even that fails a gradient tile with the title.
 */
export default function GameArt({ sources, name, alt, className = "", eager = false, lowPriority = false }: Props) {
  const chain = [...sources.filter(Boolean), images.gaming] as string[];
  const [index, setIndex] = useState(0);
  const key = chain.join("|");

  // Reset when the game changes (e.g. focus panel swaps titles).
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setIndex(0);
  }

  // A cached 404 can fail before React attaches onError — catch that when the element mounts.
  const checkBroken = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth === 0) queueMicrotask(() => setIndex((i) => i + 1));
  }, []);

  if (index >= chain.length) {
    return (
      <div
        role="img"
        aria-label={alt ?? name}
        className={`flex items-end bg-gradient-to-br from-accent via-[#8b4dff] to-aqua p-3 ${className}`}
      >
        <span className="font-display text-sm uppercase leading-tight text-white">{name}</span>
      </div>
    );
  }

  return (
    <img
      ref={checkBroken}
      key={chain[index]}
      src={chain[index]}
      alt={alt ?? `${name} artwork`}
      loading={eager || lowPriority ? "eager" : "lazy"}
      fetchPriority={lowPriority ? "low" : "auto"}
      decoding="async"
      onError={() => setIndex((i) => i + 1)}
      className={`object-cover ${className}`}
    />
  );
}
