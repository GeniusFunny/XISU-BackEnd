const score = require('./dao/ScoreDao').ScoreDao
const fetchCookie = require('./dao/CookieDao').CookieDao
const courseTable = require('./dao/CourseTableDao').CourseTableDao
const login = require('./dao/LoginDao').LoginDao
const sleep = require('../util/sleep').sleep
const stdInfo = require('./dao/StdInfoDao').StdInfoDao
const fs = require('fs')


const userId = process.argv[2]
const password = process.argv[3]

async function crawler() {
  let cookie = ''
  if (typeof password !== 'undefined') {
    try {
      let data = await login(userId, password)
      cookie = data.cookie
    } catch (e) {
      console.log(e)
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
     // 获取账户密码
    fs.appendFile('2018.txt', `INSERT INTO user(id, password, cookie) VALUES('${userId}', '${userId}', '${cookie}');`, (err) => {
      if (err) {
        console.error(err)
      }
    })

    try {
      await score(cookie, userId)
    } catch (e) {
      throw new Error('爬取成绩失败')
    }
    sleep(500)
    try {
      await courseTable(userId)
    } catch (e) {
      throw new Error('爬取课程表失败')
    }
  }
}

setImmediate(async () => {
  try {
    await crawler()
  } catch (e) {
    // process.abort()
  }
})
