import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/index.js'
import { CONFIG } from '../config/index.js'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (typeof token === undefined) return res.sendStatus(401)

  jwt.verify(token, CONFIG.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err.message)
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

const login = (req, res) => {

  const { email, password } = req.body

  Admin.findOne({ email }, (err, doc) => {
    if (err) {
      return res.json({ 'error': err })
    }

    if (doc.length === 0) {
      return res.status(400).json({
        message: 'Admin was not found!',
        success: false
      })
    }

    const { _id, fname, cell } = doc
    bcrypt.compare(password, doc.password, (err, result) => {
      if (err) res.send(err.message)
      if (!result) {
        res.json({ message: 'Wrong username or password' })
      }

      const payload = { _id, fname, cell }
      const options = { expiresIn: '1d', issuer: 'https://emmysteven.com' }
      const secret = CONFIG.JWT_SECRET
      const token = jwt.sign(payload, secret, options)

      res.status(200).send({ auth: true, token })
    })

  })
}

const signup = (req, res) => {

  Admin.findOne({ email: req.body.email }, (err, doc) => {
    if (err) {
      return res.json({ 'error': err })
    }
    if (doc) {
      return res.status(400).json({
        message: 'Email is already taken',
        success: false
      })
    }
    const admin = new Admin({ ...req.body })
    admin.save((err, doc) => {
      if (err) {
        return res.status(500).json({
          message: "Unable to create your account, please try again later!",
          success: false,
          // error: err
        })
      }
      return res.status(201).json({
        message: doc.fname + ' was successfully registered!',
        success: true
      })
    })

  })
}

const logout = function (req, res, next) {
  res.status(200).send({ auth: false, token: null })
}

export const admin = {
  login,
  logout,
  signup,
  verifyToken
}
