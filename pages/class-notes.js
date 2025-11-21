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

/* Local fallback image — developer-provided file path (will be transformed by the environment into an URL) */
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

/* helper: file type -> icon emoji (simple, clear) */
function fileTypeIcon(mime) {
  if (!mime) return "📄";
  if (mime.includes("pdf")) return "📄"; // PDF
  if (mime.includes("word") || mime.includes("msword") || mime.includes("officedocument")) return "📝"; // DOCX
  if (mime.includes("image")) return "🖼️"; // images
  if (mime.includes("video")) return "🎬"; // video
  if (mime.includes("spreadsheet")) return "📊"; // sheets
  return "📁";
}

/* format date if present */
function fmtDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ClassNotesEnhanced() {
  const [activeFolder, setActiveFolder] = useState(FOLDERS[0].id);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const q = useDebounce(search, 250);

  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | name
  const [previewFile, setPreviewFile] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("classnotes:dark") === "1";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("classnotes:dark", darkMode ? "1" : "0");
    } catch (e) {}
  }, [darkMode]);

  /* load files from Drive (public folders) */
  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setFiles([]);
      try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${activeFolder}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime)&pageSize=500`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Drive API error ${res.status}: ${txt}`);
        }
        const data = await res.json();
        if (canceled) return;
        const mapped = (data.files || []).map((f) => ({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          webViewLink: f.webViewLink,
          webContentLink: f.webContentLink,
          thumbnailLink: f.thumbnailLink,
          createdTime: f.createdTime,
        }));
        setFiles(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load files");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, [activeFolder]);

  /* derived: last updated */
  const lastUpdated = useMemo(() => {
    if (!files.length) return null;
    const times = files.map((f) => (f.createdTime ? new Date(f.createdTime).getTime() : 0));
    const max = Math.max(...times);
    return max > 0 ? new Date(max) : null;
  }, [files]);

  /* filtered + sorted results */
  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    let list = files.filter((f) => f.name && f.name.toLowerCase().includes(lower));
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""));
    } else {
      list.sort((a, b) => (a.createdTime || "").localeCompare(b.createdTime || ""));
    }
    return list;
  }, [files, q, sortBy]);

  /* small utility: safe thumbnail (use Drive thumbnail if present, else fallback local image) */
  const thumbOrFallback = (file) => {
    if (file.thumbnailLink) return file.thumbnailLink;
    // Use webContentLink if it's an image (to display inline)
    if (file.mimeType && file.mimeType.startsWith("image/") && file.webContentLink) return file.webContentLink;
    // Developer-provided local image path (will be transformed by environment to real URL)
    return LOCAL_FALLBACK_IMAGE;
  };

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} data-theme={darkMode ? "dark" : "light"}>
      {/* styles scoped */}
      <style>{`
        [data-theme="dark"] { background: #0b1220; color: #e6eef8; }
        [data-theme="dark"] .card { background: #071226; border-color: rgba(255,255,255,0.05); }
        .topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
        .folder-btn { padding:10px 16px; border-radius:10px; border:none; cursor:pointer; font-weight:600; }
        .folder-btn.inactive { background:#6c757d; color:#fff; }
        .folder-btn.active { background:#0d6efd; color:#fff; box-shadow:0 6px 18px rgba(13,110,253,0.18); transform:translateY(-2px); }
        .card { border:1px solid #e6e9ee; border-radius:12px; overflow:hidden; transition: transform .18s ease, box-shadow .18s ease; background:#fff; }
        .card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 14px 30px rgba(16,24,40,0.12); }
        .card .thumb { width:100%; height:160px; object-fit:cover; display:block; background:#f3f4f6; }
        .card-body { padding:12px; }
        .open-btn { display:inline-block; margin-top:10px; padding:8px 12px; border-radius:8px; color:#fff; text-decoration:none; background:#0d6efd; }
        .skeleton { background:linear-gradient(90deg,#f0f0f0 25%, #e2e2e2 50%, #f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.1s infinite; border-radius:12px; height:220px; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        .controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .sort-select, .search-input { padding:8px 10px; border-radius:8px; border:1px solid #ddd; }
        .meta { font-size:13px; color:#6b7280; }
        @media (max-width:768px) {
          .card .thumb { height:120px; }
        }
      `}</style>

      <div className="topbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Odia IT Training Hub — Class Notes</h1>
          <div style={{ fontSize: 12, marginLeft: 6 }} className="meta">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : "No files yet"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} /> Dark
          </label>
        </div>
      </div>

      {/* Folder buttons */}
      <div style={{ marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={`folder-btn ${activeFolder === f.id ? "active" : "inactive"}`}
            style={{}}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* controls: search + sort */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }} className="controls">
          <input
            className="search-input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="name">Sort: Name (A–Z)</option>
          </select>
        </div>

        <div style={{ fontSize: 13, color: darkMode ? "#cbd5e1" : "#374151" }}>
          {loading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`}
          {error ? ` • Error: ${error}` : ""}
        </div>
      </div>

      {/* error */}
      {error && (
        <div style={{ padding: 12, borderRadius: 8, background: "#fee2e2", color: "#991b1b", marginBottom: 12 }}>
          <strong>Error loading files:</strong> {error}
          <div style={{ fontSize: 12, marginTop: 6 }}>Make sure API key is set and Drive folders are shared publicly.</div>
        </div>
      )}

      {/* grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))
          : filtered.map((file) => (
              <div key={file.id} className="card">
                <img className="thumb" src={thumbOrFallback(file)} alt={file.name} onError={(e) => (e.currentTarget.src = LOCAL_FALLBACK_IMAGE)} />
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                      <div style={{ fontSize: 12, color: darkMode ? "#9ca3af" : "#6b7280", marginTop: 6 }}>
                        {file.mimeType ? fileTypeIcon(file.mimeType) : "📁"} {file.mimeType ? file.mimeType.split("/")[1] : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: 8 }}>
                      <div style={{ fontSize: 12, color: darkMode ? "#94a3b8" : "#6b7280" }}>{file.createdTime ? new Date(file.createdTime).toLocaleDateString() : ""}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => setPreviewFile(file)}
                      style={{ padding: "8px 12px", borderRadius: 8, background: "#0d6efd", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Preview
                    </button>

                    <a
                      href={file.webContentLink || file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "#fff", textDecoration: "none" }}
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,6,23,0.6)",
            zIndex: 60,
            padding: 20,
          }}
        >
          <div style={{ width: "100%", maxWidth: 1100, background: darkMode ? "#071226" : "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 18px 70px rgba(2,6,23,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight: 700 }}>{previewFile.name}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a href={previewFile.webContentLink || previewFile.webViewLink || `https://drive.google.com/file/d/${previewFile.id}/view`} target="_blank" rel="noreferrer" style={{ padding: "6px 10px", background: "#06b6d4", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
                  Open in new tab
                </a>
                <button onClick={() => setPreviewFile(null)} style={{ padding: "6px 10px", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none" }}>
                  Close
                </button>
              </div>
            </div>

            <div style={{ width: "100%", height: "75vh" }}>
              <iframe
                title="preview"
                src={previewFile.webViewLink || previewFile.webContentLink || `https://drive.google.com/file/d/${previewFile.id}/preview`}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
