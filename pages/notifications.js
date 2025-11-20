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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const API_KEY = "YOUR_GOOGLE_API_KEY";

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      const all = [];

      for (let folder of folders) {
        try {
          const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${API_KEY}&fields=files(id,name,createdTime)&pageSize=100`
          );

          const data = await res.json();

          if (data.files) {
            data.files.forEach((file) => {
              all.push({
                title: file.name,
                category: folder.category,
                link: `https://drive.google.com/file/d/${file.id}/view`,
                date: new Date(file.createdTime).toLocaleDateString(),
              });
            });
          }
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }

      setNotifications(all);
    }

    fetchNotifications();
  }, []);

  const filtered = notifications.filter(
    (n) =>
      (filter === "All" || n.category === filter) &&
      n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex flex-col">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Notifications</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="px-4 py-2 border rounded-lg shadow"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg shadow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Linux</option>
          <option>SQL</option>
          <option>PL/SQL</option>
          <option>Project</option>
        </select>
      </div>

      {/* Notification Cards */}
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        {filtered.map((note, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow border">
            <h3 className="text-xl font-semibold">{note.title}</h3>

            <p className="text-gray-600 text-sm mt-1">
              Category: {note.category}
            </p>

            <p className="text-gray-600 text-sm">Date: {note.date}</p>

            <a
              href={note.link}
              target="_blank"
              className="bg-green-600 text-white px-3 py-2 rounded-lg mt-3 inline-block"
            >
              View
            </a>
          </div>
        ))}
      </div>

      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
        © 2025 Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
