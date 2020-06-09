import mongoose from 'mongoose'
import { Util } from '../utils/index.js'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  firstname: {
    type: String,
    maxlength: 15,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 15,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    maxlength: 6,
    minlength: 4,
    required: true,
    trim: true
  },
  email: {
    type: String,
    maxlength: 60,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },

  cell: {
    type: String,
    maxlength: 60,
    required: true,
    trim: true,
  },

  bornAt: {
    type: String,
    required: true,
    maxlength: 5,
    minlength: 5,
    trim: true
  },
  marriedOn: {
    type: String,
    required: false,
    trim: true
  }
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  get: v => v.toDateString()
})

UserSchema.pre('save', function (next) {
  this.firstname = Util.capitalize(this.firstname)
  this.lastname = Util.capitalize(this.lastname)
  next()
})

UserSchema.indexes({ email: 1 }, { unique: true })
const User = model('User', UserSchema)

export { User }
