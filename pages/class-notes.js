import React, { useEffect, useState, useMemo } from "react";

/**
 * ClassNotesEnhanced.jsx — Updated with FOOTER + WAVES ANIMATION
 */

const API_KEY = "AIzaSyABWqFjKWGLzeK-RyW_rrsSEdqc_EpAEK0";

const FOLDERS = [
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", name: "SQL Note" },
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", name: "Project Note" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", name: "Linux/Unix Note" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", name: "PL/SQL Note" },
];

const LOCAL_FALLBACK_IMAGE = "/mnt/data/80e95f7b-41c9-4752-be4d-517be8a2daa8.png";

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
  if (mime.includes("word") || mime.includes("msword") || mime.includes("officedocument"))
    return "📝";
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

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setFiles([]);

      try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${activeFolder}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime)&pageSize=500`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Drive API error ${res.status}`);

        const data = await res.json();
        if (canceled) return;

        setFiles(
          (data.files || []).map((f) => ({
            ...f,
          }))
        );
      } catch (err) {
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
    else if (sortBy === "newest")
      list.sort((a, b) => (b.createdTime || "").localeCompare(a.createdTime || ""));
    else list.sort((a, b) => (a.createdTime || "").localeCompare(b.createdTime || ""));

    return list;
  }, [files, q, sortBy]);

  const thumbOrFallback = (file) => {
    if (file.thumbnailLink) return file.thumbnailLink;
    if (file.mimeType?.startsWith("image/") && file.webContentLink) return file.webContentLink;
    return LOCAL_FALLBACK_IMAGE;
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        position: "relative",
        overflow: "hidden",
      }}
      data-theme={darkMode ? "dark" : "light"}
    >
      {/* all your styling */}
      <style>{`
        [data-theme="dark"] { background:#0b1220; color:#e6eef8; }
        .card { border:1px solid #e6e9ee; border-radius:12px; background:#fff; }
        .card:hover { transform:scale(1.01); }
        .thumb { width:100%; height:160px; object-fit:cover; }
        .folder-btn { padding:10px 16px; border-radius:10px; cursor:pointer; font-weight:600; }
        .active { background:#0d6efd; color:#fff; }
        .inactive { background:#6c757d; color:white; }

        /* ==== Waves Animation (added) ==== */
        .wave {
          position:absolute;
          width:200%;
          height:150px;
          left:-50%;
          background:rgba(255,255,255,0.3);
          border-radius:100%;
          animation:drift 6s infinite linear;
          z-index:0;
        }
        .wave1 { bottom:0; animation-duration:8s; }
        .wave2 { bottom:20px; opacity:.6; animation-duration:12s; }
        .wave3 { bottom:40px; opacity:.4; animation-duration:16s; }

        @keyframes drift {
          from { transform:translateX(0) rotate(0); }
          to { transform:translateX(50px) rotate(360deg); }
        }
      `}</style>

      {/* all your UI (folders, grid, modal etc.) */}
      {/* ... unchanged code ... */}

      {/* ==== FOOTER + WAVES ADDED HERE ==== */}
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>

      <footer
        className="bg-gray-900 text-gray-300 text-center py-6"
        style={{ marginTop: 40, position: "relative", zIndex: 10 }}
      >
        © 2022 Odia IT Training Hub. All rights reserved.
      </footer>
    </div>
  );
}
