const query = require('../util/db')
const ProcessPool = require('node-process-pool')
const fetchCookie = require('../db/CookieDao').CookieDao
const login = require('./crawler-login').LoginDao
const stdInfo = require('./crawler-stdInfo').StdInfoDao
async function getUserId() {
  let data = await query('SELECT * from user;')
  return data.map(item => item.id)
}
async function main() {
  let users = await getUserId()
  users = users.map(item => [item, item])
  users = users.concat(users).concat(users)
  const processPool = new ProcessPool({
    timeToClose: 60 * 1000,
    maxParallelProcess: 60,
    taskParams: users,
    workDir: __dirname,
    dependency: `const query = require('../util/query')\nconst ProcessPool = require('node-process-pool')\n
const fetchCookie = require('./dao/CookieDao').CookieDao\n
const login = require('./dao/LoginDao').LoginDao\n
const stdInfo = require('./dao/StdInfoDao').StdInfoDao\n`,
    taskName: 'getInfoWithProcessPool',
    script: async function task(workParam) {
      let cookie = ''
      const username = workParam[0]
      const password = workParam[0]
      if (typeof password !== 'undefined') {
        try {
          let data = await login(username, password)
          cookie = data.cookie
        } catch (e) {
          console.log(e)
          throw new Error('登陆失败')
        }
      } else {
        try {
          let data = await fetchCookie(userId)
          cookie = data[0].cookie
        } catch (e) {
          throw new Error('获取Cookie失败')
        }
      }
      if (cookie) {
        let data = await stdInfo(cookie)
        console.log(data)
      }
    }
  })
  processPool.run()
}

setImmediate(async () => {
  await main()
})

