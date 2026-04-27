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
          <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <div style="background:#0d6efd; color:#ffffff; padding:25px; text-align:center;">
              <h1 style="margin:0;">Odia IT Training Hub</h1>
              <p style="margin:8px 0 0;">Learn Skills • Get Job Ready • Build Career</p>
            </div>

            <div style="padding:30px; color:#333; line-height:1.7;">

              <h2>Hello ${name}, 👋</h2>

              <p>
                Your registration for 
                <strong>Odia IT Training Hub</strong> has been 
                <span style="color:green;"><strong>approved successfully</strong></span>.
              </p>

              <p>
                You can now access our training programs and start building your career in IT industry.
              </p>

              <h3 style="color:#0d6efd;">🚀 Training Programs Included:</h3>

              <ul>
                <li>Full Stack Development (HTML, CSS, JavaScript, React, Next.js)</li>
                <li>AWS Cloud & DevOps Training</li>
                <li>Linux Administration Basics</li>
                <li>Git / GitHub / CI-CD Pipelines</li>
                <li>Real-Time Projects & Hands-on Practice</li>
              </ul>

              <h3 style="color:#0d6efd;">🛠 SRE / Production Support Skills:</h3>

              <ul>
                <li>Site Reliability Engineering (SRE) Basics</li>
                <li>Production Support Roles & Responsibilities</li>
                <li>Incident Management Process</li>
                <li>Monitoring Tools (CloudWatch, Grafana, Prometheus)</li>
                <li>Log Analysis & Troubleshooting</li>
                <li>Server Health Checks</li>
                <li>Application Downtime Handling</li>
                <li>Root Cause Analysis (RCA)</li>
                <li>Alerting & Escalation Process</li>
                <li>24/7 Support Environment Overview</li>
                <li>Shell Scripting Basics</li>
                <li>Automation for Repetitive Tasks</li>
              </ul>

              <h3 style="color:#0d6efd;">🎯 Career Support:</h3>

              <ul>
                <li>Interview Questions for SRE / Support Roles</li>
                <li>Resume Preparation</li>
                <li>Mock Interviews</li>
                <li>Job Guidance for Freshers & Experienced</li>
                <li>Training Support in Odia Language</li>
              </ul>

              <div style="text-align:center; margin:35px 0;">
                <a href="#"
                  style="
                    background:#0d6efd;
                    color:#ffffff;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                  ">
                  Login & Start Learning
                </a>
              </div>

              <p>
                We are excited to help you grow your IT career with practical learning and job-ready skills.
              </p>

              <p style="margin-top:30px;">
                Regards,<br/>
                <strong>Odia IT Training Hub Team</strong>
              </p>

            </div>

            <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:13px; color:#666;">
              © 2026 Odia IT Training Hub | Skills for Future Careers
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
