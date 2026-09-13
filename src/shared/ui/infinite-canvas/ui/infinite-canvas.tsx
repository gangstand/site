"use client";

import type { ReactNode } from "react";
import type { CanvasBounds } from "../model/use-canvas-transform";
import type { CanvasControlLabels } from "./footer-controls";
import { CanvasViewport } from "./canvas-viewport";
import styles from "./infinite-canvas.module.css";

export function InfiniteCanvas({ children, bounds, ariaLabel, controls }: {
  children: ReactNode;
  bounds: CanvasBounds;
  ariaLabel: string;
  controls?: CanvasControlLabels;
}) {
  return (
    <div className={styles.shell}>
      <CanvasViewport bounds={bounds} ariaLabel={ariaLabel} controls={controls} fitOnMount contentOnly>
        {children}
      </CanvasViewport>
    </div>
  );
}
