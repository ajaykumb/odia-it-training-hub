import React, { useEffect, useState, useMemo } from "react";

/**
 * ClassNotesEnhanced.jsx — Full Updated Component
 * Includes:
 *  - Google Drive integration
 *  - Dark mode
 *  - Random background image
 */

const API_KEY = "AIzaSyABWqFjKWGLzeK-RyW_rrsSEdqc_EpAEK0";

const FOLDERS = [
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", name: "SQL Note" },
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", name: "Project Note" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", name: "Linux/Unix Note" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", name: "PL/SQL Note" },
];

/* Fallback thumbnail */
const LOCAL_FALLBACK_IMAGE = "/mnt/data/80e95f7b-41c9-4752-be4d-517be8a2daa8.png";

/* Background images (random selection) */
const BACKGROUND_IMAGES = [
  "/mnt/data/69b64539-397f-4733-9274-7ccd7b8b6679.png",
  // Add more if you upload additional images
];

/* debounce helper */
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function fileTypeIcon(mime) {
  if (!mime) return "📄";
  if (mime.includes("pdf")) return "📄";
  if (mime.includes("word")) return "📝";
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

  /* random background image */
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setBgImage(BACKGROUND_IMAGES[randomIndex]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("classnotes:dark", darkMode ? "1" : "0");
    } catch {}
  }, [darkMode]);

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
          throw new Error(`Drive API ${res.status}`);
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
        setError(err.message);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, [activeFolder]);

  const lastUpdated = useMemo(() => {
    if (!files.length) return null;
    const times = files.map((f) =>
      f.createdTime ? new Date(f.createdTime).getTime() : 0
    );
    const max = Math.max(...times);
    return max > 0 ? new Date(max) : null;
  }, [files]);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    let list = files.filter((f) =>
      f.name.toLowerCase().includes(lower)
    );

    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""));
    } else {
      list.sort((a, b) => (a.createdTime || "").localeCompare(b.createdTime || ""));
    }
    return list;
  }, [files, q, sortBy]);

  const thumbOrFallback = (file) => {
    if (file.thumbnailLink) return file.thumbnailLink;
    if (file.mimeType?.startsWith("image/") && file.webContentLink)
      return file.webContentLink;
    return LOCAL_FALLBACK_IMAGE;
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        "--dynamic-bg": `url(${bgImage})`,
      }}
      data-theme={darkMode ? "dark" : "light"}
    >
      {/* Background CSS */}
      <style>{`
        body, [data-theme] {
          background-image: var(--dynamic-bg);
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-attachment: fixed;
        }

        [data-theme="light"] {
          background-color: rgba(255,255,255,0.85);
          backdrop-filter: blur(1px);
        }

        [data-theme="dark"] {
          background-color: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px);
        }

        .card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(4px);
        }

        [data-theme="dark"] .card {
          background: rgba(7,18,38,0.75);
          backdrop-filter: blur(6px);
        }

        .topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
        .folder-btn { padding:10px 16px; border-radius:10px; border:none; cursor:pointer; font-weight:600; }
        .folder-btn.active { background:#0d6efd; color:#fff; }
        .folder-btn.inactive { background:#6c757d; color:#fff; }

        .card { border-radius:12px; overflow:hidden; transition: .2s; border:1px solid rgba(255,255,255,0.25); }
        .card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(16,24,40,0.2); }
        .thumb { width:100%; height:160px; object-fit:cover; background:#f3f4f6; }
        @media(max-width:768px){ .thumb{ height:120px; } }

        .search-input, .sort-select {
          padding:8px 10px; border-radius:8px; border:1px solid #ddd;
        }
      `}</style>

      {/* HEADER */}
      <div className="topbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Odia IT Training Hub — Class Notes</h1>
          {lastUpdated && (
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark
        </label>
      </div>

      {/* FOLDER BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            className={`folder-btn ${activeFolder === f.id ? "active" : "inactive"}`}
            onClick={() => setActiveFolder(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* SEARCH + SORT */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="search-input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        <div style={{ fontSize: 13 }}>
          {loading ? "Loading..." : `${filtered.length} items`}
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 20,
        }}
      >
        {filtered.map((file) => (
          <div key={file.id} className="card">
            <img
              className="thumb"
              src={thumbOrFallback(file)}
              alt={file.name}
              onError={(e) => (e.currentTarget.src = LOCAL_FALLBACK_IMAGE)}
            />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                {file.name}
              </div>

              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {fileTypeIcon(file.mimeType)} {file.mimeType?.split("/")[1]}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button
                  onClick={() => setPreviewFile(file)}
                  style={{
                    background: "#0d6efd",
                    color: "#fff",
                    borderRadius: 8,
                    border: "none",
                    padding: "8px 12px",
                  }}
                >
                  Preview
                </button>

                <a
                  href={
                    file.webContentLink ||
                    file.webViewLink ||
                    `https://drive.google.com/file/d/${file.id}/view`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "8px 12px",
                    textDecoration: "none",
                  }}
                >
                  Open
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1100,
              background: darkMode ? "#071226" : "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <strong>{previewFile.name}</strong>
              <button
                onClick={() => setPreviewFile(null)}
                style={{ background: "#ef4444", color: "#fff", padding: "6px 10px", borderRadius: 8, border: "none" }}
              >
                Close
              </button>
            </div>

            <iframe
              src={
                previewFile.webViewLink ||
                previewFile.webContentLink ||
                `https://drive.google.com/file/d/${previewFile.id}/preview`
              }
              style={{ width: "100%", height: "75vh", border: "none" }}
              title="preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
