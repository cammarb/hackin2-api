import { generate } from 'otp-generator'
import { createTransport } from 'nodemailer'

export const generateOTP = (): string => {
  const otp = generate(6, {
    digits: true,
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
  })
  return otp
}

export const sendOTPEmail = async (email: string, otp: string) => {
  const transport = createTransport({
    service: process.env.OTP_SERVICE,
    auth: {
      user: process.env.OTP_USER,
      pass: process.env.OTP_PASS,
    },
  })
  const info = await transport.sendMail({
    from: process.env.OTP_USER,
    to: email,
    subject: 'Hackin2 - Verification Code',
    text: `Your OTP code is: ${otp}`,
  })
}
