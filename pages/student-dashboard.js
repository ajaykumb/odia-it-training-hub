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
  VideoCameraIcon,
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

  // NEW FEATURES
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [latestRecording, setLatestRecording] = useState(null);

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

  // ANNOUNCEMENTS LISTENER
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

  // UPCOMING CLASS LISTENER
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "liveClassStatus", "active"),
      (snap) => {
        if (snap.exists()) setUpcomingClass(snap.data());
      }
    );
    return () => unsub();
  }, []);

  // COUNTDOWN
  useEffect(() => {
    if (!upcomingClass?.nextClassTime) return;

    const interval = setInterval(() => {
      const diff = new Date(upcomingClass.nextClassTime) - new Date();
      if (diff <= 0) return setCountdown("Starting soon...");

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingClass]);

  // LATEST RECORDING
  useEffect(() => {
    const q = query(
      collection(db, "recordings"),
      orderBy("uploadedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setLatestRecording(data);
      }
    });

    return () => unsub();
  }, []);

  const logout = () => {
    localStorage.removeItem("studentToken");
    router.push("/login");
  };

  const joinLiveClass = () => {
    const url =
      meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass";
    window.open(url, "_blank");
  };

  // UI START
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* BLUE TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-[#1F6FEB] text-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="h-10 w-10" />
            <h1 className="text-xl font-semibold tracking-wide">
              Odia IT Training Hub — LMS
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/notifications"
              className="hover:text-gray-200 transition"
            >
              <BellIcon className="w-7 h-7" />
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-md hover:bg-white/30"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* PAGE LAYOUT */}
      <div className="flex pt-20">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h2>

          <nav className="space-y-2 text-gray-700">
            <a className="flex items-center gap-3 hover:text-[#1F6FEB]" href="#">
              <HomeIcon className="w-5 h-5" /> Dashboard
            </a>

            <a
              className="flex items-center gap-3 hover:text-[#1F6FEB]"
              href="/class-notes"
            >
              <BookOpenIcon className="w-5 h-5" /> Class Notes
            </a>

            <a
              className="flex items-center gap-3 hover:text-[#1F6FEB]"
              href="/assignment"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Assignments
            </a>

            <a className="flex items-center gap-3 hover:text-[#1F6FEB]" href="#">
              <ChartBarIcon className="w-5 h-5" /> Progress
            </a>

            <a
              className="flex items-center gap-3 hover:text-[#1F6FEB]"
              href="/certificate"
            >
              🎓 Certificate
            </a>

            <a
              className="flex items-center gap-3 hover:text-[#1F6FEB]"
              href="/profile"
            >
              <UserIcon className="w-5 h-5" /> Profile
            </a>

            <a
              href="/"
              className="flex items-center gap-3 text-blue-600 hover:text-blue-800 mt-6"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back to Main Site
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Dashboard Overview
          </h1>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* PROGRESS CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm text-gray-500">Course Progress</h3>
              <p className="text-[#1F6FEB] font-bold text-4xl mt-3">
                {progress}%
              </p>
              <div className="bg-gray-200 h-2 mt-3 rounded-full">
                <div
                  className="bg-[#1F6FEB] h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* ATTENDANCE CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm text-gray-500">Attendance</h3>
              <p className="text-green-600 font-bold text-4xl mt-3">
                {attendance}%
              </p>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm text-gray-500 mb-3">Announcements</h3>

              {announcements.length === 0 && (
                <p className="text-gray-500 text-sm">No announcements</p>
              )}

              {announcements.map((item) => (
                <div key={item.id} className="pb-2 mb-2 border-b">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-gray-600 text-sm">{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NOTES CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Class Notes
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Handwritten notes, PDFs, and study material
              </p>
              <a
                href="/class-notes"
                className="bg-[#1F6FEB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                View Notes
              </a>
            </div>

            {/* ASSIGNMENTS CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Assignments
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                View and submit assignments
              </p>
              <a
                href="/assignment"
                className="bg-[#1F6FEB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                View Assignments
              </a>
            </div>

            {/* UPCOMING CLASS CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Upcoming Class
              </h3>

              {upcomingClass ? (
                <>
                  <p>
                    <strong>Topic:</strong> {upcomingClass.topic}
                  </p>
                  <p>
                    <strong>Teacher:</strong> {upcomingClass.teacher}
                  </p>
                  <p className="mt-2">
                    <strong>Starts at:</strong> {upcomingClass.nextClassTime}
                  </p>

                  <p className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg mt-3 text-center font-semibold">
                    {countdown}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No upcoming class</p>
              )}
            </div>

            {/* LIVE CLASS */}
            <div className="bg-white col-span-1 md:col-span-3 rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-2">Live Class</h3>

              {isLive ? (
                <>
                  <p className="text-green-700 mb-4 font-semibold">
                    LIVE: {className}
                  </p>
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

            {/* RECORDING CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <VideoCameraIcon className="w-6 h-6 text-[#1F6FEB]" />
                Latest Recording
              </h3>

              {latestRecording ? (
                <>
                  <p className="mt-3 font-medium text-gray-800">
                    {latestRecording.title}
                  </p>
                  <button
                    onClick={() => window.open(latestRecording.url)}
                    className="bg-[#1F6FEB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 mt-3"
                  >
                    Watch Recording
                  </button>
                </>
              ) : (
                <p className="text-gray-500 mt-2">No recordings uploaded</p>
              )}
            </div>

            {/* CHAT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold">Chat Support</h3>
              <p className="text-gray-500 text-sm mb-4">
                Talk to your instructor in real time
              </p>
              <a
                href="/chat-support"
                className="bg-[#1F6FEB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
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
