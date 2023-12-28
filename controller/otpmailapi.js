import nodemailer from "nodemailer";

async function sendRegistrationOtp(email, otp) {
  // Create a nodemailer transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sakshitelang691@gmail.com", // Replace with your Gmail email
      pass: process.env.SENDER_MAIL_PASSWORD, // Replace with your Gmail App Password
    },
  });

  // Define mail options with an improved HTML content
  const mailOptions = {
    from: "sakshitelang691@gmail.com", // Replace with your Gmail email
    to: email,
    subject: "Registration OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Registration OTP</h2>
        <p style="color: #555; font-size: 16px;">
          Thank you for choosing Acropolis! To complete your registration, please use the following one-time password (OTP):
        </p>
        <h1 style="color: #007BFF; font-size: 24px;">${otp}</h1>
        <p style="color: #555; font-size: 16px;">
          Please enter this OTP on the registration page to verify your email address.
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

export default sendRegistrationOtp;
