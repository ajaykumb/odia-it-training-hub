import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import { db } from "../utils/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

export default function StudentDashboard() {
  const router = useRouter();

  const [isLive, setIsLive] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [className, setClassName] = useState("");

  const [progress] = useState(70);
  const [attendance] = useState(85);

  // Login check
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  // Live class listener
  useEffect(() => {
    const liveRef = doc(db, "liveClass", "current");
    const unsub = onSnapshot(liveRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsLive(data.isLive);
        setMeetingUrl(data.meetingUrl);
        setClassName(data.className);
      }
    });
    return () => unsub();
  }, []);

  const logout = () => {
    localStorage.removeItem("studentToken");
    router.push("/login");
  };

  const joinLiveClass = () => {
    const url = meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass";
    window.open(url, "_blank");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-300 to-blue-100">

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-blue-800">
              Odia IT Training Hub — LMS
            </h1>
          </div>
          <a href="/notifications" className="text-gray-700 hover:text-blue-700">
            <BellIcon className="w-7 h-7" />
          </a>
        </div>
      </header>

      {/* SIDEBAR + CONTENT */}
      <div className="flex pt-20 min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">Student Panel</h2>

          <nav className="space-y-4 text-gray-700">

            <a className="flex items-center gap-3 hover:text-blue-600" href="#">
              <HomeIcon className="w-5 h-5" /> Dashboard
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/class-notes">
              <BookOpenIcon className="w-5 h-5" /> Class Notes
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/assignment">
              <ClipboardDocumentListIcon className="w-5 h-5" /> Assignments
            </a>

            {/* Removed Video Lectures */}
            {/* Removed Next Class */}

            <a className="flex items-center gap-3 hover:text-blue-600" href="#">
              <ChartBarIcon className="w-5 h-5" /> Progress
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/certificate">
              🎓 Certificate
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/profile">
              <UserIcon className="w-5 h-5" /> Profile
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-600 hover:text-red-700 mt-6"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>

            <a href="/" className="flex items-center gap-3 text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="w-5 h-5" /> Back to Main Site
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-10 drop-shadow">
            Welcome to Your Dashboard
          </h1>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Course Progress</h3>
              <p className="text-blue-700 font-bold text-3xl">{progress}%</p>
              <div className="bg-gray-200 h-2 mt-3 rounded-full">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Attendance</h3>
              <p className="text-green-700 font-bold text-3xl">{attendance}%</p>
            </div>

            {/* Next Class REMOVED */}

          </div>

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Notes */}
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Class Notes</h3>
              <p className="text-gray-500 mb-4">Handwritten + PDFs</p>
              <a href="/class-notes" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                View Notes
              </a>
            </div>

            {/* Assignments */}
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Assignments</h3>
              <p className="text-gray-500 mb-4">View and submit assignments</p>
              <a href="/assignment" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                View Assignments
              </a>
            </div>

            {/* Live Class */}
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Live Class</h3>
              {isLive ? (
                <>
                  <p className="text-green-700 mb-4 font-semibold">LIVE: {className}</p>
                  <button
                    onClick={joinLiveClass}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
                  >
                    Join Now
                  </button>
                </>
              ) : (
                <>
                  <p className="text-red-500 mb-4">No live class now</p>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                    Waiting for Teacher
                  </button>
                </>
              )}
            </div>

            {/* Certificate */}
            <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Your Certificate</h3>
              <p className="text-gray-500 mb-4">Download your course completion certificate</p>
              <a
                href="/certificate"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
              >
                View Certificate
              </a>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
