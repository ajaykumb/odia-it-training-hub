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
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ 1) SAVE REGISTRATION TO FIREBASE
      await addDoc(collection(db, "registrations"), {
        ...form,
        source: "website",
        createdAt: serverTimestamp(),
      });

      // ✅ 2) SEND THANK YOU EMAIL (NEW)
      await fetch("/api/sendRegistrationThankYou", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toEmail: form.email,
          name: form.name,
        }),
      });

      // ✅ 3) SUCCESS MESSAGE
      setSuccess(
        "Registration successful! A confirmation email has been sent to your email address."
      );

      // ✅ 4) RESET FORM
      setForm({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT BRAND SECTION */}
        <div className="bg-blue-700 text-white p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <AcademicCapIcon className="w-10 h-10" />
              <h1 className="text-2xl font-bold tracking-wide">
                Odia IT Training Hub
              </h1>
            </div>

            <p className="text-lg mb-6 leading-relaxed">
              Industry-focused IT training with real-time projects,
              interview preparation, and continuous job support.
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
              <li>✔ Real-time project exposure</li>
              <li>✔ Interview & resume support</li>
              <li>✔ 100% job assistance</li>
            </ul>
          </div>

          <p className="text-xs text-blue-200 mt-10">
            Empowering careers through practical IT education.
          </p>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Candidate Registration
          </h2>
          <p className="text-gray-500 mb-8">
            Register once. Our team will guide you end-to-end.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
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
            <p className="text-green-600 font-medium text-center mt-5">
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
