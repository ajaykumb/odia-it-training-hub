"use client";

import { useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; // ✅ CORRECT
import {
  sendTeacherMail,
  sendStudentMail,
} from "../utils/email"; // ✅ already exists

export default function BookSlotPage() {
  useEffect(() => {
    // 🔹 Firebase booking function
    window.firebaseAddBooking = async (data) => {
      await addDoc(collection(db, "bookings"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    };

    // 🔹 Email functions (Gmail already configured)
    window.sendTeacherMail = sendTeacherMail;
    window.sendStudentMail = sendStudentMail;

    // 🔹 Load pure JS UI
    const script = document.createElement("script");
    script.src = "/bookslot.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
