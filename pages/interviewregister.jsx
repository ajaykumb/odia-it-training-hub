"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
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

    localStorage.setItem("candidateId", docRef.id);
    localStorage.setItem("candidateData", JSON.stringify(form));

    router.push("/bookslot");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* LOGO */}
        <img
          src="/images/logo.png"
          alt="Odia IT Training Hub"
          style={styles.logo}
        />

        <h2 style={styles.title}>Interview Registration</h2>
        <p style={styles.subtitle}>
          Register once to book your interview slot
        </p>

        {/* STEP INDICATOR */}
        <div style={styles.step}>
          Step 1 of 2 · Registration
        </div>

        <input
          style={styles.input}
          placeholder="Full Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Email Address"
          type="email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Mobile Number"
          type="tel"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <button style={styles.button} onClick={submit}>
          Proceed to Book Slot →
        </button>

        <p style={styles.footer}>
          🔒 Your information is safe & will not be shared
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1f3c88, #3a5fdc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logo: {
    height: "60px",
    marginBottom: "10px",
  },
  title: {
    margin: "10px 0",
    color: "#1f3c88",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
  },
  step: {
    fontSize: "13px",
    color: "#1f3c88",
    background: "#eef2ff",
    padding: "6px 10px",
    borderRadius: "20px",
    display: "inline-block",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1f3c88",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
  },
  footer: {
    fontSize: "12px",
    color: "#777",
    marginTop: "15px",
  },
};
