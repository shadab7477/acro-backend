import nodemailer from "nodemailer";

async function sendOtpMail(email, otp) {
  // Create a nodemailer transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "demo747724@gmail.com",
      pass: process.env.SENDER_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "sakshitelang691@gmail.com",
    to: email,
    subject: "Forgot Password OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Forgot Password OTP</h2>
        <p style="color: #555; font-size: 16px;">Dear User,</p>
        <p style="color: #555; font-size: 16px;">
          You have requested a one-time password (OTP) to reset your password for Acropolis.
        </p>
        <p style="color: #555; font-size: 16px;">
          <strong>Your OTP:</strong> ${otp}
        </p>
        <p style="color: #555; font-size: 16px;">
          Please use this OTP to complete the password reset process.
        </p>
        <p style="color: #555; font-size: 16px;">
          If you did not request this, please ignore this email.
        </p>
        <p style="color: #555; font-size: 16px;">Best Regards,<br/>Acropolis</p>
      </div>
    `,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default sendOtpMail;
