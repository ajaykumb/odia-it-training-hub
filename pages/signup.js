import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

// Placeholder for email function. Real-world implementation requires a server or service (like SendGrid or Firebase Functions).
const sendWelcomeEmail = (toEmail, name) => {
    console.log(`
        EMAIL SIMULATION: Sending welcome email to ${name} (${toEmail}).
        Message: Welcome! You have successfully signed up. Please wait for an administrator to approve your account before logging in.
    `);
    // In a production app, you would call an external API here:
    // fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ email: toEmail, name: name }) });
};

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (phone.length !== 10 || isNaN(phone)) {
        setError("Phone number must be a 10-digit number.");
        setLoading(false);
        return;
    }

    try {
        // 1. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Store user details in Firestore, setting isApproved to FALSE
        await setDoc(doc(db, "students", user.uid), {
            name: name,
            email: email,
            phone: phone, 
            isApproved: false, // NEW FIELD: User is unapproved by default
            createdAt: new Date(),
        });
        
        // 3. Send welcome email (placeholder)
        sendWelcomeEmail(email, name);

        // 4. Success handling - Redirect to the pending page, not the dashboard
        localStorage.setItem("signup-email", email); // Store email to show on pending page
        router.push("/pending-approval"); 

    } catch (err) {
        console.error("Signup error:", err.code, err.message);
        let errorMessage = "An unknown error occurred during signup.";
        if (err.code === "auth/email-already-in-use") {
            errorMessage = "This email is already registered. Try logging in.";
        } else if (err.code === "auth/weak-password") {
             errorMessage = "Password should be at least 6 characters.";
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
          Student Signup
        </h3>

        <form onSubmit={handleSignup}>
            {/* Name */}
            <label className="text-gray-700 font-medium text-sm">Full Name</label>
            <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 border rounded mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            {/* Email (Student ID) */}
            <label className="text-gray-700 font-medium text-sm">Email (Your Student ID)</label> 
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {/* Phone Number */}
            <label className="text-gray-700 font-medium text-sm">Phone Number</label>
            <input
                type="tel"
                placeholder="10-digit phone number"
                className="w-full p-3 border rounded mb-4"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength="10"
                required
            />
            
            {/* Password */}
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
                type="password"
                placeholder="Choose a strong password (min 6 chars)"
                className="w-full p-3 border rounded mb-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
            />

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <button
                className={`w-full text-white py-3 rounded transition text-lg font-semibold ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={loading}
            >
                {loading ? 'Registering...' : 'Sign Up'}
            </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account? 
            <a href="/login" className="text-blue-700 font-semibold ml-1 hover:underline">
                Login
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
