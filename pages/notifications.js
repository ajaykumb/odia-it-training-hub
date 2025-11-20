import { ArrowLeftIcon, BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New Class Notes Uploaded",
      message: "Linux Class Notes for Week 3 have been added.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Assignment Reminder",
      message: "Submit your Networking Assignment before Friday.",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      title: "Video Lecture Updated",
      message: "SQL Joins full recorded session is now available.",
      time: "3 days ago",
      unread: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100 p-6 md:p-12 relative">
      
      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center gap-4">
        <Link href="/student-dashboard" className="text-white hover:text-gray-200">
          <ArrowLeftIcon className="w-7 h-7" />
        </Link>
        <h1 className="text-4xl font-bold text-white drop-shadow-md flex items-center gap-3">
          <BellIcon className="w-9 h-9" />
          Notifications
        </h1>
      </div>

      {/* Notifications Container */}
      <div className="max-w-3xl mx-auto space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`
              p-5 rounded-xl shadow-md border backdrop-blur-md 
              ${note.unread ? "bg-white border-blue-400" : "bg-white/80 border-gray-200"}
            `}
          >
            <div className="flex justify-between items-start">
              <h3
                className={`text-lg font-semibold ${
                  note.unread ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {note.title}
              </h3>

              {note.unread && (
                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                  New
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-1">{note.message}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">{note.time}</span>

              {!note.unread && (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Read
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
