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
    // ✅ Add booking
    window.firebaseAddBooking = async (data) => {
      await addDoc(collection(db, "bookings"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      // send mail
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

    // ✅ Get booked slots (CLIENT SIDE)
    window.firebaseGetBookedSlots = async (date) => {
      const q = query(
        collection(db, "bookings"),
        where("date", "==", date)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data().timeSlot);
    };

    // load UI
    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#1f3c88" }} />
  );
}
