import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { toEmail, name } = req.body;

  if (!toEmail || !name) {
    return res.status(400).json({ error: "Missing email or name" });
  }

  try {
    console.log("📩 Sending PAYMENT SUCCESS email to:", toEmail);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "✅ Payment Received - Access Granted",
      html: `
<div style="padding:20px;font-family:Arial">
  <h2>Odia IT Training Hub</h2>
  <p>Hello <b>${name}</b>,</p>

  <p style="color:green;font-weight:bold">
    Your payment has been successfully received.
  </p>

  <p>
    You can now login and access your LMS dashboard, classes, and study materials.
  </p>

  <p>
    👉 Login here: <br/>
    <a href="https://www.odiaittraininghub.in/login">
      www.odiaittraininghub.in/login
    </a>
  </p>

  <br/>
  <p>Happy Learning 🚀</p>

  <p>
    Regards,<br/>
    Odia IT Training Hub
  </p>
</div>
      `,
    });

    console.log("✅ Payment success email sent");

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Email failed" });
  }
}
