import nodemailer from "nodemailer";

async function sendRegistrationConfirmation(email) {
  // Create a nodemailer transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.SENDER_MAIL_PASSWORD,
    },
  });

  // Define mail options with an improved HTML content
  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Registration Successful",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Registration Successful</h2>
        <p style="color: #555; font-size: 16px;">
          Congratulations! You have successfully registered on Acropolis.
        </p>
        <p style="color: #555; font-size: 16px;">
          Thank you for choosing Acropolis. We look forward to serving you.
        </p>
        <p style="color: #555; font-size: 16px;">
          If you have any questions or need assistance, feel free to contact us.
        </p>
        <p style="color: #555; font-size: 16px;">Best Regards,<br/>Acropolis</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendRegistrationConfirmation;
