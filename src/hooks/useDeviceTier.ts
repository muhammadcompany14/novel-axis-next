"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "mid" | "low";

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("mid");

  useEffect(() => {
    const mqHigh = window.matchMedia("(min-width: 1366px) and (hover: hover)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const calc = () => setTier(mqHigh.matches ? "high" : mqDesktop.matches ? "mid" : "low");
    calc();
    mqHigh.addEventListener("change", calc);
    mqDesktop.addEventListener("change", calc);
    return () => {
      mqHigh.removeEventListener("change", calc);
      mqDesktop.removeEventListener("change", calc);
    };
  }, []);

  return tier;
}