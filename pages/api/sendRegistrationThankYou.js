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
    console.log("📩 Sending registration thank-you email to:", toEmail);

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
      subject: "Thank You for Registering with Odia IT Training Hub",
      html: `
<div style="background:#f4f6f8;padding:30px 0;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:6px;overflow:hidden">

    <!-- HEADER -->
    <div style="background:#1f3c88;padding:25px;text-align:center">
      <img
        src="https://www.odiaittraininghub.in/images/logo.png"
        alt="Odia IT Training Hub"
        style="height:60px;margin-bottom:10px"
      />
      <h2 style="color:#ffffff;margin:0">Odia IT Training Hub</h2>
      <p style="color:#dbe4ff;font-size:13px;margin-top:5px">
        Professional IT Training & Support
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:30px;color:#333">
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Thank you for registering with
        <strong>Odia IT Training Hub</strong> and for showing interest in our IT
        training programs.
      </p>

      <div style="background:#f1f5ff;padding:15px;border-left:4px solid #1f3c88;margin:20px 0">
        <p style="margin:0;font-weight:bold;color:#1f3c88">
          Registration Successful
        </p>
        <p style="margin-top:8px;font-size:14px">
          Please keep monitoring your email. You will receive updates regarding:
        </p>
        <ul style="font-size:14px">
          <li>New batch schedules</li>
          <li>Upcoming class details</li>
          <li>Course and training updates</li>
        </ul>
      </div>

      <!-- WHATSAPP JOIN SECTION -->
      <div style="text-align:center;margin:30px 0">
        <p style="font-size:14px;margin-bottom:10px">
          📢 Join our official WhatsApp group for instant updates:
        </p>
        <a
          href="https://chat.whatsapp.com/KcJLuxqS6X0LZWJXPPQMcf"
          target="_blank"
          style="
            display:inline-block;
            background:#25D366;
            color:#ffffff;
            text-decoration:none;
            padding:12px 22px;
            border-radius:6px;
            font-weight:bold;
            font-size:14px;
          "
        >
          👉 Join WhatsApp Group
        </a>
      </div>

      <p>
        For more information, please visit our website:
        <br />
        <a href="https://www.odiaittraininghub.in" style="color:#1f3c88">
          www.odiaittraininghub.in
        </a>
      </p>

      <p style="margin-top:25px">
        Regards,<br />
        <strong>Odia IT Training Hub Team</strong><br />
        📞 9437401378
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#777">
      © ${new Date().getFullYear()} Odia IT Training Hub. All rights reserved.<br />
      <a href="https://www.odiaittraininghub.in" style="color:#777">
        www.odiaittraininghub.in
      </a>
    </div>

  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Registration thank-you email sent successfully");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Email error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
