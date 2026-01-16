"use client";

import { useEffect } from "react";

export default function BookSlotPage() {
  useEffect(() => {
    // 🔐 Expose server booking function ONLY
    window.firebaseAddBooking = async (payload) => {
      const res = await fetch("/api/bookSlot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("SLOT_BOOKED");
      }
    };

    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
