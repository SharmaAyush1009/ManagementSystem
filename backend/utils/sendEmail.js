const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (userEmail, verificationCode) => {
  try {
    if (!userEmail || !verificationCode) throw new Error("Email and verification code are required");

    const msg = {
      to: userEmail,
      from: process.env.HOST_EMAIL, 
      subject: "Verify Your Email",
      text: `Thanks for registering! Here is your verification code: ${verificationCode}. It expires in 10 minutes.`,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent:", response[0].statusCode);
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send verification email.");
  }
};

module.exports = sendVerificationEmail;
