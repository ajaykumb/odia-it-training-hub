import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, date, time } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
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
       1️⃣ STUDENT CONFIRMATION
       ========================= */
    const studentMail = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Interview Slot Confirmation | Odia IT Training Hub",
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your interview slot has been <strong>successfully confirmed</strong>.</p>

        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>

        <p>Please be available on time.</p>

        <br/>
        <p>Regards,<br/>
        <strong>Odia IT Training Hub</strong><br/>
        📞 9437401378</p>
      `,
    };

    /* =========================
       2️⃣ TEACHER NOTIFICATION
       ========================= */
    const teacherMail = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER, // teacher email
      subject: "New Interview Slot Booked",
      html: `
        <p>A new interview slot has been booked.</p>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>

        <br/>
        <p>Odia IT Training Hub</p>
      `,
    };

    await transporter.sendMail(studentMail);
    await transporter.sendMail(teacherMail);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Slot email error:", error);
    return res.status(500).json({ error: "Email failed" });
  }
}
