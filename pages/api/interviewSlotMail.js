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
       1️⃣ STUDENT CONFIRMATION (PROFESSIONAL)
       ========================= */
    const studentMail = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Interview Slot Confirmed | Odia IT Training Hub",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:10px;overflow:hidden;
                 box-shadow:0 10px 30px rgba(0,0,0,0.08)">

          <!-- HEADER -->
          <tr>
            <td style="background:#1f3c88;padding:20px;text-align:center">
              <img
                src="https://www.odiaittraininghub.in/images/logo.png"
                alt="Odia IT Training Hub"
                style="max-height:60px;margin-bottom:10px"
              />
              <h2 style="color:#ffffff;margin:0;font-weight:500">
                Interview Slot Confirmed
              </h2>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px;color:#333">

              <p style="font-size:15px">
                Dear <strong>${name}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6">
                We are pleased to inform you that your interview slot with
                <strong>Odia IT Training Hub</strong> has been
                <strong>successfully confirmed</strong>.
              </p>

              <table width="100%" cellpadding="10"
                style="background:#f5f7ff;border-radius:8px;margin:20px 0">
                <tr>
                  <td><strong>📅 Interview Date:</strong></td>
                  <td>${date}</td>
                </tr>
                <tr>
                  <td><strong>⏰ Interview Time:</strong></td>
                  <td>${time}</td>
                </tr>
              </table>

              <p style="font-size:14px;line-height:1.6">
                Please ensure you are available on time.
                Our interviewer will connect with you as scheduled.
              </p>

              <p style="font-size:14px;margin-top:15px">
                For any queries or assistance, feel free to contact us:
              </p>

              <p style="font-size:14px;line-height:1.8">
                📲 <strong>WhatsApp:</strong>
                <a href="https://wa.me/919437401378"
                   style="color:#1f3c88;text-decoration:none">
                   +91 94374 01378
                </a><br/>

                🌐 <strong>Website:</strong>
                <a href="https://www.odiaittraininghub.in/"
                   style="color:#1f3c88;text-decoration:none">
                   www.odiaittraininghub.in
                </a>
              </p>

              <p style="margin-top:30px;font-size:14px">
                Best regards,<br/>
                <strong>Odia IT Training Hub Team</strong><br/>
                Empowering the next generation of IT professionals
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f0f2f8;text-align:center;
                       padding:15px;font-size:12px;color:#666">
              © ${new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `,
    };

    /* =========================
       2️⃣ TEACHER NOTIFICATION
       ========================= */
    const teacherMail = {
      from: `"Odia IT Training Hub" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "New Interview Slot Booked",
      html: `
        <p><strong>New interview slot booked</strong></p>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>

        <br/>
        <p>— Odia IT Training Hub</p>
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
