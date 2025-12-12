// pages/student-dashboard.js
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
  PlayIcon,
  ClockIcon,
  InboxIcon,
  SparklesIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import { db } from "../utils/firebaseConfig";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export default function StudentDashboard() {
  const router = useRouter();

  // ---------- Basic states (existing)
  const [isLive, setIsLive] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [className, setClassName] = useState("");

  const [progress] = useState(70);
  const [attendance] = useState(85);

  // ---------- New / existing features
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [countdown, setCountdown] = useState("");

  // New: recordings, assignments, notes latest timestamp
  const [latestRecording, setLatestRecording] = useState(null);
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);
  const [notesLatestAt, setNotesLatestAt] = useState(null);
  const [isNewNotes, setIsNewNotes] = useState(false);

  // Attendance breakdown
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Tip of the day
  const tips = [
    "Practice SQL queries 15 minutes daily.",
    "Read class notes within 24 hours of session.",
    "Attempt small tasks after every lecture.",
    "Ask doubts in chat within 24 hours.",
    "Rewatch recordings for tricky concepts.",
    "Take short breaks during study sessions.",
    "Try coding while you learn — do, then read.",
  ];
  const [tipOfTheDay] = useState(
    tips[new Date().getDate() % tips.length]
  );

  // ---------- Login check (unchanged)
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  // ---------- Live Class listener (unchanged)
  useEffect(() => {
    const liveRef = doc(db, "liveClass", "current");
    const unsub = onSnapshot(liveRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsLive(data.isLive);
        setMeetingUrl(data.meetingUrl);
        setClassName(data.className);
      } else {
        setIsLive(false);
      }
    });
    return () => unsub();
  }, []);

  // ---------- Announcements listener (unchanged)
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

  // ---------- Upcoming class listener (unchanged)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "liveClassStatus", "active"),
      (snap) => {
        if (snap.exists()) setUpcomingClass(snap.data());
        else setUpcomingClass(null);
      }
    );
    return () => unsub();
  }, []);

  // ---------- Countdown timer (unchanged logic)
  useEffect(() => {
    if (!upcomingClass?.nextClassTime) {
      setCountdown("");
      return;
    }

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

  // ---------- Latest recording (new)
  useEffect(() => {
    const q = query(
      collection(db, "recordings"),
      orderBy("uploadedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLatestRecording(docs[0]);
      } else {
        setLatestRecording(null);
      }
    });

    return () => unsub();
  }, []);

  // ---------- Assignments pending count (new)
  useEffect(() => {
    // We assume assignments documents have a field `status` with values like 'pending'/'submitted'
    // If you use another schema, adjust the where clause or remove it to count all.
    const q = query(
      collection(db, "assignments"),
      where("status", "!=", "submitted")
    );

    // Firestore doesn't allow "!=" on all client SDKs in combination with orderBy; if your schema differs,
    // then fetch all and filter locally. So let's add a safe fallback:
    let unsub;
    try {
      unsub = onSnapshot(q, (snap) => {
        setPendingAssignmentsCount(snap.size);
      });
    } catch (err) {
      // fallback: read all and count where status !== 'submitted'
      const q2 = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
      unsub = onSnapshot(q2, (snap) => {
        const list = snap.docs.map((d) => d.data());
        const pending = list.filter((a) => a.status !== "submitted").length;
        setPendingAssignmentsCount(pending);
      });
    }

    return () => unsub && unsub();
  }, []);

  // ---------- Notes latest timestamp + "new" badge (new)
  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const top = snap.docs[0].data();
        const latest = top.updatedAt ? top.updatedAt.toMillis ? top.updatedAt.toMillis() : new Date(top.updatedAt).getTime() : Date.now();
        setNotesLatestAt(latest);

        const lastSeen = localStorage.getItem("lastSeenNotes");
        if (!lastSeen) {
          // if never seen — mark as new
          setIsNewNotes(true);
        } else {
          setIsNewNotes(Number(lastSeen) < latest);
        }
      } else {
        setNotesLatestAt(null);
        setIsNewNotes(false);
      }
    });

    return () => unsub();
  }, []);

  // ---------- Attendance breakdown (new) — reads attendance/{studentId}
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    const unsub = onSnapshot(doc(db, "attendance", studentId), (snap) => {
      if (snap.exists()) {
        setAttendanceDetails(snap.data());
      } else {
        setAttendanceDetails(null);
      }
    });

    return () => unsub();
  }, []);

  // ---------- Logout
  const logout = () => {
    localStorage.removeItem("studentToken");
    router.push("/login");
  };

  const joinLiveClass = () => {
    const url = meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass";
    window.open(url, "_blank");
  };

  // ---------- Helpers
  const markNotesSeen = () => {
    if (notesLatestAt) {
      localStorage.setItem("lastSeenNotes", String(notesLatestAt));
      setIsNewNotes(false);
    }
    router.push("/class-notes");
  };

  const openAssignments = () => {
    router.push("/assignment");
  };

  const viewRecording = () => {
    if (latestRecording?.url) window.open(latestRecording.url, "_blank");
    else router.push("/recordings");
  };

  // header small greeting
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" className="h-10 w-10 object-contain" alt="logo" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Odia IT Training Hub</h1>
              <p className="text-sm text-gray-500">{greeting()}, welcome back</p>
            </div>
          </div>

          {/* center / today's class quick */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              {upcomingClass ? (
                <div>
                  <div className="font-medium text-gray-800">{upcomingClass.topic}</div>
                  <div className="text-xs text-gray-500">Starts: {upcomingClass.nextClassTime}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No class scheduled today</div>
              )}
            </div>
          </div>

          {/* right actions */}
          <div className="flex items-center gap-4">
            <a href="/notifications" className="relative text-gray-600 hover:text-gray-900">
              <BellIcon className="w-6 h-6" />
              {/* small static badge placeholder */}
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">3</span>
            </a>

            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 border border-gray-100 px-3 py-1 rounded-md hover:shadow"
            >
              <img
                src="/images/avatar-placeholder.png"
                className="h-8 w-8 rounded-full object-cover"
                alt="avatar"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-800">Student</div>
                <div className="text-xs text-gray-500">View profile</div>
              </div>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* PAGE LAYOUT */}
      <div className="pt-20 flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Student Panel</h2>

            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-50">
                <HomeIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Dashboard</span>
              </a>

              <a
                href="/class-notes"
                onClick={(e) => { /* keep normal link behavior */ }}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 text-gray-800">
                  <BookOpenIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Class Notes</span>
                </div>

                {isNewNotes && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">NEW</span>
                )}
              </a>

              <button
                onClick={openAssignments}
                className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 text-gray-800">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Assignments</span>
                </div>

                {pendingAssignmentsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    {pendingAssignmentsCount}
                  </span>
                )}
              </button>

              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800">
                <ChartBarIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Progress</span>
              </a>

              <a href="/certificate" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800">
                <span className="text-lg">🎓</span>
                <span className="font-medium">Certificate</span>
              </a>

              <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-800">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Profile</span>
              </a>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-blue-600">
                  <ArrowLeftIcon className="w-5 h-5" />
                  Back to Site
                </a>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Overview of your courses and activities</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/class-notes")}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md hover:shadow"
                >
                  <InboxIcon className="w-4 h-4" />
                  Notes
                </button>

                <button
                  onClick={() => router.push("/assignment")}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md hover:shadow"
                >
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  Assignments
                </button>

                <button
                  onClick={() => setShowAttendanceModal(true)}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md hover:shadow"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Attendance
                </button>
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Course Progress</h3>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-800">{progress}%</div>
                    <div className="text-xs text-gray-400">Modules completed</div>
                  </div>
                  <div className="w-40">
                    <div className="bg-gray-100 h-2 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: "#0f172a" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Attendance</h3>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-green-700">{attendance}%</div>
                  <div className="text-xs text-gray-400">Overall attendance</div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Announcements</h3>
                <div className="mt-3 space-y-2">
                  {announcements.length === 0 && <div className="text-sm text-gray-400">No announcements</div>}
                  {announcements.map((a) => (
                    <div key={a.id} className="text-sm">
                      <div className="font-medium text-gray-800">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Live + Recording */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Class</h3>
                    <p className="text-sm text-gray-600 mt-1">{isLive ? `LIVE: ${className}` : "No live class at the moment"}</p>
                    {isLive ? (
                      <div className="mt-4">
                        <button
                          onClick={joinLiveClass}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          <PlayIcon className="w-4 h-4" />
                          Join Now
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                          Waiting for Teacher
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-72">
                    <h4 className="text-sm text-gray-500">Latest Recording</h4>
                    {latestRecording ? (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="font-medium text-gray-800">{latestRecording.title || "Untitled Recording"}</div>
                        <div className="text-xs text-gray-500 mt-1">{latestRecording.uploadedAt ? new Date(latestRecording.uploadedAt.toMillis ? latestRecording.uploadedAt.toMillis() : latestRecording.uploadedAt).toLocaleString() : ""}</div>
                        <div className="mt-3">
                          <button onClick={viewRecording} className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md hover:shadow">Watch</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-gray-500">No recordings yet</div>
                    )}
                  </div>
                </div>

                {/* Notes & Assignments cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Videos & Class Notes</h4>
                        <p className="text-sm text-gray-500 mt-1">Handwritten notes, PDFs & recorded videos</p>
                      </div>

                      <div className="text-right">
                        {isNewNotes && <div className="text-xs bg-yellow-50 border border-yellow-100 text-yellow-800 px-2 py-1 rounded">New</div>}
                        <div className="text-xs text-gray-400 mt-2">{notesLatestAt ? new Date(Number(notesLatestAt)).toLocaleDateString() : ""}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button onClick={markNotesSeen} className="bg-blue-600 text-white px-4 py-2 rounded-md">View Notes</button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Assignments</h4>
                        <p className="text-sm text-gray-500 mt-1">View and submit assignments</p>
                      </div>

                      <div className="text-right">
                        {pendingAssignmentsCount > 0 ? (
                          <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-red-50 text-red-700 text-sm font-medium">
                            {pendingAssignmentsCount} pending
                          </div>
                        ) : (
                          <div className="text-xs text-green-600">All submitted</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <button onClick={openAssignments} className="bg-blue-600 text-white px-4 py-2 rounded-md">View Assignments</button>
                    </div>
                  </div>
                </div>

                {/* Upcoming class card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900">Upcoming Class</h4>
                  {upcomingClass ? (
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{upcomingClass.topic}</div>
                        <div className="text-sm text-gray-500">Teacher: {upcomingClass.teacher}</div>
                        <div className="text-xs text-gray-400 mt-1">Starts at: {upcomingClass.nextClassTime}</div>
                      </div>

                      <div className="text-right">
                        <div className="bg-blue-50 px-3 py-1 rounded text-blue-700 font-semibold">{countdown || "—"}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-gray-500">No upcoming class</div>
                  )}
                </div>
              </div>

              {/* Right column / Quick Info */}
              <aside className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-72">
                  <h5 className="text-sm font-medium text-gray-700">Tip of the Day</h5>
                  <div className="mt-3 text-sm text-gray-600">{tipOfTheDay}</div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-72">
                  <h5 className="text-sm font-medium text-gray-700">Quick Actions</h5>
                  <div className="mt-3 space-y-2">
                    <button onClick={() => router.push("/class-notes")} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Open Notes</button>
                    <button onClick={() => router.push("/assignment")} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Open Assignments</button>
                    <button onClick={() => router.push("/chat-support")} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50">Open Chat</button>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-72">
                  <h5 className="text-sm font-medium text-gray-700">Your Certificate</h5>
                  <div className="mt-3">
                    <a href="/certificate" className="text-sm text-blue-600">View or download</a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attendance Details</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="p-2 rounded hover:bg-gray-100">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </div>

            {attendanceDetails ? (
              <div className="space-y-3 text-sm text-gray-700">
                <div><strong>Present:</strong> {attendanceDetails.present ?? "—"}</div>
                <div><strong>Absent:</strong> {attendanceDetails.absent ?? "—"}</div>
                <div><strong>Leave:</strong> {attendanceDetails.leave ?? "—"}</div>
                <div><strong>Last Updated:</strong> {attendanceDetails.updatedAt ? new Date(attendanceDetails.updatedAt.toMillis ? attendanceDetails.updatedAt.toMillis() : attendanceDetails.updatedAt).toLocaleString() : "—"}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No attendance data available.</div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 rounded-md border border-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
