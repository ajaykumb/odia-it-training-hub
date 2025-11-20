import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const folders = [
{ id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", category: "SQL" },
{ id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", category: "Linux" },
{ id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", category: "PL/SQL" },
{ id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", category: "Project" },
];

export default function Notifications() {
const router = useRouter();
const [notifications, setNotifications] = useState([]);
const API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your API key

useEffect(() => {
const token = localStorage.getItem("studentToken");
if (!token) router.push("/login");
}, []);

useEffect(() => {
async function fetchNotifications() {
const allNotifications = [];

```
  for (let folder of folders) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${API_KEY}&fields=files(id,name,webViewLink)`
    );
    const data = await res.json();
    if (data.files) {
      data.files.forEach((file) => {
        allNotifications.push({
          id: file.id,
          title: `New PDF: ${file.name}`,
          message: `${folder.category} notes are available.`,
          link: `https://drive.google.com/file/d/${file.id}/view`,
          time: "Just now",
          unread: true,
        });
      });
    }
  }

  setNotifications(allNotifications);
}

fetchNotifications();
```

}, []);

return ( <main className="min-h-screen bg-gray-100 p-10 flex flex-col"> <h1 className="text-3xl font-bold text-blue-700 mb-6">Notifications</h1>

```
  {notifications.length === 0 ? (
    <p className="text-gray-600">No notifications yet.</p>
  ) : (
    <ul className="space-y-4">
      {notifications.map((note) => (
        <li
          key={note.id}
          className={`p-4 border rounded-lg shadow ${
            note.unread ? "bg-white" : "bg-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <p className="text-gray-600">{note.message}</p>
          <p className="text-sm text-gray-500">{note.time}</p>
          <a
            href={note.link}
            target="_blank"
            className="text-blue-600 mt-2 inline-block"
          >
            Open
          </a>
        </li>
      ))}
    </ul>
  )}

  <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
    © 2022 Odia IT Training Hub. All rights reserved.
  </footer>
</main>
```

);
}
