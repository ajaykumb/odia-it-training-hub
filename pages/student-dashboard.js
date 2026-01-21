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
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";

export default function StudentDashboard() {
  const router = useRouter();

  const [isLive, setIsLive] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [className, setClassName] = useState("");

  const [progress] = useState(70);
  const [attendance] = useState(85);

  const [announcements, setAnnouncements] = useState([]);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [countdown, setCountdown] = useState("");

  // LOGIN CHECK
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);


  // LIVE CLASS LISTENER
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

  // ANNOUNCEMENTS
  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAnnouncements(list.slice(0, 3));
    });
    return () => unsub();
  }, []);

  // UPCOMING CLASS
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "liveClassStatus", "active"),
      (snap) => {
        if (snap.exists()) setUpcomingClass(snap.data());
      }
    );
    return () => unsub();
  }, []);

  // COUNTDOWN TIMER
  useEffect(() => {
    if (!upcomingClass?.nextClassTime) return;

    const interval = setInterval(() => {
      const diff = new Date(upcomingClass.nextClassTime) - new Date();
      if (diff <= 0) {
        setCountdown("Starting soon...");
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingClass]);

  const logout = () => {
    localStorage.removeItem("studentToken");
    router.push("/login");
  };

  const joinLiveClass = () => {
    const url =
      meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass";
    window.open(url, "_blank");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-300 to-blue-100">

      {/* HEADER */}
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
        
            <a className="flex items-center gap-3 hover:text-blue-600"
             href="/my-learning">
            <BookOpenIcon className="w-5 h-5" /> My Learning
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/class-notes">
              <BookOpenIcon className="w-5 h-5" /> Class Notes
            </a>

            <a className="flex items-center gap-3 hover:text-blue-600" href="/assignment">
              <ClipboardDocumentListIcon className="w-5 h-5" /> Assignments
            </a>

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


          {/* UPDATED SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

            {/* PROGRESS CARD */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Course Progress</h3>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm font-bold">📘</div>
              </div>

              <p className="text-blue-700 font-extrabold text-4xl mt-4">{progress}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-2">You're doing great — keep going!</p>
            </div>

            {/* ATTENDANCE CARD */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
                <div className="bg-green-100 text-green-600 p-2 rounded-lg text-sm font-bold">📅</div>
              </div>

              <p className="text-green-700 font-extrabold text-4xl mt-4">{attendance}%</p>
              <p className="text-xs text-gray-500 mt-2">Minimum 75% required for certificate</p>
            </div>

            {/* ANNOUNCEMENTS CARD */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Announcements</h3>
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-sm font-bold">📢</div>
              </div>

              <div className="mt-4 space-y-3">
                {announcements.length === 0 && (
                  <p className="text-gray-500 text-sm">No announcements</p>
                )}

                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-md shadow-sm"
                  >
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-gray-600 text-sm">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UPDATED MAIN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* NOTES */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                📚 Class Notes
              </h3>
              <p className="text-gray-500 text-sm mb-4">Handwritten notes, PDFs & videos</p>
              <a
                href="/class-notes"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 shadow"
              >
                View Notes
              </a>
            </div>

            {/* ASSIGNMENTS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                📝 Assignments
              </h3>
              <p className="text-gray-500 text-sm mb-4">View & submit assignments</p>
              <a
                href="/assignment"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 shadow"
              >
                View Assignments
              </a>
            </div>

            {/* UPCOMING CLASS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                📘 Upcoming Class
              </h3>

              {upcomingClass ? (
                <>
                  <p><strong>Topic:</strong> {upcomingClass.topic}</p>
                  <p><strong>Teacher:</strong> {upcomingClass.teacher}</p>
                  <p className="mt-1"><strong>Starts at:</strong> {upcomingClass.nextClassTime}</p>

                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md mt-3 text-center font-semibold shadow-sm">
                    {countdown}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No upcoming class</p>
              )}
            </div>

            {/* LIVE CLASS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200 col-span-1 md:col-span-3">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🎥 Live Class
              </h3>

              {isLive ? (
                <div>
                  <p className="text-green-600 font-semibold mb-3">🔴 LIVE NOW: {className}</p>
                  <button
                    onClick={joinLiveClass}
                    className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
                  >
                    Join Live Class
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-red-500 font-semibold mb-3">No live class at the moment</p>
                  <button className="bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed">
                    Waiting for Teacher
                  </button>
                </div>
              )}
            </div>

{/* MY LEARNING  CARD*/} 
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
  <h3 className="text-xl font-semibold flex items-center gap-2">
    🎬 My Learning
  </h3>
  <p className="text-gray-500 text-sm mb-4">
    Continue watching course videos
  </p>

  <div className="mb-3">
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-2 bg-blue-600"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">
      {progress}% completed
    </p>
  </div>

  <a
    href="/my-learning"
    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow"
  >
    Continue Learning
  </a>
</div>


            {/* CERTIFICATE */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold flex items-center gap-2">🎓 Certificate</h3>
              <p className="text-gray-500 text-sm mb-4">Download your course completion certificate</p>
              <a
                href="/certificate"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 shadow"
              >
                View Certificate
              </a>
            </div>

            {/* CHAT SUPPORT */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold flex items-center gap-2">💬 Chat Support</h3>
              <p className="text-gray-500 text-sm mb-4">Talk to your instructor in real time</p>
              <a
                href="/chat-support"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow"
              >
                Open Chat
              </a>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
