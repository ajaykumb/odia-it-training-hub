import { useEffect, useState } from "react";

const CLIENT_ID = "1003811270380-b81a8a0j5mt6d8264rgqgf7dm561vde9.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:3000/class-note";

const folders = [
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", category: "SQL" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", category: "Linux" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", category: "PL/SQL" },
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", category: "Project" },
];

export default function ClassNote() {
  const [accessToken, setAccessToken] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [previewLink, setPreviewLink] = useState(null);

  // Check OAuth token from URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      window.location.hash = "";
    } else {
      const saved = localStorage.getItem("accessToken");
      if (saved) setAccessToken(saved);
    }
  }, []);

  // Google Login
  const handleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/drive.readonly&include_granted_scopes=true`;
    window.location.href = authUrl;
  };

  // Fetch files from Google Drive
  useEffect(() => {
    if (!accessToken) return;

    const fetchNotes = async () => {
      const allNotes = [];

      for (const folder of folders) {
        try {
          const url = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents and trashed=false&fields=files(id,name,createdTime)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives`;

          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await res.json();

          console.log("Fetching folder:", folder.category);
          console.log("Drive response:", data);

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
          console.error("Error fetching notes:", err);
        }
      }

      setNotesList(allNotes);
    };

    fetchNotes();
  }, [accessToken]);

  const filteredNotes = notesList.filter(
    (n) =>
      (filter === "All" || n.category === filter) &&
      n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!accessToken)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Login with Google Drive
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex flex-col">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Class Notes</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      {/* Notes */}
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
