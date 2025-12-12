import { useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const router = useRouter();

  const ADMIN_EMAIL = "oracle.ajaykr@gmail.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const login = async () => {
    setErr("");

    if (email !== ADMIN_EMAIL) {
      setErr("Unauthorized email. Admin access only.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("adminLogin", "true");
      router.push("/admin/all-answers");
    } catch (e) {
      setErr("Invalid password.");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">

      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900"></div>

      {/* Soft Grid Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Blurred Glow Shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-[90px]"></div>
      <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-cyan-400 opacity-10 rounded-full blur-2xl"></div>

      {/* LOGIN CARD */}
      <div className="relative bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/images/logo.png"
            alt="Odia IT Training Hub Logo"
            className="w-20 h-20 mx-auto rounded-full shadow-xl border border-white/40"
          />

          {/* Added Institute Name */}
          <h2 className="text-xl font-bold text-white mt-3 tracking-wide drop-shadow">
            Odia IT Training Hub
          </h2>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <ShieldCheckIcon className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white">Admin Login</h1>
          <p className="text-blue-200 mt-1">Secure Access Portal</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-white font-medium">Admin Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full p-3 mt-2 rounded-lg bg-white/30 text-white placeholder-white/70 
            focus:ring-2 focus:ring-yellow-300 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5 relative">
          <label className="text-white font-medium">Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            className="w-full p-3 mt-2 rounded-lg bg-white/30 text-white placeholder-white/70 
            focus:ring-2 focus:ring-yellow-300 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-11 text-white/80 hover:text-white transition"
          >
            {showPass ? <EyeSlashIcon className="w-6" /> : <EyeIcon className="w-6" />}
          </button>
        </div>

        {/* Error */}
        {err && (
          <p className="text-red-300 font-semibold text-center mb-4 animate-pulse">
            {err}
          </p>
        )}

        {/* Login button */}
        <button
          onClick={login}
          className="w-full bg-yellow-400 text-blue-900 py-3 rounded-xl font-bold text-lg 
          hover:bg-yellow-300 transition-all shadow-lg hover:shadow-2xl"
        >
          Login
        </button>

        {/* Contact Number Added */}
        <p className="text-center text-blue-100 mt-6 text-sm">
          📞 For support contact: <span className="font-bold">9437401378</span>
        </p>

      </div>
    </main>
  );
}
