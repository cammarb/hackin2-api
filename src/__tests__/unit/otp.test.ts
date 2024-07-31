import { generateOTP, sendOTPEmail } from '../../utils/otp'
import nodemailer from 'nodemailer'

describe('Generate OTP code', () => {
  it('should return the OTP', () => {
    const otp = generateOTP()
    expect(typeof otp).toBe('string')
    expect(otp.length).toBe(6)
    expect(/^[A-Z0-9]{6}$/.test(otp)).toBe(true)
  })
})

jest.mock('nodemailer')

describe('Send OTP email', () => {
  let mockSendMail: jest.Mock<any, any, any>

  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue('mocked response')
    nodemailer.createTransport = jest
      .fn()
      .mockReturnValue({ sendMail: mockSendMail })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send an email with the correct parameters', async () => {
    const email = 'test@example.com'
    const otp = 'ABC123'

    await sendOTPEmail(email, otp)

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: process.env.OTP_SERVICE,
      auth: {
        user: process.env.OTP_USER,
        pass: process.env.OTP_PASS,
      },
    })

    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.OTP_USER,
      to: email,
      subject: 'Hackin2 - Verification Code',
      text: `Your OTP code is: ${otp}`,
    })
  })
})
