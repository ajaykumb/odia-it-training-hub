import React, { useEffect, useState } from "react";

const API_KEY = "AIzaSyABWqFjKWGLzeK-RyW_rrsSEcdqc_EpAEK0";

// Your folder list
const FOLDERS = [
  { id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", name: "Folder 1" },
  { id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", name: "Folder 2" },
  { id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", name: "Folder 3" },
  { id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", name: "Folder 4" },
];

export default function ClassNotes() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState(FOLDERS[0].id);

  const loadDriveFiles = async (folderId) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink)`
      );

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error loading files:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDriveFiles(activeFolder);
  }, [activeFolder]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Class Notes</h2>

      {/* Folder Buttons */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
        {FOLDERS.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              background:
                activeFolder === folder.id ? "#007bff" : "#6c757d",
              color: "white",
              cursor: "pointer",
            }}
          >
            {folder.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading files...</p>}

      {!loading && files.length === 0 && <p>No files found.</p>}

      {/* File Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {files.map((file) => (
          <div
            key={file.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              background: "#fafafa",
              textAlign: "center",
            }}
          >
            <img
              src={
                file.thumbnailLink ||
                "https://via.placeholder.com/150?text=No+Preview"
              }
              alt={file.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h4 style={{ marginTop: "10px", fontSize: "16px" }}>
              {file.name}
            </h4>

            <a
              href={file.webContentLink || file.webViewLink}
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: "10px",
                display: "inline-block",
                padding: "10px 15px",
                background: "#007bff",
                color: "white",
                borderRadius: "5px",
                textDecoration: "none",
              }}
            >
              Open File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
