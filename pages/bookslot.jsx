"use client";

import { useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function BookSlotPage() {
  useEffect(() => {
    window.firebaseAddBooking = async (data) => {
      await addDoc(collection(db, "bookings"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      // send email
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

    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
