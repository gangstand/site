"use client";

import { useEffect, useState } from "react";
import { HOMELAB_SITES, HOMELAB_STATUS_INTERVAL_MS, parseHomelabStatus, type HomelabStatus } from "@/shared/config/homelab-status";

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
          setStatuses(Object.fromEntries(Object.keys(HOMELAB_SITES).map(id => [id, { state: "unknown", checkedAt }])));
        }
      } finally {
        // A superseded request must not schedule a second polling loop.
        if (controller === request) {
          controller = undefined;
          if (!disposed && !document.hidden) timer = setTimeout(refresh, HOMELAB_STATUS_INTERVAL_MS);
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
