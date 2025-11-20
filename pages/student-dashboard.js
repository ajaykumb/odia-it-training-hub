import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
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
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-8 text-blue-700">
            Student Panel
          </h2>

          <nav className="space-y-4 text-gray-700">
            <a className="flex items-center gap-3 hover:text-blue-600" href="#">
              <HomeIcon className="w-5 h-5" /> Dashboard
            </a>

            <a
              className="flex items-center gap-3 hover:text-blue-600"
              href="/class-notes"
            >
              <BookOpenIcon className="w-5 h-5" />
              Class Notes
            </a>

            <a
              className="flex items-center gap-3 hover:text-blue-600"
              href="#"
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-3 mt-6 text-red-600 hover:text-red-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>

            {/* Back to main site */}
            <a
              href="/"
              className="flex items-center gap-3 mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Main Site
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-12">
          <h1 className="text-4xl font-bold text-blue-700 mb-10">
            Welcome to Your Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Class Notes
              </h3>
              <p className="mb-4 text-gray-600">
                Access all your handwritten and PDF class notes.
              </p>
              <a
                href="/class-notes"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                View Notes
              </a>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Video Lectures
              </h3>
              <p className="mb-4 text-gray-600">
                Watch recorded videos of your classes.
              </p>
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-xl transition-all border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Assignments
              </h3>
              <p className="mb-4 text-gray-600">
                View and submit class assignments.
              </p>
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6">
        © 2022 Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
