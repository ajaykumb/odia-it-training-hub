import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message required" });
  }

  try {
    console.log("📢 Preparing announcement email broadcast...");

    // 1️⃣ Fetch all APPROVED students
    const q = query(
      collection(db, "students"),
      where("isApproved", "==", true)
    );

    const snap = await getDocs(q);
    const students = snap.docs.map(doc => doc.data());

    if (students.length === 0) {
      return res.status(200).json({ success: true, sent: 0 });
    }

    console.log(`📬 Sending emails to ${students.length} students...`);

    // 2️⃣ Configure SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // 3️⃣ Send email to each approved student
    for (const student of students) {
      if (!student.email) continue;

      const mailOptions = {
        from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
        to: student.email,
        subject: `📢 Announcement: ${title}`,
        html: `
          <p>Hello <strong>${student.name}</strong>,</p>
          <p>There is a new announcement from <strong>Odia IT Training Hub</strong>:</p>
          <h3>${title}</h3>
          <p>${message}</p>
          <br/>
          <p>Regards,<br/>Odia IT Training Hub Team</p>
        `
      };

      await transporter.sendMail(mailOptions);
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
