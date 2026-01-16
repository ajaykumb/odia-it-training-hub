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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Please enter a valid 10-digit mobile number";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);

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
    <>
      {/* Animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
            Interview Support by Industry Experts.
            Candidates receive expert-led interview support and professional representation.
          </p>

          <div style={styles.step}>
            Step 1 of 2 · Registration
          </div>

          {/* INPUTS */}
          <input
            style={styles.input}
            placeholder="👤 Full Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}

          <input
            style={styles.input}
            placeholder="📧 Email Address"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <input
            style={styles.input}
            placeholder="📱 Mobile Number"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}

          {/* BUTTON */}
          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Proceed to Book Slot →"}
          </button>

          {/* WHAT HAPPENS NEXT */}
          <div style={styles.next}>
            <p style={styles.nextTitle}>What happens next?</p>
            <ul style={styles.list}>
              <li>✔ Choose your interview date & time</li>
              <li>✔ Get instant email confirmation</li>
              <li>✔ Attend interview as scheduled</li>
            </ul>
          </div>

          {/* TRUST & SUPPORT */}
          <p style={styles.footer}>
            🔒 We respect your privacy. No spam. No sharing.
          </p>

          <p style={styles.support}>
            Need help? 📞 <strong>9437401378</strong> | WhatsApp available
          </p>
        </div>
      </div>
    </>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: `
      linear-gradient(
        rgba(15, 30, 80, 0.65),
        rgba(15, 30, 80, 0.65)
      ),
      url("/images/interview-bg.jpg")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    textAlign: "center",
    animation: "fadeUp 0.6s ease",
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
    marginBottom: "14px",
  },
  step: {
    fontSize: "13px",
    color: "#1f3c88",
    background: "#eef2ff",
    padding: "6px 14px",
    borderRadius: "20px",
    display: "inline-block",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  error: {
    color: "#d32f2f",
    fontSize: "12px",
    textAlign: "left",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1f3c88",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    marginTop: "10px",
    cursor: "pointer",
  },
  next: {
    background: "#f5f7ff",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
    textAlign: "left",
  },
  nextTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "8px",
    color: "#1f3c88",
  },
  list: {
    paddingLeft: "18px",
    fontSize: "13px",
    color: "#333",
  },
  footer: {
    fontSize: "12px",
    color: "#777",
    marginTop: "15px",
  },
  support: {
    fontSize: "13px",
    marginTop: "8px",
    color: "#333",
  },
};
