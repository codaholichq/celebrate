import webpush from 'web-push'
import { User } from '../models/index.js'
import { Util } from '../utils/index.js'



webpush.setVapidDetails(
  'mailto:emmysteven@gmail.com',
  publicVapidKeys,
  privateVapidKeys
)

// const testUser = async () => {
//   const user = await User.findOne({
//     bornAt: Util.twoDaysMonth()
//   }).exec((err, doc) => {
//     if (!err) return doc
//   })
//   return user
// }

const notify = async (req, res, next) => {
  const subscription = req.body
  res.status(201).json({})

  await User.findOne({ bornAt: Util.twoDaysMonth() }, (err, doc) => {
    if (!err && doc.lenght !== 0) {
      const payload = JSON.stringify({
        title: 'RCNLagos Event Notification',
        message: doc.firstname + ' ' + doc.lastname + ' birthday in two days'
      })

      webpush.sendNotification(subscription, payload).catch(err => {
        console.error(err)
      })
    }
    else next()
  })
}

export {
  notify,
}
