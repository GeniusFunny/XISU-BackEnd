const fs = require('fs')
const path = require('path')
const login = require('./crawler-login').LoginDao
const stdInfo = require('./crawler-stdInfo').StdInfoDao
const score = require('./crawler-score').ScoreDao
const courseTable = require('./crawler-CourseTableDao').CourseTableDao
const sleep = require('../util/sleep').sleep

async function task(workParam) {
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
    }/**
 * 当进程被子进程创建后，立刻执行工作任务
 */
async function firstTask() {
  const workParam = process.argv.slice(2)
  await task(workParam)
}
/**
 * 完成任务，提示进程池已完成，工作进程空闲
 */
async function finishTask() {
  await process.send('finish')
}
/**
 * 任务失败，提示进程池未完成，归还任务
 */
async function unFinishTask() {
  await process.send('failed')
}
/**
 * 监听进程池后续指派的任务
 */
process.on('message', async workParam => {
  await task(workParam)
  try {
    await finishTask()
  } catch (e) {
    await unFinishTask()
  }
})
/**
 * 进程被创建时立即执行进程池指派的任务
 * @returns {Promise<void>}
 */
async function main() {
  try {
    await firstTask()
    await finishTask()
  } catch (e) {
    await unFinishTask()
  }
}
main()
/**
 * @name 工作进程负责的任务
 * @param workParam // 执行任务所需的参数数组
 * 动态添加任务脚本到此文件尾部
 */
