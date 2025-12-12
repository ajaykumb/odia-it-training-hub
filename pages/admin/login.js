import { useState } from "react";
import { useRouter } from "next/router";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const router = useRouter();

  const ADMIN_EMAIL = "trainingaj.group@gmail.com";
  const ADMIN_PASSWORD = "ajaykumb";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const login = (e) => {
    e.preventDefault();
    setErr("");

    if (
      email.trim() === ADMIN_EMAIL &&
      password.trim() === ADMIN_PASSWORD
    ) {
      localStorage.setItem("adminLogin", "true");
      router.push("/admin/all-answers");
    } else {
      setErr("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4">

      <form
        onSubmit={login}
        className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30"
      >

        <div className="text-center mb-8">
          <ShieldCheckIcon className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white drop-shadow">
            Admin Login
          </h1>
          <p className="text-blue-100 mt-2">Authorized access only</p>
        </div>

        {/* Email */}
        <label className="text-white font-medium">Email</label>
        <input
          type="email"
          className="w-full p-3 mt-2 rounded-lg bg-white/40 text-white placeholder-white/70 mb-5
          focus:ring-2 focus:ring-yellow-300 outline-none"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="text-white font-medium">Password</label>
        <div className="relative mb-5">
          <input
            type={showPass ? "text" : "password"}
            className="w-full p-3 mt-2 rounded-lg bg-white/40 text-white placeholder-white/70
            focus:ring-2 focus:ring-yellow-300 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-11 text-white/80 hover:text-white"
          >
            {showPass ? <EyeSlashIcon className="w-6"/> : <EyeIcon className="w-6" />}
          </button>
        </div>

        {err && <p className="text-red-300 text-center mb-4">{err}</p>}

        <button
          type="submit"
          className="w-full bg-yellow-400 text-blue-900 py-3 rounded-xl font-bold text-lg 
          hover:bg-yellow-300 shadow-lg hover:shadow-2xl transition"
        >
          Login
        </button>

      </form>
    </main>
  );
}
