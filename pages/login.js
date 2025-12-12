import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 NEW
  const [resetMessage, setResetMessage] = useState(""); // ⭐ NEW: Reset success message
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ NEW: Password Reset Handler
  const handlePasswordReset = async () => {
    if (!email) {
      setResetMessage("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset link has been sent to your email.");
    } catch (err) {
      setResetMessage("Failed to send reset email. Check email address.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Check Firestore Student Record
      const q = query(collection(db, "students"), where("email", "==", email));
      const snap = await getDocs(q);

      if (snap.empty) {
        throw new Error("Student record not found in Firestore.");
      }

      const studentDoc = snap.docs[0];
      const studentData = studentDoc.data();
      const studentId = studentDoc.id;

      if (!studentData.isApproved) {
        router.push("/pending-approval");
        return;
      }

      localStorage.setItem("studentToken", "VALID_USER");
      localStorage.setItem("studentUID", studentId);

      router.push("/student-dashboard");

    } catch (err) {
      let errorMessage = "Invalid Student ID or Password.";

      if (["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(err.code)) {
        errorMessage = "Invalid Student ID or Password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.message.includes("Student record not found")) {
        errorMessage = "No matching student record found. Contact support.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-md">

        <a href="/" className="text-blue-700 text-sm mb-4 inline-block">
          ← Back to Main Site
        </a>

        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">
          Odia IT Training Hub
        </h2>
        <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">
          Student Login
        </h3>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Access your class notes & study materials
        </p>

        <form onSubmit={handleLogin}>
          <label className="text-gray-700 font-medium text-sm">Student ID (Email)</label>
          <input
            type="email"
            placeholder="Enter your registered email address"
            className="w-full p-3 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-gray-700 font-medium text-sm">Password</label>
          
          {/* ⭐ PASSWORD + EYE ICON */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your Password"
              className="w-full p-3 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* 👁 TOGGLE */}
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 mb-3">{error}</p>}

          {/* ⭐ RESET PASSWORD MESSAGE */}
          {resetMessage && <p className="text-green-600 text-sm mb-3">{resetMessage}</p>}

          <button
            className={`w-full text-white py-3 rounded transition text-lg font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {/* ⭐ FORGOT PASSWORD LINK */}
        <p
          className="text-center text-blue-700 mt-3 text-sm cursor-pointer hover:underline"
          onClick={handlePasswordReset}
        >
          Forgot Password?
        </p>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?
          <a href="/signup" className="text-blue-700 font-semibold ml-1 hover:underline">
            Sign Up Now
          </a>
        </p>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2022 Odia IT Training Hub • All Rights Reserved
        </p>
      </div>
    </div>
  );
}
