import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { toEmail, name } = req.body;

  try {
    console.log("📩 Sending email to:", toEmail);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "Your Registration is Approved 🎉",
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your registration for <strong>Odia IT Training Hub</strong> has been approved!</p>
        <p>You can now log in and start accessing your courses.</p>
        <br/>
        <p>Regards,<br/>Odia IT Training Hub Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Email error:", error.response || error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
