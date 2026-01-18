"use client";

import { useEffect } from "react";

export default function BookSlotPage() {
  useEffect(() => {
    // Prevent duplicate script load
    if (document.getElementById("bookslot-script")) return;

    const script = document.createElement("script");
    script.id = "bookslot-script";
    script.src = "/bookslot.js";
    script.defer = true;

    script.onerror = () => {
      console.error("❌ bookslot.js failed to load");
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1f3c88,#4f6df5)",
      }}
    />
  );
}
