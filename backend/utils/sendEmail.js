const nodemailer = require("nodemailer");

const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    if (!userEmail || !verificationCode) {
      throw new Error("Email and verification code are required");
    }

    // Use SendGrid via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey", 
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: process.env.HOST_EMAIL, 
      to: userEmail,
      subject: "Verify Your Email",
      text: `Thanks for registering! Here is your verification code: ${verificationCode}. It expires in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send verification email.");
  }
};

module.exports = sendVerificationEmail;
