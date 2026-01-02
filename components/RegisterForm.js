import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
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
        createdAt: serverTimestamp()
      });

      setSuccess("Thank you! We will contact you soon.");
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      alert("Registration failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-4">
          New Candidate Registration
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            value={form.name}
            className="w-full border p-2 mb-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            value={form.email}
            className="w-full border p-2 mb-3"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Mobile Number"
            required
            onChange={handleChange}
            value={form.phone}
            className="w-full border p-2 mb-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>

        {success && (
          <p className="text-green-600 text-center mt-3">{success}</p>
        )}
      </div>
    </div>
  );
}
