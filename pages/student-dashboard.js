import { useEffect } from "react";
import { useRouter } from "next/router";

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  const logout = () => {
    localStorage.removeItem("studentToken");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        Welcome to Student Dashboard
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded mb-6"
      >
        Logout
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Class Notes</h2>

        <p>Click below to access class notes.</p>

        <a
          href="/class-notes"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Notes
        </a>
      </div>
    </main>
  );
}
