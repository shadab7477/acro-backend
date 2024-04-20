import nodemailer from "nodemailer";

async function sendFeedbackMail(name, email, feedback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sakshitelang691@gmail.com",
      pass: process.env.SENDER_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "sakshitelang691@gmail.com",
    to: "sakshitelang691@gmail.com", // Replace with the email where you want to receive feedback
    subject: "User Feedback",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">User Feedback</h2>
        <p style="color: #555; font-size: 16px;"><strong>Name:</strong> ${name}</p>
        <p style="color: #555; font-size: 16px;"><strong>Email:</strong> ${email}</p>
        <p style="color: #555; font-size: 16px;"><strong>Feedback:</strong></p>
        <p style="color: #555; font-size: 16px;">${feedback}</p>
        <p style="color: #555; font-size: 16px;">Best Regards,<br/>Acropolis</p>
      </div>
    `,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending feedback email:", error);
    return false;
  }
}

export default sendFeedbackMail;
