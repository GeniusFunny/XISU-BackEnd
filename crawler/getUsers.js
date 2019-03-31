const ProcessPool = require('node-process-pool')
const login = require('./dao/LoginDao').LoginDao
const stdInfo = require('./dao/StdInfoDao').StdInfoDao
const score = require('./dao/ScoreDao').ScoreDao
const courseTable = require('./dao/CourseTableDao').CourseTableDao
const sleep = require('../util/sleep').sleep
const fs = require('fs')

async function main() {
  const usersOf2016 = 107242016000000
  const usersOf2017 = 107242017000000
  const usersOf2018 = 107242018000000
  const users = []
  for (let i = 0; i < 4000; i++) {
    users.push([usersOf2016 + i])
    users.push([usersOf2017 + i])
    users.push([usersOf2018 + i])
  }
  const processPool = new ProcessPool({
    maxParallelProcess: 50,
    timeToClose: 60 * 1000,
    taskParams: users,
    dependency: `const fetchCookie = require('./dao/CookieDao').CookieDao\nconst login = require('./dao/LoginDao').LoginDao\nconst stdInfo = require('./dao/StdInfoDao').StdInfoDao\nconst score = require('./dao/ScoreDao').ScoreDao\nconst courseTable = require('./dao/CourseTableDao').CourseTableDao\nconst sleep = require('../util/sleep').sleep\nconst fs = require('fs')\n`,
    workDir: __dirname,
    taskName: 'getUsersWithProcessPool',
    script: async function task(workParam) {
      let cookie = ''
      const userId = workParam[0]
      const password = workParam[0]
      try {
        let data = await login(userId, password)
        cookie = data.cookie
      } catch (e) {
        console.log(e)
      }
      if (cookie) {
        fs.appendFile('users.txt', `INSERT INTO user(id, password, cookie) VALUES('${userId}', '${userId}', '${cookie}');`, (err) => {
          if (err) {
            console.error(err)
          }
        })
        // try {
        //   await score(cookie, userId)
        // } catch (e) {
        //   throw new Error('爬取成绩失败')
        // }
        // sleep(500)
        // try {
        //   await courseTable(userId)
        // } catch (e) {
        //   throw new Error('爬取课程表失败')
        // }
      }
    }
  })
  processPool.run()
}

setImmediate(async () => {
  console.log(Date.now())
  await main()
  await console.log(Date.now())
})
