"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/shared/lib/language";
import { ASCII_FRAMES, VIEWBOX_HEIGHT, VIEWBOX_WIDTH } from "./ascii-frames-data";

const FRAME_COUNT = ASCII_FRAMES.length;
const FRAME_DURATION_MS = 150;
const REF_FONT_PX = 1000;
// "bold" here must match the font-bold class on the rendered rows below —
// the measurement has to reflect the actual weight drawn, or row widths
// drift out of sync with the boxes they're meant to fill.
const FONT_STACK = `bold ${REF_FONT_PX}px "Courier New", monospace`;

// Canvas text measurement reflects the exact font the browser will actually
// use and returns instantly (no DOM layout/paint, no @font-face loading to
// wait for), so it works correctly on the very first render — unlike
// measuring a mounted DOM node, which can be wrong until the real font has
// loaded and settled.
let measureCtx: CanvasRenderingContext2D | null | undefined;
function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (measureCtx !== undefined) return measureCtx;
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  measureCtx = canvas.getContext("2d");
  if (measureCtx) measureCtx.font = FONT_STACK;
  return measureCtx;
}

function rowFontSizeCqw(text: string, targetWidthViewboxUnits: number): number {
  const ctx = getMeasureCtx();
  const targetPct = (targetWidthViewboxUnits / VIEWBOX_WIDTH) * 100;
  if (!ctx) return targetPct / Math.max(text.length, 1) / 0.6;
  const naturalWidthAtRef = ctx.measureText(text).width;
  if (naturalWidthAtRef <= 0) return 0;
  return targetPct / (naturalWidthAtRef / REF_FONT_PX);
}

interface AsciiAvatarProps {
  className?: string;
}

export function AsciiAvatar({ className }: AsciiAvatarProps) {
  const { t } = useTranslation();
  const [frame, setFrame] = useState(0);
  const direction = useRef(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setFrame((current) => {
        const next = current + direction.current;
        if (next >= FRAME_COUNT - 1) {
          direction.current = -1;
          return FRAME_COUNT - 1;
        }
        if (next <= 0) {
          direction.current = 1;
          return 0;
        }
        return next;
      });
    }, FRAME_DURATION_MS);
    return () => window.clearInterval(id);
  }, []);

  const rows = ASCII_FRAMES[frame];

  return (
    <div className={className} role="img" aria-label={t.avatarAlt}>
      <div className="relative h-full w-full text-primary [container-type:inline-size]">
        {rows.map((row, i) => (
          <div
            key={i}
            className="absolute whitespace-pre font-mono font-bold leading-none"
            // The server has no canvas to measure text with, so it falls back to an
            // approximate average char-width ratio; the browser then swaps in the
            // exact measured value. For a monospace font the two agree to ~0.02%,
            // an imperceptible sub-pixel difference, so the expected mismatch is
            // suppressed here rather than paid for with a blank first frame.
            suppressHydrationWarning
            style={{
              left: `${(row.x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(row.y / VIEWBOX_HEIGHT) * 100}%`,
              fontSize: `${rowFontSizeCqw(row.t, row.w)}cqw`,
            }}
          >
            {row.t}
          </div>
        ))}
      </div>
    </div>
  );
}
