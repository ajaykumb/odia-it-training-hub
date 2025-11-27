import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { toEmail, name } = req.body;

  try {
    // 1. Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS 
      }
    });

    // 2. Email details
    const mailOptions = {
      from: `"Odia IT Training Hub" <${process.env.GMAIL_USER}>`,
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

    // 3. Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
