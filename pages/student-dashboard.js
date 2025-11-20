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
    <main className="relative min-h-screen flex flex-col">

      {/* 🌊 Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* LAYOUT FIX: make responsive */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* Sidebar FIXED: responsive width */}
        <aside className="w-full md:w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl p-6">
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

            <a className="flex items-center gap-3 hover:text-blue-600" href="#">
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

            <a
              href="/"
              className="flex items-center gap-3 mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Main Site
            </a>
          </nav>
        </aside>

        {/* Main Content  FIXED: responsive padding and width */}
        <section className="flex-1 p-6 md:p-12 w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-10">
            Welcome to Your Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Class Notes
              </h3>
              <p className="mb-4 text-gray-600">
                Access all your handwritten and PDF class notes.
              </p>
              <a
                href="/class-notes"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                View Notes
              </a>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border">
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

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border">
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
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-auto">
        © 2022 Odia IT Training Hub. All rights reserved.
      </footer>

      {/* Waves */}
      <style jsx>{`
        .wave {
          position: absolute;
          width: 200%;
          height: 200px;
          left: -50%;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100%;
          animation: drift 6s infinite linear;
        }
        .wave1 { bottom: 0; animation-duration: 8s; }
        .wave2 { bottom: 30px; opacity: 0.6; animation-duration: 12s; }
        .wave3 { bottom: 60px; opacity: 0.4; animation-duration: 16s; }
        @keyframes drift {
          from { transform: translateX(0) rotate(0deg); }
          to { transform: translateX(50px) rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
