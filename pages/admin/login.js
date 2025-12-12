import { useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const login = async () => {
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/all-answers");
    } catch (e) {
      setErr("Invalid login details");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4">
      
      {/* Card */}
      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">

        {/* Header */}
        <div className="text-center mb-8">
          <ShieldCheckIcon className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white drop-shadow">
            Admin Login
          </h1>
          <p className="text-blue-100 mt-2">
            Authorized access only
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-white font-medium">Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full p-3 mt-2 rounded-lg bg-white/40 text-white placeholder-white/80 
            focus:ring-2 focus:ring-yellow-300 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password with toggle */}
        <div className="mb-5 relative">
          <label className="text-white font-medium">Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            className="w-full p-3 mt-2 rounded-lg bg-white/40 text-white placeholder-white/80 
            focus:ring-2 focus:ring-yellow-300 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-11 text-white/80 hover:text-white transition"
          >
            {showPass ? <EyeSlashIcon className="w-6"/> : <EyeIcon className="w-6" />}
          </button>
        </div>

        {/* Error */}
        {err && (
          <p className="text-red-300 font-semibold text-center mb-4 animate-pulse">
            {err}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full bg-yellow-400 text-blue-900 py-3 rounded-xl font-bold text-lg 
          hover:bg-yellow-300 transition-all shadow-lg hover:shadow-2xl"
        >
          Login
        </button>

      </div>
    </main>
  );
}
