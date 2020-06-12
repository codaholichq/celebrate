import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/index.js'

const ENV = process.env

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (typeof token === undefined) return res.sendStatus(401)

  jwt.verify(token, ENV.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err.message)
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

const login = async (req, res) => {

  const { email, password } = req.body
  const admin = await Admin.findOne({ email })

  if (!admin) {
    return res.status(404).json({
      message: 'Admin was not found!',
      success: false
    })
  }

  try {
    const { _id, fname, cell } = admin
    const isPass = bcrypt.compare(password, admin.password)

    if (!isPass) {
      res.status(400).json({
        message: 'Wrong email or password',
        success: false
      })
    }

    const payload = { _id, fname, cell }
    const options = { expiresIn: '1d', issuer: 'https://emmysteven.com' }
    const secret = ENV.JWT_SECRET
    const token = jwt.sign(payload, secret, options)
    res.status(200).send({ auth: true, token })

  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false
    })
  }
}

const signup = async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email })

  if (admin) {
    res.status(201).json({
      message: 'Email is already taken!',
      success: false
    })
  }

  try {
    admin = new Admin({ ...req.body })
    await admin.save()
    res.status(201).json({
      message: 'Admin was added successfully!',
      success: true
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false
    })
  }

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
