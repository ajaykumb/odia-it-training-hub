import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import {
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "registrations"), {
        ...form,
        source: "website",
        createdAt: serverTimestamp(),
      });

      setSuccess("Registration successful! Our team will contact you soon.");
      setForm({ name: "", email: "", phone: "" });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">

        {/* LEFT INFO SECTION */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
          <AcademicCapIcon className="w-14 h-14 mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Odia IT Training Hub
          </h2>
          <p className="text-lg mb-6">
            Learn real-time IT skills with expert guidance, practical projects,
            and interview support.
          </p>
          <ul className="space-y-3 text-sm">
            <li>✔ Real-time Project Training</li>
            <li>✔ Student Dashboard & Assignments</li>
            <li>✔ Interview Preparation & Support</li>
            <li>✔ 100% Job Assistance</li>
          </ul>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            New Candidate Registration
          </h3>
          <p className="text-gray-500 mb-6">
            Fill in your details and we’ll reach out to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-semibold transition"
            >
              {loading ? "Submitting..." : "Register Now"}
            </button>
          </form>

          {success && (
            <p className="text-green-600 text-center mt-4">{success}</p>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            © {new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
