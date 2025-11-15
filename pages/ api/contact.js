import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,  // Gmail ID
        pass: process.env.MAIL_PASS,  // App Password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: "odiaittraininghub@gmail.com",
      subject: "New Candidate Interested - Odia IT Training Hub",
      text: `
A new candidate submitted interest.

Name: ${name}
Email: ${email}
Phone: ${phone}

Regards,
Website Auto-Mailer
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
