import { Schema, model } from 'mongoose'

const schema = new Schema({
  endpoint: String,
  keys: Schema.Types.Mixed,
  createDate: {
    type: Date,
    default: Date.now
  }
})

export const Subscription = model('subscriptions', schema)
