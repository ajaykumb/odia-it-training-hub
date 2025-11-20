import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

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
    <main className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8">Student Panel</h2>

        <nav className="space-y-4">
          <a className="flex items-center gap-3 hover:text-yellow-300" href="#">
            <HomeIcon className="w-5 h-5" /> Dashboard
          </a>

          <a
            className="flex items-center gap-3 hover:text-yellow-300"
            href="/class-notes"
          >
            <BookOpenIcon className="w-5 h-5" />
            Class Notes
          </a>

          <a
            className="flex items-center gap-3 hover:text-yellow-300"
            href="#"
          >
            <UserIcon className="w-5 h-5" />
            Profile
          </a>

          <button
            onClick={logout}
            className="flex items-center gap-3 mt-6 hover:text-yellow-300"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Welcome to Your Dashboard
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Class Notes</h3>
            <p className="mb-4 text-gray-600">
              Access all your handwritten and PDF class notes.
            </p>
            <a
              href="/class-notes"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Notes
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Video Lectures</h3>
            <p className="mb-4 text-gray-600">
              Watch recorded videos of your classes.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Coming Soon
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Assignments</h3>
            <p className="mb-4 text-gray-600">
              View and submit class assignments.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Coming Soon
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
