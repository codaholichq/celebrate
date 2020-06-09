import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { CONFIG } from '../config/index.js'

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  CONFIG.CLIENT_ID,
  CONFIG.CLIENT_SECRET,
  CONFIG.REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: CONFIG.REFRESH_TOKEN
})

const accessToken = oauth2Client.getAccessToken()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: CONFIG.EMAIL_ADDRESS,
    clientId: CONFIG.CLIENT_ID,
    clientSecret: CONFIG.CLIENT_SECRET,
    refreshToken: CONFIG.REFRESH_TOKEN,
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
