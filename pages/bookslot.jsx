"use client";

import { useEffect } from "react";

export default function BookSlotPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
