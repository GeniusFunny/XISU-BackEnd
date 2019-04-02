const ProcessPool = require('node-process-pool')
const login = require('./crawler-login').LoginDao
const stdInfo = require('./crawler-stdInfo').StdInfoDao
const score = require('./crawler-score').ScoreDao
const courseTable = require('./crawler-CourseTableDao').CourseTableDao
const sleep = require('../util/sleep').sleep
const path = require('path')
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
    dependency: `const fs = require('fs')\nconst path = require('path')\nconst login = require('./crawler-login').LoginDao\nconst stdInfo = require('./crawler-stdInfo').StdInfoDao\nconst score = require('./crawler-score').ScoreDao\nconst courseTable = require('./crawler-CourseTableDao').CourseTableDao\nconst sleep = require('../util/sleep').sleep\n`,
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
        fs.appendFile(path.resolve(__dirname, '../sql/users.sql'), `INSERT INTO user(id, password, cookie) VALUES('${userId}', '${userId}', '${cookie}');`, (err) => {
          if (err) {
            console.error(err)
          }
        })
        try {
          let course = await score(cookie, userId)
          course.forEach(item => {
            fs.appendFile(path.resolve(__dirname, '../sql/course.sql'), `INSERT INTO course(courseId, term, kind, year, courseName) VALUES('${item.id}', '${item.term}', '${item.kind}', '${item.year}', '${item.className}');`, (err) => {
              if (err) {
                console.error(err)
              }
            })
            fs.appendFile(path.resolve(__dirname, '../sql/score.sql'), `INSERT INTO courseScore(id, courseId, score) VALUES('${userId}', '${item.id}', '${item.score}');`, (err) => {
              if (err) {
                console.error(err)
              }
            })
          })
        } catch (e) {
          throw new Error('爬取成绩失败')
        }
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
