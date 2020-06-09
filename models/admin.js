import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const value = {
  type: String,
  required: true,
  trim: true,
  unique: false
}

const AdminSchema = new Schema({
  fname: value,
  lname: value,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  cell: {
    type: String,
    maxlength: 60,
    trim: true,
  },
  password: value.trim = false
}, {
  timestamps: true,
  get: v => v.toDateString()
})

/**
 * This preproccessed function hashes plaintext password
 * @param  password
 * @return no return
 * @description I didn't use arrow function 'cause it uses lexical this
 * which will make password to return undefined
 */

AdminSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }
    this.password = hash
    next()
  })
})

const Admin = model('Admin', AdminSchema)

export { Admin }
