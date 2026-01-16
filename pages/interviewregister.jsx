"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../src/firebase";
import { useRouter } from "next/router";

export default function InterviewRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const router = useRouter();

  const submit = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all details");
      return;
    }

    const docRef = await addDoc(
      collection(db, "interviewcandidate"),
      {
        ...form,
        createdAt: serverTimestamp(),
      }
    );

    // Store data for booking page
    localStorage.setItem("candidateId", docRef.id);
    localStorage.setItem("candidateData", JSON.stringify(form));

    router.push("/bookslot");
  };

  return (
    <div>
      <h2>Interview Registration</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email ID"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Contact Number"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button onClick={submit}>
        Proceed to Slot Booking
      </button>
    </div>
  );
}
