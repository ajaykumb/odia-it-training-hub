import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("studentToken", "VALID_USER");
      router.push("/student-dashboard");
    } else {
      setError("Invalid username or password");
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
          <label className="text-gray-700 font-medium text-sm">Student ID</label>
          <input
            type="text"
            placeholder="Enter your Student ID"
            className="w-full p-3 border rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="text-gray-700 font-medium text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <button
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition text-lg font-semibold"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2022 Odia IT Training Hub • All Rights Reserved
        </p>

      </div>
    </div>
  );
}
