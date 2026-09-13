"use client";

import { useCallback, useEffect, useState } from "react";

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

export function useFullscreen(getElement: () => HTMLElement | null) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const doc = document as FullscreenDocument;
      const active = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsFullscreen(active !== null && active === getElement());
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [getElement]);

  const toggleFullscreen = useCallback(() => {
    const doc = document as FullscreenDocument;
    const active = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    if (active) {
      (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())?.catch(() => {});
      return;
    }
    const el = getElement() as FullscreenElement | null;
    (el?.requestFullscreen?.() ?? el?.webkitRequestFullscreen?.())?.catch(() => {});
  }, [getElement]);

  return { isFullscreen, toggleFullscreen };
}
