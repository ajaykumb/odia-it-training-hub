import React, { useEffect, useState, useMemo } from "react";

/**
 * ClassNotesEnhanced.jsx
 * Copy-paste into your project.
 *
 * Important:
 * - API_KEY is already included (you created it earlier).
 * - Folder IDs are included (your folders).
 * - The local image path below points to the screenshot you uploaded; it's used as a fallback thumbnail.
 *
 * Local fallback image path (developer instruction): /mnt/data/80e95f7b-41c9-4752-be4d-517be8a2daa8.png
 */

const API_KEY = "AIzaSyABWqFjKWGLzeK-RyW_rrsSEdqc_EpAEK0";

/* your folders with friendly names */
const FOLDERS = [
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", name: "SQL Note" },
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", name: "Project Note" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", name: "Linux/Unix Note" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", name: "PL/SQL Note" },
];

/* Local fallback image — developer-provided file path */
const LOCAL_FALLBACK_IMAGE = "/mnt/data/80e95f7b-41c9-4752-be4d-517be8a2daa8.png";

/* helper: debounce (ms) */
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/* helper: file type -> icon emoji */
function fileTypeIcon(mime) {
  if (!mime) return "📄";
  if (mime.includes("pdf")) return "📄";
  if (mime.includes("word") || mime.includes("msword") || mime.includes("officedocument")) return "📝";
  if (mime.includes("image")) return "🖼️";
  if (mime.includes("video")) return "🎬";
  if (mime.includes("spreadsheet")) return "📊";
  return "📁";
}

export default function ClassNotesEnhanced() {
  const [activeFolder, setActiveFolder] = useState(FOLDERS[0].id);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const q = useDebounce(search, 250);

  const [sortBy, setSortBy] = useState("newest");
  const [previewFile, setPreviewFile] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("classnotes:dark") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("classnotes:dark", darkMode ? "1" : "0");
    } catch {}
  }, [darkMode]);

  /* load files */
  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${activeFolder}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime)&pageSize=500`;
        const res = await fetch(url);

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Drive API error ${res.status}: ${txt}`);
        }

        const data = await res.json();
        if (canceled) return;

        setFiles(
          (data.files || []).map((f) => ({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            webViewLink: f.webViewLink,
            webContentLink: f.webContentLink,
            thumbnailLink: f.thumbnailLink,
            createdTime: f.createdTime,
          }))
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => (canceled = true);
  }, [activeFolder]);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    let list = files.filter((f) => f.name?.toLowerCase().includes(lower));

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "newest") list.sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""));
    else list.sort((a, b) => (a.createdTime || "").localeCompare(b.createdTime || ""));

    return list;
  }, [files, q, sortBy]);

  const thumbOrFallback = (file) => {
    if (file.thumbnailLink) return file.thumbnailLink;
    if (file.mimeType?.startsWith("image/") && file.webContentLink) return file.webContentLink;
    return LOCAL_FALLBACK_IMAGE;
  };

  return (
    <div style={{ padding: 20, fontFamily: "Inter" }} data-theme={darkMode ? "dark" : "light"}>
      <style>{`
        .title-highlight {
          background: #ffe396;
          padding: 6px 14px;
          border-radius: 10px;
          font-weight: bold;
          display: inline-block;
        }
      `}</style>

      <div className="topbar" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 20 }}>
        
        {/* ✅ UPDATED → Highlighted Title */}
        <h1 className="title-highlight">Odia IT Training Hub — Class Notes</h1>

        <label>
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} /> Dark
        </label>
      </div>

      {/* folders */}
      <div style={{ marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={`folder-btn ${activeFolder === f.id ? "active" : "inactive"}`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* search & sort */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
        {loading
          ? [...Array(6)].map((_, i) => <div key={i} className="skeleton" />)
          : filtered.map((file) => (
              <div key={file.id} className="card">
                <img className="thumb" src={thumbOrFallback(file)} alt="" onError={(e) => (e.currentTarget.src = LOCAL_FALLBACK_IMAGE)} />
                <div className="card-body">
                  <div style={{ fontWeight: 700 }}>{file.name}</div>
                  <a href={file.webContentLink || file.webViewLink} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
