import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { courseId, videoTitle, batch, youtubeId } = req.body;

  if (!courseId || !videoTitle || !batch || !youtubeId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const cleanBatch = batch.trim();

  // ✅ YouTube thumbnail (AUTO – no upload required)
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  try {
    /* =========================
       FETCH STUDENTS (BATCH-WISE)
       ========================= */
    const q = query(
      collection(db, "students"),
      where("isApproved", "==", true),
      where("batch", "==", cleanBatch)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      return res.status(200).json({ success: true, sent: 0 });
    }

    const students = snap.docs.map(d => d.data());

    /* =========================
       SMTP CONFIG
       ========================= */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    /* =========================
       EMAIL TEMPLATE
       ========================= */
    const buildStudentMail = (student) => ({
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: student.email,
      subject: `${cleanBatch} Batch | 🎬 New Class Video Uploaded`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif">

<!-- PREHEADER -->
<div style="display:none;max-height:0;overflow:hidden">
Today’s class video is now available in your My Learning section.
</div>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:30px 10px">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,0.08)">

<!-- HEADER -->
<tr>
<td style="background:#1f3c88;padding:20px;text-align:center">
<img src="https://www.odiaittraininghub.in/images/logo.png"
alt="Odia IT Training Hub"
style="max-height:60px;margin-bottom:10px"/>
<h2 style="color:#ffffff;margin:0;font-weight:500">
${cleanBatch} Batch – New Class Video Uploaded
</h2>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:30px;color:#333">

<p style="font-size:15px">
Dear <strong>${student.name || "Student"}</strong>,
</p>

<p style="font-size:15px;line-height:1.6">
Your <strong>today’s class recording</strong> has been successfully uploaded.
</p>

<table width="100%" cellpadding="10"
style="background:#f5f7ff;border-radius:8px;margin:20px 0">
<tr>
<td><strong>📘 Course:</strong></td>
<td>${courseId}</td>
</tr>
<tr>
<td><strong>🎥 Topic:</strong></td>
<td>${videoTitle}</td>
</tr>
</table>

<!-- VIDEO THUMBNAIL -->
<div style="text-align:center;margin:25px 0">
  <a href="https://www.odiaittraininghub.in/my-learning"
     target="_blank"
     style="text-decoration:none">
    <img
      src="${thumbnailUrl}"
      alt="Class Video Thumbnail"
      style="
        width:100%;
        max-width:520px;
        border-radius:10px;
        box-shadow:0 6px 18px rgba(0,0,0,0.2)
      "
    />
  </a>
</div>

<p style="font-size:13px;color:#555;text-align:center">
Click the image above to watch the class recording in My Learning.
</p>

<!-- CTA -->
<div style="text-align:center;margin:30px 0">
<a href="https://www.odiaittraininghub.in/my-learning"
style="
background:#1f3c88;
color:#ffffff;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;">
👉 Watch Video in My Learning
</a>
</div>

<p style="font-size:14px;line-height:1.6">
Please log in to your <strong>My Learning</strong> section and watch the video at your convenience.
</p>

<p style="font-size:14px;margin-top:20px">
Need help?
</p>

<p style="font-size:14px;line-height:1.8">
📲 <strong>WhatsApp:</strong>
<a href="https://wa.me/919437401378"
style="color:#1f3c88;text-decoration:none">
+91 94374 01378
</a><br/>

🌐 <strong>Website:</strong>
<a href="https://www.odiaittraininghub.in/"
style="color:#1f3c88;text-decoration:none">
www.odiaittraininghub.in
</a>
</p>

<p style="margin-top:30px;font-size:14px">
Best regards,<br/>
<strong>Odia IT Training Hub Team</strong><br/>
Empowering the next generation of IT professionals
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#f0f2f8;text-align:center;
padding:15px;font-size:12px;color:#666">
© ${new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    /* =========================
       SEND EMAILS (PARALLEL)
       ========================= */
    const mailJobs = students
      .filter(s => s.email)
      .map(s => transporter.sendMail(buildStudentMail(s)));

    await Promise.all(mailJobs);

    return res.status(200).json({
      success: true,
      sent: mailJobs.length,
    });

  } catch (error) {
    console.error("❌ Video mail error:", error);
    return res.status(500).json({ error: "Video email failed" });
  }
}
