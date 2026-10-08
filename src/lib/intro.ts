"use client";

import { useSyncExternalStore } from "react";
import { INTRO_KEY } from "./intro-boot";

/**
 * Tiny in-memory store for the preloader → hero handoff.
 * Lives at module scope, so it survives client-side route transitions; the
 * session flag additionally skips the preloader on reloads within a session.
 */
let done = false;
const listeners = new Set<() => void>();

function readInitial() {
  if (done || typeof document === "undefined") return done;
  done = document.documentElement.dataset.intro === "done";
  return done;
}

export function completeIntro() {
  if (done) return;
  done = true;
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage may be unavailable (private mode) — memory state still works */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `true` once the preloader has handed off (or was skipped this session). */
export function useIntroDone() {
  return useSyncExternalStore(subscribe, readInitial, () => false);
}