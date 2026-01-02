import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, message, batch, target } = req.body;
  // target: "all" | "batch" | "newStudents"

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message required" });
  }

  try {
    console.log("📢 Preparing announcement email broadcast...");
    console.log("➡️ Target:", target, "Batch:", batch);

    let recipients = [];

    // =====================================================
    // 🎯 NEW STUDENTS (registrations collection)
    // =====================================================
    if (target === "newStudents") {
      console.log("🎯 Targeting NEW STUDENTS (registrations)");

      const q = query(
        collection(db, "registrations"),
        where("candidateType", "==", "New Student")
      );

      const snap = await getDocs(q);
      recipients = snap.docs.map(doc => doc.data());
    }

    // =====================================================
    // 🎯 SPECIFIC BATCH (students collection)
    // =====================================================
    else if (target === "batch") {
      console.log("🎯 Targeting APPROVED STUDENTS by batch:", batch);

      if (!batch || !batch.trim()) {
        return res.status(400).json({ error: "Batch name is required" });
      }

      const q = query(
        collection(db, "students"),
        where("isApproved", "==", true),
        where("batch", "==", batch)
      );

      const snap = await getDocs(q);
      recipients = snap.docs.map(doc => doc.data());
    }

    // =====================================================
    // 🎯 ALL APPROVED STUDENTS
    // =====================================================
    else {
      console.log("🎯 Targeting ALL APPROVED STUDENTS");

      const q = query(
        collection(db, "students"),
        where("isApproved", "==", true)
      );

      const snap = await getDocs(q);
      recipients = snap.docs.map(doc => doc.data());
    }

    if (recipients.length === 0) {
      console.log("⚠️ No recipients found");
      return res.status(200).json({ success: true, sent: 0 });
    }

    console.log(
      "📧 Emails will be sent to:",
      recipients.map(u => u.email)
    );

    // =====================================================
    // 📬 SMTP CONFIG
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
    // 📄 EMAIL TEMPLATE
    // =====================================================
    const buildEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; margin:20px; border-radius:8px; overflow:hidden;">

          <tr>
            <td style="background:#1e3a8a; padding:20px; text-align:center; color:#ffffff;">
              <img
                src="https://www.odiaittraininghub.in/images/logo.png"
                style="max-width:120px; margin-bottom:10px;"
              />
              <h2 style="margin:0;">Odia IT Training Hub</h2>
              <p style="margin:5px 0 0; font-size:14px;">
                Professional IT Training & Support
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333;">
              <p>Hello <strong>${name}</strong>,</p>

              <div style="background:#f1f5f9; padding:16px; border-left:4px solid #1e3a8a;">
                <h3 style="margin:0 0 8px;">${title}</h3>
                <p style="margin:0;">${message}</p>
              </div>

              <p style="margin-top:20px;">
                Regards,<br/>
                <strong>Odia IT Training Hub Team</strong><br/>
                📞 9437401378
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px;">
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
    for (const user of recipients) {
      if (!user.email) continue;

      await transporter.sendMail({
        from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `📢 ${title}`,
        html: buildEmailTemplate(user.name || "Student")
      });

      console.log("📨 Sent to:", user.email);
    }

    return res.status(200).json({
      success: true,
      sent: recipients.length
    });

  } catch (error) {
    console.error("❌ Announcement email error:", error);
    return res.status(500).json({ error: "Failed to send announcement emails" });
  }
}
