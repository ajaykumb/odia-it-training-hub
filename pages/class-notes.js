import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ClassNotes() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Class Notes
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-2">Linux Class Notes</h2>
        <p>Download: <a className="text-blue-600" href="/notes/linux.pdf">linux.pdf</a></p>

        <h2 className="text-xl font-bold mb-2 mt-6">SQL Class Notes</h2>
        <p>Download: <a className="text-blue-600" href="/notes/sql.pdf">sql.pdf</a></p>

        <h2 className="text-xl font-bold mb-2 mt-6">Cyber Security Notes</h2>
        <p>Download: <a className="text-blue-600" href="/notes/cyber.pdf">cyber.pdf</a></p>
      </div>
    </main>
  );
}
