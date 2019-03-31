const redis = require('redis')
const {promisify} = require('util')
const client = redis.createClient()
const hgetAsync = promisify(client.hget).bind(client)
const getAsync = promisify(client.get).bind(client)

async function readCache(key, field) {
  try {
    return await hgetAsync(key, field)
  } catch (e) {
    throw new Error(e)
  }
}

async function writeCache(key, field, value) {
  try {
    await client.hset(key, field, value)
  } catch (e) {
    throw new Error('缓存写入数据失败')
  }
}
exports.read = readCache
exports.write = writeCache
