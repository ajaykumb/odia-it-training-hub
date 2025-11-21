import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import getDoc
import { auth, db } from "../utils/firebaseConfig"; 

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch user's approval status from Firestore
      const studentDocRef = doc(db, "students", user.uid);
      const studentDoc = await getDoc(studentDocRef);
      
      if (!studentDoc.exists()) {
        // This case should ideally not happen if signup succeeded, but is a safe guard
        throw new Error("User data not found in database."); 
      }

      const studentData = studentDoc.data();
      
      // 3. Check for approval status
      if (!studentData.isApproved) {
        // Redirect to pending page
        router.push("/pending-approval");
        return; // Stop execution
      }

      // 4. Success handling (Approved user)
      localStorage.setItem("studentToken", "VALID_USER");
      router.push("/student-dashboard");
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      let errorMessage = "Invalid Student ID or Password.";
      
      if (err.message && err.message.includes("User data not found")) {
         errorMessage = "User data is incomplete. Please contact support.";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMessage = "Invalid Student ID or Password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
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

        {/* Back Link */}
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
          <input
            type="password"
            placeholder="Enter your Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <button
            className={`w-full text-white py-3 rounded transition text-lg font-semibold ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {/* New Signup Link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
            Don't have an account? 
            <a href="/signup" className="text-blue-700 font-semibold ml-1 hover:underline">
                Sign Up Now
            </a>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2022 Odia IT Training Hub • All Rights Reserved
        </p>

      </div>
    </div>
  );
}
