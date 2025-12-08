// pages/api/download-notes.js

export default function handler(req, res) {
  const fileUrl = "https://drive.google.com/uc?export=download&id=1caQ_TizuxtV4ZwHsQ0lHDXThyUmt1YQi";

  // Redirect the user to Google Drive direct download
  res.redirect(fileUrl);
}
