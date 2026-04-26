import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // 🔥 NEW: generate session key
      const sessionKey = Date.now().toString();
      localStorage.setItem("ACTIVE_USER_SESSION", sessionKey);

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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">Student Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
