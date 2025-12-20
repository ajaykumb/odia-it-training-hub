import nodemailer from "nodemailer";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, message, batch } = req.body;

  // ✅ batch is OPTIONAL now
  if (!title || !message) {
    return res.status(400).json({ error: "Title and message required" });
  }

  try {
    console.log("📢 Preparing announcement email broadcast...");

    let q;

    // ✅ If batch is provided → batch-wise
    if (batch && batch.trim() !== "") {
      q = query(
        collection(db, "students"),
        where("isApproved", "==", true),
        where("batch", "==", batch)
      );
    } 
    // ✅ If batch is empty → ALL approved students
    else {
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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
        to: student.email,
        subject: `📢 Announcement: ${title}`,
        html: `
          <p>Hello <strong>${student.name || "Student"}</strong>,</p>
          <h3>${title}</h3>
          <p>${message}</p>
          <br/>
          <p>Regards,<br/>Odia IT Training Hub Team</p>
        `
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
