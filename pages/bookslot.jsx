"use client";

import { useEffect } from "react";

export default function BookSlotPage() {
  useEffect(() => {
    // 🔐 Server-only booking (atomic)
    window.firebaseAddBooking = async (payload) => {
      const res = await fetch("/api/bookSlot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "BOOKING_FAILED");
      }

      return data;
    };

    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
