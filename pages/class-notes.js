import React, { useEffect, useState, useMemo } from "react";

/**
 * ClassNotesEnhanced.jsx
 * Dark Mode Always Enabled — NO WAVING / NO ROTATION
 */

const API_KEY = "AIzaSyABWqFjKWGLzeK-RyW_rrsSEdqc_EpAEK0";

const FOLDERS = [
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", name: "Project Note" },
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", name: "SQL Note" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", name: "PL/SQL Note" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", name: "Linux/Unix Note" },
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

  const darkMode = true;

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

        setFiles(data.files || []);
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
        fontFamily: "Inter, system-ui",
        position: "relative",
        background: "#0b1220",
        color: "#e6eef8",
      }}
      data-theme="dark"
    >
      {/* TOP BAR */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 15 }}>
        Odia IT Training Hub — Class Notes
      </h2>

      {/* FOLDER BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: activeFolder === f.id ? "#0d6efd" : "#6c757d",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* SEARCH + SORT */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111827",
            color: "white",
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111827",
            color: "white",
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 220, background: "#1f2937", borderRadius: 10 }} />
            ))
          : filtered.map((file) => (
              <div
                key={file.id}
                style={{
                  border: "1px solid #1f2937",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#071226",
                }}
              >
                <img
                  src={thumbOrFallback(file)}
                  alt={file.name}
                  style={{ width: "100%", height: 160, objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.src = LOCAL_FALLBACK_IMAGE)}
                />
                <div style={{ padding: 12 }}>
                  <b>{file.name}</b>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {fileTypeIcon(file.mimeType)} {file.mimeType}
                  </div>

                  <button
                    onClick={() => setPreviewFile(file)}
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#0d6efd",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Preview
                  </button>

                  <a
                    href={file.webContentLink || file.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginLeft: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#10b981",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Open
                  </a>
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
            zIndex: 100,
            padding: 20,
          }}
        >
          <div style={{ width: "90%", maxWidth: 900, background: "#fff", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
              <b>{previewFile.name}</b>
              <button onClick={() => setPreviewFile(null)}>Close</button>
            </div>
            <iframe
              src={previewFile.webViewLink}
              style={{ width: "100%", height: "70vh", border: "none" }}
            />
          </div>
        </div>
      )}

      {/* FOOTER (NO WAVES) */}
      <footer
        style={{
          background: "#111827",
          color: "#ccc",
          textAlign: "center",
          padding: "14px 0",
          marginTop: 40,
          position: "relative",
        }}
      >
        © 2022 Odia IT Training Hub. All rights reserved.
      </footer>
    </div>
  );
}
