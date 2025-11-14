import nodemailer from "nodemailer"
import logger from "./logger.js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
})

const sendEmail = async (
  email: string,
  otp: string,
  subject: string = "Your Chat-Hive OTP"
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Chat-Hive" <${process.env.NODE_MAILER_USER}>`,
      to: email,
      subject: subject,
      text: `Your One-Time Password (OTP) is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4A90E2;">Chat-Hive</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #4A90E2;">${otp}</h3>
          <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
          <br />
          <p>Regards,</p>
          <p><strong>Chat-Hive Team</strong></p>
        </div>
      `,
    })
    return true
  } catch (error) {
    logger.error(`Error in sending mail to -> ${error}`)
    return false
  }
}

export default sendEmail
