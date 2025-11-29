import { useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/all-answers");
    } catch (e) {
      setErr("Invalid login details");
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Test Answer Admin Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-md mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-md mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      {err && <p className="text-red-600">{err}</p>}

      <button
        onClick={login}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
      >
        Login
      </button>
    </main>
  );
}
