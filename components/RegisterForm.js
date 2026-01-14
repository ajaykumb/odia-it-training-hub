import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import {
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    candidateType: "New Student",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Save registration
      await addDoc(collection(db, "registrations"), {
        ...form,
        source: "website",
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Send thank-you email
      await fetch("/api/sendRegistrationThankYou", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: form.email,
          name: form.name,
        }),
      });

      setSuccess(
        "🎉 Registration successful! Please check your email for confirmation."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        candidateType: "New Student",
      });
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT – BRAND / INFO */}
        <div className="bg-blue-800 text-white p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <AcademicCapIcon className="w-10 h-10" />
              <h1 className="text-2xl font-bold tracking-wide">
                Odia IT Training Hub
              </h1>
            </div>

            <p className="text-lg mb-6 leading-relaxed opacity-95">
              Industry-focused IT training with real-time projects,
              interview preparation, and guaranteed job support.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Trusted by 1000+ learners
              </li>
              <li className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Dedicated student & admin portals
              </li>
              <li>✔ Real-time industry projects</li>
              <li>✔ Resume & interview preparation</li>
              <li>✔ Continuous job assistance</li>
            </ul>
          </div>

          <p className="text-xs text-blue-200 mt-10">
            Empowering careers through practical IT education.
          </p>
        </div>

        {/* RIGHT – FORM */}
        <div className="p-10 relative">

          {/* LOGO */}
          <div className="absolute top-6 right-6">
            <img
              src="https://www.odiaittraininghub.in/images/logo.png"
              alt="Odia IT Training Hub"
              className="h-10"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Student Registration
          </h2>
          <p className="text-gray-500 mb-8">
            Register once. Our team will guide you end-to-end.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <div className="relative mt-1">
                <UserIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <div className="relative mt-1">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <div className="relative mt-1">
                <PhoneIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            {/* Candidate Type (LOCKED) */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Candidate Type
              </label>
              <div className="flex items-center gap-2 border rounded-lg p-3 bg-gray-50">
                <input type="radio" checked readOnly className="accent-blue-600" />
                <span className="text-gray-800 font-medium">
                  New Student
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Currently accepting registrations for new students only.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Submitting..." : "Register & Get Callback"}
            </button>
          </form>

          {success && (
            <p className="text-green-600 font-semibold text-center mt-5">
              {success}
            </p>
          )}

          <p className="text-xs text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
