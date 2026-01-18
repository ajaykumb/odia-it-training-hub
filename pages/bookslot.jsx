"use client";

import { useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function BookSlotPage() {
  useEffect(() => {
    // 🔒 DEFINE HELPERS FIRST
    window.firebaseAddBooking = async (data) => {
      await addDoc(collection(db, "bookings"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      await fetch("/api/interviewSlotMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: data.date,
          time: data.timeSlot,
        }),
      });
    };

    window.firebaseGetBookedSlots = async (date) => {
      const q = query(
        collection(db, "bookings"),
        where("date", "==", date)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data().timeSlot);
    };

    // ✅ LOAD bookslot.js ONLY AFTER helpers exist
    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /* ✅ IMPORTANT: SHOW LOADER UI INSTEAD OF EMPTY DIV */
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #5b7cff 0%, #1f3c88 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#1f3c88", marginBottom: "8px" }}>
          Loading Interview Slots
        </h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Please wait while we prepare your booking page…
        </p>

        <div style={{ marginTop: "18px", color: "#999" }}>
          ⏳ Loading…
        </div>
      </div>
    </main>
  );
}
