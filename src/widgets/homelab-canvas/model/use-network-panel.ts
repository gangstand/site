"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EMPTY_NETWORK = { hovered: null, focused: null, pinned: null };
type NetworkState = Record<keyof typeof EMPTY_NETWORK, string | null>;

/** Hover has a grace period for moving onto the panel; updates remain atomic and pure. */
export function useNetworkPanel() {
  const [network, setNetwork] = useState<NetworkState>(EMPTY_NETWORK);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current !== null) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);

  const enterNetwork = useCallback((id: string) => {
    cancelLeave();
    setNetwork(prev => prev.hovered === id ? prev : { ...prev, hovered: id });
  }, [cancelLeave]);

  const leaveNetwork = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => {
      leaveTimer.current = null;
      setNetwork(prev => ({ ...prev, hovered: null }));
    }, 180);
  }, [cancelLeave]);

  const setFocusedNetwork = useCallback((id: string | null) => {
    setNetwork(prev => prev.focused === id ? prev : { ...prev, focused: id });
  }, []);

  const closeNetwork = useCallback(() => {
    cancelLeave();
    setNetwork(EMPTY_NETWORK);
  }, [cancelLeave]);

  const toggleNetwork = useCallback((id: string) => {
    cancelLeave();
    setNetwork(prev => prev.pinned === id ? EMPTY_NETWORK : { ...prev, pinned: id });
  }, [cancelLeave]);

  useEffect(() => cancelLeave, [cancelLeave]);

  const activeNetworkId = network.hovered ?? network.focused ?? network.pinned;
  return { activeNetworkId, setFocusedNetwork, enterNetwork, leaveNetwork, closeNetwork, toggleNetwork };
}
