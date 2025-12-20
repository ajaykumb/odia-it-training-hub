import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, message, batch } = req.body;

  // ✅ batch OPTIONAL
  if (!title || !message) {
    return res.status(400).json({ error: "Title and message required" });
  }

  try {
    console.log("📢 Preparing announcement email broadcast...");

    let q;

    // ✅ Batch-wise OR All approved students
    if (batch && batch.trim() !== "") {
      q = query(
        collection(db, "students"),
        where("isApproved", "==", true),
        where("batch", "==", batch)
      );
    } else {
      q = query(
        collection(db, "students"),
        where("isApproved", "==", true)
      );
    }

    const snap = await getDocs(q);
    const students = snap.docs.map(doc => doc.data());

    if (students.length === 0) {
      return res.status(200).json({ success: true, sent: 0 });
    }

    console.log(`📬 Sending emails to ${students.length} students...`);

    // ✅ SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // ✅ PROFESSIONAL HTML TEMPLATE FUNCTION
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

          <!-- HEADER -->
          <tr>
            <td style="background:#1e3a8a; padding:20px; text-align:center; color:#ffffff;">
              <img
                src="https://www.odiaittraininghub.in/images/logo.png"
                alt="Odia IT Training Hub"
                style="max-width:120px; margin-bottom:10px;"
              />
              <h2 style="margin:0;">Odia IT Training Hub</h2>
              <p style="margin:5px 0 0; font-size:14px;">
                Professional IT Training & Support
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>

              <p style="font-size:15px;">
                Please find the latest update from <strong>Odia IT Training Hub</strong>:
              </p>

              <div style="
                background:#f1f5f9;
                padding:16px;
                border-left:4px solid #1e3a8a;
                margin:20px 0;
              ">
                <h3 style="margin:0 0 8px; color:#1e3a8a;">
                  ${title}
                </h3>
                <p style="margin:0; font-size:14px; line-height:1.6;">
                  ${message}
                </p>
              </div>

              <p style="font-size:14px;">
                For any queries, feel free to contact us.
              </p>

              <p style="margin-top:25px; font-size:14px;">
                Regards,<br/>
                <strong>Odia IT Training Hub Team</strong><br/>
                📞 <strong>9437401378</strong>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#555;">
              © 2025 Odia IT Training Hub. All rights reserved.<br/>
              <a href="https://www.odiaittraininghub.in" style="color:#1e3a8a; text-decoration:none;">
                www.odiaittraininghub.in
              </a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

    // ✅ SEND EMAILS
    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
        to: student.email,
        subject: `📢 ${title}`,
        html: buildEmailTemplate(student.name || "Student")
      });

      console.log("📨 Email sent to", student.email);
    }

    return res.status(200).json({
      success: true,
      sent: students.length
    });

  } catch (error) {
    console.error("❌ Announcement email error:", error);
    return res.status(500).json({ error: "Failed to send announcement emails" });
  }
}
