import nodemailer from "nodemailer";

async function sendRegistrationConfirmation(email) {
  // Create a nodemailer transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "demo747724@gmail.com", // Replace with your Gmail email
      pass: process.env.SENDER_MAIL_PASSWORD, // Replace with your Gmail App Password
    },
  });

  // Define mail options with an improved HTML content
  const mailOptions = {
    from: "sakshitelang691@gmail.com", // Replace with your Gmail email
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
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendRegistrationConfirmation;
