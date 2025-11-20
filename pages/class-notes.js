import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const folders = [
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", category: "SQL" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", category: "Linux" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", category: "PL/SQL" },
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", category: "Project" },
];

export default function ClassNotes() {
  const router = useRouter();
  const [notesList, setNotesList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [previewLink, setPreviewLink] = useState(null);

  const API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual key

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  // Fetch Notes from Drive
  useEffect(() => {
    async function fetchNotes() {
      const allNotes = [];

      for (let folder of folders) {
        try {
          const url = `https://www.googleapis.com/drive/v3/files?q="${folder.id}" in parents and trashed=false&key=${API_KEY}&fields=files(id,name,createdTime,mimeType)&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=100`;

          console.log("FETCHING:", folder.category);
          console.log("URL:", url);

          const res = await fetch(url);
          const raw = await res.text();

          console.log("RAW RESPONSE:", raw); // Debug log

          let data;
          try {
            data = JSON.parse(raw);
          } catch (err) {
            console.error("JSON PARSE ERROR:", err);
            continue;
          }

          console.log("PARSED:", data);

          if (!data.files) continue;

          data.files.forEach((file) => {
            allNotes.push({
              title: file.name,
              category: folder.category,
              link: `https://drive.google.com/file/d/${file.id}/view`,
              preview: `https://drive.google.com/file/d/${file.id}/preview`,
              thumbnail: `https://drive.google.com/thumbnail?id=${file.id}`,
              date: new Date(file.createdTime).toLocaleDateString(),
            });
          });
        } catch (err) {
          console.error("FETCH ERROR:", err);
        }
      }

      setNotesList(allNotes);
    }

    fetchNotes();
  }, []);

  const filteredNotes = notesList.filter(
    (n) =>
      (filter === "All" || n.category === filter) &&
      n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex flex-col">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Class Notes</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow"
        >
          <option>All</option>
          <option>Linux</option>
          <option>SQL</option>
          <option>PL/SQL</option>
          <option>Project</option>
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        {filteredNotes.length === 0 && (
          <p className="text-center col-span-3 text-gray-600 text-xl">
            No notes found.
          </p>
        )}

        {filteredNotes.map((note, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow border">
            <img
              src={note.thumbnail}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-gray-600 text-sm">Category: {note.category}</p>
            <p className="text-gray-600 text-sm">Date: {note.date}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPreviewLink(note.preview)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                View
              </button>
              <a
                href={note.link}
                target="_blank"
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative">
            <button
              onClick={() => setPreviewLink(null)}
              className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded"
            >
              X
            </button>

            <iframe src={previewLink} className="w-full h-[70vh] rounded" />
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
        © 2025 Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
