import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const ENV = process.env
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  ENV.CLIENT_ID,
  ENV.CLIENT_SECRET,
  ENV.REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: ENV.REFRESH_TOKEN
})

const accessToken = oauth2Client.getAccessToken()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: ENV.EMAIL_ADDRESS,
    clientId: ENV.CLIENT_ID,
    clientSecret: ENV.CLIENT_SECRET,
    refreshToken: ENV.REFRESH_TOKEN,
    accessToken: accessToken
  }
})

export const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
