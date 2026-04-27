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
      subject: "🎉 Welcome to Odia IT Training Hub - Registration Approved",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            
            <div style="background:#0d6efd; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0;">Odia IT Training Hub</h1>
              <p style="margin:5px 0 0;">Learn Skills. Build Career. Grow Faster.</p>
            </div>

            <div style="padding:30px; color:#333;">
              <h2>Hello ${name}, 👋</h2>

              <p>
                Congratulations! Your registration for 
                <strong>Odia IT Training Hub</strong> has been 
                <span style="color:green;"><strong>successfully approved</strong></span>.
              </p>

              <p>
                You can now log in to your account and start learning with our premium training programs.
              </p>

              <h3 style="color:#0d6efd;">🚀 What You Will Get:</h3>
              <ul style="line-height:1.8;">
                <li>Full Stack Web Development Training</li>
                <li>AWS Cloud & DevOps Training</li>
                <li>React JS / Next JS Live Classes</li>
                <li>JavaScript & Modern Frontend Skills</li>
                <li>Real-Time Projects</li>
                <li>Interview Preparation</li>
                <li>Resume Building Support</li>
                <li>Career Guidance in Odia Language</li>
              </ul>

              <h3 style="color:#0d6efd;">📚 Why Choose Us?</h3>
              <p>
                We provide practical IT training specially designed for Odia students and job seekers 
                who want to build careers in software, cloud, and development fields.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="#" style="background:#0d6efd; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold;">
                  Login Now
                </a>
              </div>

              <p>
                If you need any support, feel free to contact our team anytime.
              </p>

              <p style="margin-top:30px;">
                Regards,<br/>
                <strong>Odia IT Training Hub Team</strong>
              </p>
            </div>

            <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:13px; color:#666;">
              © 2026 Odia IT Training Hub | Empowering Students with IT Skills
            </div>

          </div>
        </div>
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
