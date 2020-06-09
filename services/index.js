import cron from 'node-cron'
// import { sendMail } from './mail'
import { User } from '../models/index.js'
import { Util } from '../utils/index.js'
import { CONFIG } from '../config/index.js'

async function emailTask() {
  const result1 = User.countDocuments({ bornAt: Util.twoDaysMonth() })
  const result2 = await result1.exec()
  console.log(result2)
  // scheduled to run 3am everyday '0 3 * * *'
  // cron.schedule('*/10 * * * * *', async () => {
  await User.find({
    bornAt: Util.twoDaysMonth()
  }, (err, doc) => {
    if (!err && doc.length !== 0) {
      doc.forEach(item => {
        console.log(item.firstname, item.lastname, 'was born on', item.bornAt)
        // sendMail({
        //   from: CONFIG.EMAIL_ADDRESS,
        //   to: item.email,
        //   subject: 'Happy Birthday ' + item.firstname,
        //   html: '<div><p>Today a rare gem was born, we at RCNLagos celebrate you</p></div>'
        // })
      })
    }
  })
  // })
}

export {
  emailTask
}
