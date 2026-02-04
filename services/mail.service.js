import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SEJ Ayurveda" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });

    return info;
  } catch (error) {
    console.error("❌ Mail Error:", error);
    throw new Error("Mail sending failed");
  }
};
