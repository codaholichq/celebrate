import express from 'express'
import { admin, user } from '../controllers/index.js'
// import { getCache, clearCache, clearCacheById } from '../data/cache'

const routes = express.Router({
  strict: true
})

// api routes
routes.get(['/read', '/read/:id'], admin.verifyToken, user.read)
routes.post('/create', user.create)
routes.put('/update/:id', user.update)
routes.delete('/remove/:id', user.remove)

// authentication routes
routes.post('/login', admin.login)
routes.post('/signup', admin.signup)

// Notification routes
routes.post('/subscribe')
routes.post('/unsubscribe')

//this route is just to test that app is working
routes.get('/', (req, res) => {
  res.json({ message: 'Connected!' })
})

export { routes }
