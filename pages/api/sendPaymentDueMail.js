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
    console.log("📩 Sending PAYMENT DUE email to:", toEmail);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "⚠️ Payment Pending - Action Required",
      html: `
<div style="background:#f4f6f8;padding:30px 0;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:6px;overflow:hidden">

    <!-- HEADER -->
    <div style="background:#c62828;padding:25px;text-align:center">
      <img
        src="https://www.odiaittraininghub.in/images/logo.png"
        alt="Odia IT Training Hub"
        style="height:60px;margin-bottom:10px"
      />
      <h2 style="color:#ffffff;margin:0">Payment Pending</h2>
    </div>

    <!-- BODY -->
    <div style="padding:30px;color:#333">
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Your course payment is currently <strong style="color:red">pending</strong>.
      </p>

      <div style="background:#fff3cd;padding:15px;border-left:4px solid #ff9800;margin:20px 0">
        <p style="margin:0;font-weight:bold;color:#d35400">
          Action Required
        </p>
        <p style="margin-top:8px;font-size:14px">
          Please complete your payment to continue accessing your dashboard, classes, and study materials.
        </p>
      </div>

      <p>
        Once payment is completed, you can login again and continue your learning.
      </p>

      <p style="margin-top:25px">
        Regards,<br />
        <strong>Odia IT Training Hub Team</strong><br />
        📞 9437401378
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#777">
      © ${new Date().getFullYear()} Odia IT Training Hub
    </div>

  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Payment due email sent successfully");

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Email error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
