import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function AuthForm() {
  const [mode, setMode] = useState("register"); // register | login
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "registrations"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        candidateType: "New Student",
        source: "website",
        createdAt: serverTimestamp(),
      });

      setSuccess("🎉 Registration successful! Our team will contact you.");
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      alert("Registration failed");
    }
    setLoading(false);
  };

  // 🔑 LOGIN (placeholder – connect Firebase Auth later)
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login API can be connected here");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => setMode("register")}
            className={`font-semibold ${
              mode === "register" ? "text-blue-700" : "text-gray-400"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setMode("login")}
            className={`font-semibold ${
              mode === "login" ? "text-blue-700" : "text-gray-400"
            }`}
          >
            Login
          </button>
        </div>

        {/* ANIMATED FORM */}
        <AnimatePresence mode="wait">
          {mode === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <Input icon={UserIcon} placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
              <Input icon={EnvelopeIcon} placeholder="Email" name="email" value={form.email} onChange={handleChange} />
              <Input icon={PhoneIcon} placeholder="Mobile Number" name="phone" value={form.phone} onChange={handleChange} />

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Submitting..." : "Register"}
              </motion.button>
            </motion.form>
          )}

          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <Input icon={EnvelopeIcon} placeholder="Email" name="email" />
              <Input icon={LockClosedIcon} placeholder="Password" type="password" name="password" />

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Login
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {success && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            {success}
          </p>
        )}
      </div>
    </div>
  );
}

/* 🔹 REUSABLE INPUT */
function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
      <input
        {...props}
        required
        className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
      />
    </div>
  );
}
