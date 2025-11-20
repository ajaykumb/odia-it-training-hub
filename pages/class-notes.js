import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Google Drive helper functions
const getPreviewLink = (url) => {
  const id = url.match(/[-\w]{25,}/)?.[0];
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
};

const getThumbnailLink = (url) => {
  const id = url.match(/[-\w]{25,}/)?.[0];
  return id ? `https://drive.google.com/thumbnail?id=${id}` : null;
};

export default function ClassNotes() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, []);

  // Notes list
  const notesList = [
    {
      title: "Linux Class Notes",
      category: "Linux",
      // Convert Google Doc → PDF export
      link: "https://docs.google.com/document/d/1_LVhfNt6zrA7cH_2bbQQ3YPUyhuxRLr37_IAfLbxE3Y/export?format=pdf",
      new: true,
      size: "2.4 MB",
    },
    {
      title: "SQL Class Notes",
      category: "SQL",
      link: "https://drive.google.com/file/d/1-4RGYv33TS3ILJaK3aNM4r5RkFjS66LR/view?usp=drive_link",
      new: false,
      size: "1.8 MB",
    },
    {
      title: "Cyber Security Notes",
      category: "Cyber Security",
      link: "YOUR_GOOGLE_DRIVE_PDF_LINK",
      new: true,
      size: "3.1 MB",
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [previewLink, setPreviewLink] = useState(null);

  const filteredNotes = notesList.filter(
    (n) =>
      (filter === "All" || n.category === filter) &&
      n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-10 flex flex-col">
      
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Class Notes</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          className="px-4 py-2 border rounded-lg shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg shadow"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Linux</option>
          <option>SQL</option>
          <option>Cyber Security</option>
        </select>
      </div>

      {/* Notes List */}
      <div className="grid md:grid-cols-3 gap-6 flex-1">

        {filteredNotes.map((note, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition border"
          >
            <img
              src={getThumbnailLink(note.link)}
              alt="PDF thumbnail"
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            <h3 className="text-xl font-semibold flex items-center gap-2">
              {note.title}
              {note.new && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </h3>

            <p className="text-gray-600 text-sm mt-1">Category: {note.category}</p>
            <p className="text-gray-600 text-sm">Size: {note.size}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPreviewLink(getPreviewLink(note.link))}
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

      {/* PDF Preview Modal */}
      {previewLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-4xl relative">
            <button
              onClick={() => setPreviewLink(null)}
              className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded"
            >
              X
            </button>

            <iframe
              src={previewLink}
              className="w-full h-[70vh] rounded-lg"
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
        © 2022 Odia IT Training Hub. All rights reserved.
      </footer>

    </main>
  );
}
