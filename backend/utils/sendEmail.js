const nodemailer = require("nodemailer");

const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    if (!userEmail || !verificationCode) throw new Error("Email and verification code are required");
    // console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: "Verify Your Email",
      text: `Thanks for registering!, just one step away from access. Here is your verification code: ${verificationCode}. It expires in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send verification email.");
  }
};

module.exports = sendVerificationEmail;
