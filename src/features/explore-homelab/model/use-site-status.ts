"use client";

import { useEffect, useState } from "react";
import { HOMELAB_SITE_IDS, parseHomelabStatus, type HomelabStatus } from "@/shared/api/homelab-status";

const STATUS_REFRESH_INTERVAL_MS = 30_000;

export function useSiteStatus() {
  const [statuses, setStatuses] = useState<HomelabStatus>({});

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = async () => {
      if (disposed || controller || document.hidden) return;
      clearTimeout(timer);
      const request = new AbortController();
      controller = request;
      try {
        const response = await fetch("/api/homelab/status/", {
          cache: "no-store",
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(12_000)]),
        });
        if (!response.ok) throw new Error("Status check failed");
        const result = parseHomelabStatus(await response.json());
        if (!disposed && !request.signal.aborted) setStatuses(result);
      } catch {
        if (!disposed && !request.signal.aborted) {
          const checkedAt = new Date().toISOString();
          setStatuses(Object.fromEntries(HOMELAB_SITE_IDS.map((id) => [id, { state: "unknown", checkedAt }])));
        }
      } finally {
        if (controller === request) {
          controller = undefined;
          if (!disposed && !document.hidden) timer = setTimeout(refresh, STATUS_REFRESH_INTERVAL_MS);
        }
      }
    };

    const onVisibilityChange = () => {
      clearTimeout(timer);
      controller?.abort();
      controller = undefined;
      if (!document.hidden) void refresh();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    void refresh();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return statuses;
}
