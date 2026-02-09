import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    courseId,
    videoTitle,
    batch
  } = req.body;

  if (!courseId || !videoTitle || !batch) {
    return res.status(400).json({
      error: "courseId, videoTitle and batch are required"
    });
  }

  try {
    console.log("🎬 Video upload notification started");
    console.log("➡️ Course:", courseId, "Batch:", batch);

    // =====================================================
    // 🎯 FETCH APPROVED STUDENTS (BATCH-WISE)
    // =====================================================
    const q = query(
      collection(db, "students"),
      where("isApproved", "==", true),
      where("batch", "==", batch)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      console.log("⚠️ No students found for batch:", batch);
      return res.status(200).json({ success: true, sent: 0 });
    }

    const students = snap.docs.map(doc => doc.data());

    // =====================================================
    // 📬 SMTP CONFIG (SAME AS YOUR SYSTEM)
    // =====================================================
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // =====================================================
    // 📧 EMAIL TEMPLATE (VIDEO-SPECIFIC)
    // =====================================================
    const buildTemplate = (name) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial">
  <table width="100%">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border-radius:8px;margin:20px">
          <tr>
            <td style="background:#0f172a;padding:20px;color:#fff;text-align:center">
              <h2>🎬 New Class Video Uploaded</h2>
            </td>
          </tr>

          <tr>
            <td style="padding:25px;color:#333">
              <p>Hello <b>${name}</b>,</p>

              <p>
                Today's session video has been uploaded to the portal.
              </p>

              <div style="background:#f1f5f9;padding:15px;border-left:4px solid #0f172a">
                <p><b>Course:</b> ${courseId}</p>
                <p><b>Topic:</b> ${videoTitle}</p>
              </div>

              <p style="margin-top:20px">
                Please login and watch the recording.
              </p>

              <p>
                Regards,<br/>
                <b>Odia IT Training Hub</b>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f1f5f9;padding:10px;text-align:center;font-size:12px">
              © 2026 Odia IT Training Hub
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // =====================================================
    // ✉️ SEND EMAILS
    // =====================================================
    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
        to: student.email,
        subject: "🎬 Today's Class Video Uploaded",
        html: buildTemplate(student.name || "Student")
      });

      console.log("📨 Sent to:", student.email);
    }

    return res.status(200).json({
      success: true,
      sent: students.length
    });

  } catch (err) {
    console.error("❌ Video mail error:", err);
    return res.status(500).json({
      error: "Failed to send video upload notifications"
    });
  }
}
