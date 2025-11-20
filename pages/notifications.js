import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Same folders as ClassNotes
const folders = [
{ id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", category: "SQL" },
{ id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", category: "Linux" },
{ id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", category: "PL/SQL" },
{ id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", category: "Project" },
];

export default function Notifications() {
const router = useRouter();
const [notifications, setNotifications] = useState([]);
const API_KEY = "YOUR_GOOGLE_API_KEY"; // <-- Replace with your API key

// Redirect if not logged in
useEffect(() => {
const token = localStorage.getItem("studentToken");
if (!token) router.push("/login");
}, []);

// Fetch notifications from Google Drive
useEffect(() => {
async function fetchNotifications() {
const allNotes = [];

```
  for (let folder of folders) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${API_KEY}&fields=files(id,name,webViewLink)`
    );
    const data = await res.json();
    if (data.files) {
      data.files.forEach((file) => {
        allNotes.push({
          id: file.id,
          title: file.name,
          category: folder.category,
          link: `https://drive.google.com/file/d/${file.id}/view`,
          unread: true,
        });
      });
    }
  }

  // Sort by newest first (optional)
  allNotes.sort((a, b) => (a.title < b.title ? 1 : -1));
  setNotifications(allNotes);
}

fetchNotifications();
```

}, []);

const markAsRead = (id) => {
setNotifications((prev) =>
prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
);
};

return ( <main className="min-h-screen bg-gray-100 p-10 flex flex-col"> <h1 className="text-3xl font-bold text-blue-700 mb-6">Notifications</h1>

```
  {notifications.length === 0 && (
    <p className="text-gray-600">No notifications yet.</p>
  )}

  <ul className="space-y-4">
    {notifications.map((note) => (
      <li
        key={note.id}
        className={`p-4 rounded-lg shadow ${
          note.unread ? "bg-blue-100" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-600">
              Category: {note.category}
            </p>
          </div>
          <div className="flex gap-2">
            {note.unread && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                NEW
              </span>
            )}
            <a
              href={note.link}
              target="_blank"
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              View PDF
            </a>
            {note.unread && (
              <button
                onClick={() => markAsRead(note.id)}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm"
              >
                Mark Read
              </button>
            )}
          </div>
        </div>
      </li>
    ))}
  </ul>

  {/* Footer */}
  <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
    © 2022 Odia IT Training Hub. All rights reserved.
  </footer>
</main>
```

);
}
