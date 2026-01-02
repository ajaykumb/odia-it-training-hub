import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { toEmail, name } = req.body;

  try {
    console.log("📩 Sending registration thank-you email to:", toEmail);

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
      subject: "Thank You for Registering with Odia IT Training Hub",
      html: `
        <p>Dear <strong>${name}</strong>,</p>

        <p>
          Thank you for registering with <strong>Odia IT Training Hub</strong>
          and for showing interest in our IT training programs.
        </p>

        <p>
          Please keep monitoring your email. You will receive updates about:
        </p>

        <ul>
          <li>New batch schedules</li>
          <li>Upcoming classes</li>
          <li>Course and training details</li>
        </ul>

        <p>
          For more information, please visit our website:
          <br/>
          <a href="https://www.odiaittraininghub.in">
            www.odiaittraininghub.in
          </a>
        </p>

        <br/>

        <p>
          Warm regards,<br/>
          <strong>Odia IT Training Hub</strong><br/>
          support@odiaittraininghub.in
        </p>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Registration thank-you email sent");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Email error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
