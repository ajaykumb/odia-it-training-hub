"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; // ✅ CORRECT
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

    // Store for booking page
    localStorage.setItem("candidateId", docRef.id);
    localStorage.setItem("candidateData", JSON.stringify(form));

    router.push("/bookslot");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Interview Registration</h2>

      <input
        placeholder="Full Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Email ID"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Contact Number"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />
      <br /><br />

      <button onClick={submit}>
        Proceed to Slot Booking
      </button>
    </div>
  );
}
