"use strict"
import redis from 'redis'
import mongoose from 'mongoose'
import { promisify } from 'util'
import consola from 'consola'

const { success, error } = consola

const client = redis.createClient(process.env.REDIS_URL)
  .on('connect', () => success({
    message: "App connected to Redis",
    badge: true
  })
  ).on('error', err => error({ message: err.message, badge: true }))

client.hget = promisify(client.hget)

const exec = mongoose.Query.prototype.exec
const Query = mongoose.Query

Query.prototype.cache = function (options = { time: 60 }) {
  this.useCache = true
  this.time = options.time
  this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
  return this
}

Query.prototype.exec = async function (...params) {
  if (!this.useCache) {
    return await exec.apply(this, params)
  }

  const key = JSON.stringify({ ...this.getQuery() })
  const cacheValue = await client.hget(this.hashKey, key)

  if (cacheValue) {
    const doc = JSON.parse(cacheValue)
    console.log("Response from Redis")

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc)
  }

  const result = await exec.apply(this, params)
  console.log(this.time)

  client.hset(this.hashKey, key, JSON.stringify(result))
  client.expire(this.hashKey, this.time)
  console.log("Response from MongoDB")

  return result
}

export function clearKey(hashKey) {
  client.del(JSON.stringify(hashKey));
}
