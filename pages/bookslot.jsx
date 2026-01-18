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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1f3c88,#4f6df5)",
      }}
    />
  );
}
